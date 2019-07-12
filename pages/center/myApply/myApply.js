const config = require('../../../config');
const { skey, net } = require('../../../utils/index');

Page({
  data: {
    orders: [],
    showPicker: false,
    columns: ['待回访', '待消费', '已消费', '已关闭'],
    pickerValue: '待回访',
    pickerIndex: 0,
    pageIndex: 1
  },
  onLoad: function (options) {
  },
  onShow: function () {
    if (this.data.authed) {
      this.setData({
        pageIndex: 1,
        orders: []
      });
      this.getListData();
    }
  },
  //切换
  onChange(e) {
    let selected = e.detail;
    this.setData({
      pickerValue: selected,
      pickerIndex: this.data.columns.indexOf(selected)
    })
    this.setData({
      pageIndex: 1,
      total: 0,
      list: []
    });
    this.getListData();
  },
  onReachBottom: function () {
    if (this.data.pageIndex < Math.ceil(this.data.total / 10)) {
      this.setData({ pageIndex: this.data.pageIndex + 1 });
      this.getListData();
    }
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
        orders: []
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
    var that = this;
    this.setData({ authed: true });
    that.getListData();
  },
  getListData: function () {
    var that = this;
    net.request({
      url: config.myApply,
      data: {
        status: that.data.pickerIndex,
        pageIndex: that.data.pageIndex,
        pageSize: 10,
        userId: skey.get().id
      },
      success(res, total) {
        if (that.data.pageIndex != 1){
          that.setData({
            orders: that.data.orders.concat(res),
          })
        }else{
          that.setData({
            orders: res,
          })
        }
        that.setData({
          dataLoaded: true,
          total
        });
      }
    });
  }
})