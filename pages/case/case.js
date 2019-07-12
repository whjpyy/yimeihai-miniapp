const app = getApp();
const config = require('../../config');
const {
  net
} = require('../../utils/index');

Page({
  data: {
    ajaxPage: true,
    showBottomOut: false,
    pageIndex: 1,
    list: []
  },
  onLoad: function(options) {
    this.getList()
  },
  onReachBottom: function() {
    this.getList()
  },
  //请求列表
  getList() {
    var that = this;
    app.scrollAjax(config.realCase, {
      version: config.currentVersion,
      pageIndex: that.data.pageIndex,
      pageSize: 10
    }, function(backData, pass, pageIndex) {
      that.setData({
        pageIndex,
        ajaxPage:pass,
        dataLoaded: true,
        list: that.data.list.concat(backData),
        showBottomOut: !pass
      });
    }, that.data.ajaxPage,that.data.list.length)
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