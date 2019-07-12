const config = require('../../config');
const {
  skey,
  net
} = require('../../utils/index');
const {
  getInfo
} = require('../../utils/lib/user.js')

Page({
  data: {},
  onLoad: function(options) {},
  makeCall: function(e) {
    var tel = e.currentTarget.dataset.tel
    if (tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      });
    }
  },
  onAuthOver: function() {
    var that = this;
    net.request({
      url: config.center,
      data: {
        userId: skey.get().id
      },
      success(res) {
        that.setData(res);
      }
    });
  },
  onGotUserInfo(callData) {
    if(callData.detail.errMsg != 'getUserInfo:ok'){
      return
    }
    let that = this;
    let info = callData.detail.userInfo
    net.request({
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: config.updateUserNameLogo,
      data: {
        userId: skey.get().id,
        fullName: info.nickName,
        icon: info.avatarUrl
      },success(){
        net.request({
          url: config.center,
          data: {
            userId: skey.get().id
          },
          success(res) {
            that.setData(res);
          }
        });
      }
    })
  }
})