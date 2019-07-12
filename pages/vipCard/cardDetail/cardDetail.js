const config = require('../../../config');
const { skey, net } = require('../../../utils/index');

Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;
    net.request({
      url: config.cardDetail,
      data: {
        id: options.id
      },
      success(res) {
        res.rule = res.rule.replace(/\r\n/g, ' ').split(' ');
        res.dataLoaded = true;
        that.setData(res);
      }
    });
  },
  orderBuy: function() {
    var that = this;
    net.request({
      url: config.cardCheck,
      data: {
        userId: skey.get().id,
        id: that.data.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.orderId) {
          wx.redirectTo({
            url: '/pages/order/order?pidx=1&cardId=' + that.data.id + '&orderId=' + res.orderId
          });
        } else {
          wx.redirectTo({
            url: '/pages/order/order?pidx=0&cardId=' + that.data.id
          });
        }
      },
      branch(res) {
        switch(res.code) {
          case "1002":
            wx.showModal({
              title: '友情提示',
              content: res.message,
              showCancel: true,
              cancelText: '查看卡包',
              confirmText: '我知道了',
              success(res) {
                if (res.cancel) {
                  wx.reLaunch({
                    url: '/pages/cardPackage/cardPackage'
                  });
                }
              }
            });
            break;
          case '1003':
            wx.showModal({
              title: '友情提示',
              content: res.message,
              confirmText: '我知道了',
              showCancel: false
            });
            break;
          default:
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000,
              mask: true
            });
        }
      }
    });
  }
})