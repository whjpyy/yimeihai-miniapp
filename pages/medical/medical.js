const app = getApp();
const config = require('../../config');
const {
  net
} = require('../../utils/index');

Page({
  data: {
    pageIndex: 1,
    medical: [],
    total: 0,
    showBottomOut: false,
    ajaxPass: true,//是否继续请求
  },
  onLoad: function(options) {
    this.getListData();
  },
  onReachBottom: function() {
    this.getListData()
  },
  //列表请求
  getListData: function() {
    var that = this;
    app.scrollAjax(config.medical, {
      pageIndex: that.data.pageIndex,
      pageSize: 10
    }, function(backData, pass, pageIndex) {
      that.setData({
        pageIndex,
        ajaxPass: pass,
        dataLoaded: true,
        showBottomOut: !pass,
        medical: that.data.medical.concat(backData),
      });
    }, that.data.ajaxPass,that.data.medical.length)
    // net.request({
    //   url: config.medical,
    //   data: {
    //     pageIndex: that.data.pageIndex,
    //     pageSize: 10
    //   },
    //   success(res, total) {
    //     that.setData({ 
    //       dataLoaded: true,
    //       medical: res,
    //       total
    //     });
    //   }
    // });
  }
})