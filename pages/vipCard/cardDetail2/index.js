// pages/vipCard/cardDetail2/index.js
const config = require('../../../config');
const { skey, net } = require('../../../utils/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailImgHeight: '',
    showBottomOut: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    net.request({
      url: config.getFixedCard,
      success(res) {
        res.rule = res.rule.replace(/\r\n/g, ' ').split(' ');
        that.setData(res);
      }
    })
  },

  imageLoad(e){
    if (this.data.detailImgHeight === '') {
      var ratio = e.detail.width / e.detail.height;
      this.setData({
        detailImgHeight: (750 / ratio)
      });
    }
  },

  orderBuy: function () {
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
        switch (res.code) {
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.showBottomOut) {
      this.setData({
        showBottomOut: true
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})