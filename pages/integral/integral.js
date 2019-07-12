const config = require('../../config');
const { skey, net } = require('../../utils/index');

Page({
  data: {
    pageIndex: 1,
    items: [],
    isVip: true,
    amount: 0
  },
  onLoad: function (options) {
    this.setData({
      isVip: skey.get().memberLevelName
    });
  },
  onShow: function () {
    if (this.data.items.length) {
      this.getTotal();
    }
  },
  onReachBottom: function () {
    if (this.data.pageIndex < Math.ceil(this.data.total / 10)) {
      this.setData({ pageIndex: this.data.pageIndex + 1 });
      this.getRecordData();
    }
  },
  getRecordData: function() {
    var that = this;
    net.request({
      url: config.integral,
      data: {
        userId: skey.get().id,
        pageIndex: that.data.pageIndex,
        pageSize: 10
      },
      success(res) {
        res = res.map(v=>{
          v.alreadyAmount = v.alreadyAmount/100
          v.shouldAmount = v.shouldAmount / 100
          v.surplusAmount = v.surplusAmount / 100
          return v
        })
        that.setData({
          dataLoaded: true,
          items: that.data.items.concat(res)
        });
      }
    });
  },
  getTotal: function(call) {
    var that = this;
    net.request({
      url: config.integralTotal,
      data: {
        userId: skey.get().id
      },
      success(res) {
        that.setData({ amount: res/100 });
        call && call();
      }
    });
  },
  onAuthOver: function () {
    var that = this;
    this.setData({
      isVip: skey.get().memberLevelName
    });
    this.getTotal(function() {
      that.getRecordData();
    });
  }
})