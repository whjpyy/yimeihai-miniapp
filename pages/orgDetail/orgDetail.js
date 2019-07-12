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
      url: config.medicalDetail,
      data: {
        id: options.id
      },
      success(res) {
        res.telephone = res.telephone.split(',');
        res.dataLoaded = true;
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
  detailImgLoad: function(e) {
    if (this.data.detailImgHeight === '') {
      var ratio = e.detail.width / e.detail.height;
      this.setData({
        detailImgHeight: (700 / ratio) + 'rpx'
      });
    }
  },
  makeCall: function(e) {
    var tel = e.currentTarget.dataset.tel
    if (tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      });
    }
  },
  jumpLink: function (e) {
    var url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: url
      });
    }
  }
});