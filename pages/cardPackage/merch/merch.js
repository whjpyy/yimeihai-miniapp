const config = require('../../../config');
const { net } = require('../../../utils/index');

Page({
  data: {
    merchs: [],
    checkedIdx: -1
  },
  onLoad: function (options) {
    var booingInfo = wx.getStorageSync('__BOOKING__');
    this.setData({ cardId: options.cardId });
    if (booingInfo && typeof booingInfo.merchIdx != 'undefined') {
      this.setData({ checkedIdx: booingInfo.merchIdx });
    }
    this.getOrderInfo();
  },
  onUnload: function () {
  },
  checkMerch: function(e) {
    let idx = e.currentTarget.dataset.idx;
    if (idx !== undefined && idx !== '') {
      this.setData({
        checkedIdx: idx
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
        that.setData({ 
          dataLoaded: true,
          merchs: res.shopList
        });
      }
    });
  },
  comfirm: function () {
    if (this.data.checkedIdx != -1) {
      let items = wx.getStorageSync('__BOOKING__') || {};
      items = Object.assign({}, items, {
        'merch': this.data.merchs[this.data.checkedIdx].name,
        'merchIdx': this.data.checkedIdx,
        'merchId': this.data.merchs[this.data.checkedIdx].id
      });
      wx.setStorageSync('__BOOKING__', items);
    }
    wx.navigateBack({
      delta: -1
    });
  }
})