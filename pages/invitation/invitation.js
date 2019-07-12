const config = require('../../config');
const { skey, net } = require('../../utils/index');

Page({
  data: {
  },
  onLoad: function (options) {
    this.setData({
      userCode: decodeURIComponent(options.scene)
    });
  },
  onAuthOver: function () {
    var myInfo = skey.get();
    myInfo.mobile = myInfo.mobile.replace(/(\d{3}).*(\d{4})/g, '$1***$2');
    this.setData({ myInfo });
    var that = this;
    net.request({
      url: config.invitation,
      data: {
        userCode: that.data.userCode,
        scanUserId: skey.get().id
      },
      success(res) {
        getApp().globalData.inviter = {
          invitationCode: res.invitationCode,
          mobile: res.mobile
        };
        that.setData(res);
      }
    });
  }
})