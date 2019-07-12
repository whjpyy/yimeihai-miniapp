const config = require('../../config');
const { skey, net } = require('../../utils/index');

Page({
  data: {
    list: [],
    showPicker: false,
    columns: ['未使用', '已转让', '待使用', '已使用', '已过期'],
    pickerValue: '未使用',
    pickerIndex: 0,
    pageIndex: 1,
    total: 0
  },
  onLoad: function (options) {
  },
  onShow: function() {
    if (this.data.authed) {
      this.setData({
        pageIndex: 1,
        list: []
      });
      this.getListData();
    }
  },
  onReachBottom: function () {
    if (this.data.pageIndex < Math.ceil(this.data.total / 10)) {
      this.setData({ pageIndex: this.data.pageIndex + 1 });
      this.getListData();
    }
  },
  //切换
  onChange(e){
    let selected = e.detail;
    this.setData({
      pickerValue:selected,
      pickerIndex: this.data.columns.indexOf(selected)
    })
    this.setData({
      pageIndex: 1,
      total: 0,
      list: []
    });
    this.getListData();
  },
  getListData: function () {
    var that = this;
    net.request({
      url: config.cardPackage,
      data: {
        pageIndex: that.data.pageIndex,
        userId: skey.get().id,
        status: that.data.pickerIndex + 1
      },
      success(res, total) {
        switch (that.data.pageIndex){
          case 1:
            that.setData({
              list: res
            });
            break
          default:
            that.setData({
              list: that.data.list.concat(res)
            })
        };
        that.setData({ 
          dataLoaded: true,
          total
        });
      }
    });
  },
  picker: function () {
    this.setData({
      showPicker: true
    });
  },
  pickerConfirm: function (e) {
    if (e.detail.index != this.data.pickerIndex) {
      this.setData({
        showPicker: false,
        pickerValue: e.detail.value,
        pickerIndex: e.detail.index,
        pageIndex: 1,
        total: 0,
        list: []
      });
      this.getListData();
    } else {
      this.setData({
        showPicker: false
      });
    }
  },
  pickerCancel: function () {
    this.setData({
      showPicker: false
    });
  },
  onAuthOver: function () {
    this.setData({ authed: true });
    this.getListData();
  }
})