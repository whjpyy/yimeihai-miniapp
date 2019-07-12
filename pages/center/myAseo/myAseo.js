const config = require('../../../config');
const { skey, net } = require('../../../utils/index');

Page({
  data: {
    qrCode: '',
    margin_top:'550rpx'
  },
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        let he = 1034 / (750 / res.windowWidth);
        if (res.windowHeight > he){
          let h = res.windowHeight-he;
          that.setData({
            margin_top: 550 + h+'rpx'
          })
        }
      }
    })
  },
  onShareAppMessage(){
    return {
      title: '青春不留白,要美就来壹美嗨',
      path: '/pages/invitation/invitation?scene=' + skey.get().code
    }
  },
  onClickImage() {
    wx.previewImage({
      current: this.data.qrCode, // 当前显示图片的http链接
      urls: [this.data.qrCode] // 需要预览的图片http链接列表
    })
  },
  onAuthOver: function () {
    var that = this;
    net.request({
      url: config.wxCode,
      data: {
        userId: skey.get().id,
        scene: skey.get().code
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(referRes) {
        that.setData({
          qrCode: referRes
        });
      }
    });
  }
})