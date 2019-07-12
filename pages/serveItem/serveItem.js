const app = getApp();
const config = require('../../config');
const {
  net
} = require('../../utils/index');

Page({
  data: {
    serve:[],
    showBottomOut: false,
    pageIndex: 1,
    scrollPass: true
  },
  onLoad: function(options) {
    this.getListData()
  },
  //请求借口
  getListData() {
    var that = this;
    //统一滚动借口请求
    app.scrollAjax(config.serve, {
      version: config.currentVersion,
      pageIndex: that.data.pageIndex,
      pageSize: 10
    }, function (backData, pass,pageIndex) {
      that.setData({
        pageIndex,
        dataLoaded: true,
        serve: that.data.serve.concat(backData),
        scrollPass: pass,
        showBottomOut: !pass
      });
    }, that.data.scrollPass,that.data.serve.length)
  },
  onReachBottom: function() {
    this.getListData()
  },
  jumpLink: function(e) {
    var url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: url
      });
    }
  }
})