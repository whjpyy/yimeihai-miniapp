const config = require('../../../../config');
const { skey, net } = require('../../../../utils/index');

Page({
  data: {
    records: [],
    pageIndex: 1
  },
  onLoad: function (options) {
    this.getDataList();
  },
  onReachBottom: function () {
    if (this.data.pageIndex < Math.ceil(this.data.total / 10)) {
      this.setData({ pageIndex: this.data.pageIndex + 1 });
      this.getDataList();
    }
  },
  getDataList: function() {
    var that = this;
    net.request({
      url: config.popularize,
      data: {
        pageIndex: that.data.pageIndex,
        pageSize: 10,
        userId: skey.get().id
      },
      success(res, total) {
        that.setData({
          dataLoaded: true,
          records: that.data.records.concat(res),
          total
        });
      }
    });
  }
})