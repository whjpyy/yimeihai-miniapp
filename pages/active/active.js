const config = require('../../config');
const { skey, net } = require('../../utils/index');

Page({
  data: {
  },
  onLoad: function (options) {
  },
  onAuthOver: function () {
    var that = this;
    net.request({
      url: config.active,
      success(res) {
        res.rule = res.rule.replace(/\\r\\n/g, ' ').split(' ');
        res.dataLoaded = true;
        that.setData(res);
      }
    });
  },
  onCallPhone(e){
    var tel = e.currentTarget.dataset.tel
    if (tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      });
    }
  },
  apply: function() {
    if (Date.now() > new Date(this.data.endTime)) {
      wx.showModal({
        title: '友情提示',
        content: '报名失败~！该活动已结束，无法报名~！',
        showCancel: false,
        confirmText: '我知道了',
        success(res) {
          if(res.confirm) { 
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/active/progress/progress?progressIndex=0&applyIndex=0&id=' + this.data.id
      });
    }
  }
})