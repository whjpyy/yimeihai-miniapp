const config = require('../../config');
const {
  skey,
  net
} = require('../../utils/index');

Page({
  data: {
    cards: [],
    showBottomOut: false,
    pageIndex: 1,
    total: 0
  },
  onLoad: function (options) {
    var that = this;
    net.request({
      url: config.getFixedCard,
      success(res) {
        that.setData({
          courseId: res.id
        });
      }
    })
  },
  onReachBottom: function () {
    if (this.data.pageIndex < Math.ceil(this.data.total / 10)) {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      });
      this.getDataList();
    } else {
      if (!this.data.showBottomOut) {
        this.setData({
          showBottomOut: true
        });
      }
    }
  },
  getDataList: function () {
    var that = this;
    net.request({
      url: config.cards,
      data: {
        version: config.currentVersion,
        pageIndex: that.data.pageIndex
      },
      success(res, total) {
        that.setData({
          cards: that.data.cards.concat(res),
          total,
          dataLoaded: true
        });
      }
    });
  },
  onAuthOver: function () {
    var that = this;
    net.request({
      url: config.index,
      success(res) {
        that.getDataList();
      }
    });
  },
  orderBuy() {
    var courseId = this.courseId;
    this.checkBuy(courseId, function () {
      wx.navigateTo({
        url: '/pages/vipCard/cardDetail2/index'
      });
    })
  },
  checkBuy(cardId, fn) {
    net.request({
      url: config.orderExist,
      data: {
        userId: skey.get().id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(orderRes) {
        if (orderRes && orderRes.orderId) {
          wx.showModal({
            title: '友情提醒',
            content: '您有还未支付的订单，是否前往支付？',
            cancelText: '返回列表',
            confirmText: '前往支付',
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/order/order?pidx=1&cardId=' + cardId + '&orderId=' + orderRes.orderId
                });
              }
            }
          });
        } else {
          fn()
        }
      }
    });
  },
  buy: function (e) {
    var cardId = e.currentTarget.id;
    this.checkBuy(cardId, function () {
      wx.navigateTo({
        url: '/pages/vipCard/cardDetail/cardDetail?id=' + cardId
      });
    })
  }
})