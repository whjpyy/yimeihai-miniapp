const config = require('../../../config');
const { skey, net } = require('../../../utils/index');

Page({
  data: {
    showPicker: false,
    columns: [],
    pickerValue: '请选择',
    merchValue: '请选择',
    datePickerValue: '请选择',
    showDatePicker: false,
    currentDate: null,
    minDate: null
  },
  onLoad: function (options) {
    wx.removeStorageSync('__BOOKING__');
    this.setData({
      cardId: options.cardId
    });
    this.getOrderInfo();
  },
  onShow: function () {
    this.initDatas();
  },
  onUnload: function () {
    wx.removeStorageSync('__BOOKING__');
  },
  picker: function () {
    this.setData({
      showPicker: true
    });
  },
  pickerConfirm: function (e) {
    this.saveItem('item', e.detail.value);
    this.saveItem('itemId', this.data.serveList[e.detail.index].id);
    this.setData({
      showPicker: false,
      pickerValue: e.detail.value
    });
  },
  pickerCancel: function () {
    this.setData({
      showPicker: false
    });
  },
  datePicker: function () {
    this.setData({
      showDatePicker: true
    });
  },
  datePickerConfirm: function (e) {
    let val = new Date(e.detail);
    val = val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate();
    this.saveItem('date', val);
    this.setData({
      showDatePicker: false,
      datePickerValue: val
    });
  },
  datePickerCancel: function () {
    this.setData({
      showDatePicker: false
    });
  },
  getItem: function() {
    return wx.getStorageSync('__BOOKING__') || {};
  },
  saveItem: function(type, value) {
    let items = this.getItem();
    items = Object.assign({}, items, { [type]: value });
    wx.setStorageSync('__BOOKING__', items);
  },
  initDatas: function() {
    var items = this.getItem();
    this.setData({
      currentDate: items.date ? new Date(items.date) : new Date().getTime(),
      minDate: new Date().getTime(),
      pickerValue: items.item || '请选择',
      merchValue: items.merch || '请选择',
      datePickerValue: items.date || '请选择',
    });
  },
  submit: function() {
    var that = this;
    var items = this.getItem();
    var errMessage = '';
    
    if (!items.itemId) {
      errMessage = '请选择预约项目~'
    } else if (!items.merchId) {
      errMessage = '请选择预约商家~'
    } else if(!items.date) {
      errMessage = '请选择预约上门时间~'
    }

    if (errMessage) {
      wx.showToast({
        title: errMessage,
        icon: 'none',
        duration: 3000,
        mask: true
      });
    } else {
      net.request({
        url: config.bookingSave,
        data: {
          id: that.data.cardId,
          serviceId: items.itemId,
          shopId: items.merchId,
          bookingTime: items.date,
          userId: skey.get().id
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          wx.setStorageSync('__BOOKING_INFO__', res);
          net.request({
            url: config.sendEmail,
            data: {
              shopId: items.merchId
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {},
            branch(res) {},
            fail(err) {}
          });
          wx.redirectTo({
            url: '/pages/cardPackage/success/success?entrence=0'
          });
        }
      });
    }
  },
  getOrderInfo: function () {
    var that = this;
    net.request({
      url: config.bookingInfo,
      data: {
        id: that.data.cardId
      },
      success(res) {
        let columns = [];
        for (let i = 0; i < res.serviceCategoryList.length; i++) {
          columns.push(res.serviceCategoryList[i].name);
        }
        that.setData({ 
          columns, 
          serveList: res.serviceCategoryList,
          orgList: res.shopList
        });
      }
    });
  }
})