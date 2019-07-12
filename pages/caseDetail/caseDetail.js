const config = require('../../config');
const { net } = require('../../utils/index');

Page({
  data: {
    detailImgHeight: '',
    showBottomOut: false
  },
  onLoad: function (options) {
    var that = this;
    net.request({
      url: config.realCaseDetail,
      data: {
        id: options.id
      },
      success(res) {
        res.content = res.content.replace(/\<.*\>(.*)\<\/.*\>/g, '$1');
        that.setData(res);
      }
    });
  },
  onReachBottom: function () {
    if (!this.data.showBottomOut) {
      this.setData({
        showBottomOut: true
      });
    }
  },
  detailImgLoad: function (e) {
    if (this.data.detailImgHeight === '') {
      var ratio = e.detail.width / e.detail.height;
      this.setData({
        detailImgHeight: (700 / ratio) + 'rpx'
      });
    }
  },
  makeCall: function (e) {
    var tel = e.currentTarget.dataset.tel
    if (tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      });
    }
  }
})