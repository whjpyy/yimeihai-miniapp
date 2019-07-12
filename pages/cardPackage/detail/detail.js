const config = require('../../../config');
const { net } = require('../../../utils/index');

Page({
  data: {
    state: -1,
    canTransfer: false 
  },
  onLoad: function (options) {
    this.setData({
      state: options.state,
      cardId: options.cardId
    });
    this.getCardData();
  },
  getCardData: function() {
    var that = this;
    net.request({
      url: config.cardInfos,
      data: {
        id: that.data.cardId
      },
      success(res) {
        res.rule = res.rule.replace(/\r\n/g, ' ').split(' ');
        res.canTransfer = /[2]/g.test(res.transactionType);
        res.canUse = /[1]/g.test(res.transactionType);
        res.dataLoaded = true;
        that.setData(res);
      }
    });
  },
  cancelBooking: function() {
    var that = this;
    net.request({
      url: config.bookingCancel,
      data: {
        id: that.data.bookingId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.showModal({
          title: '友情提示',
          content: '取消预约成功~!',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      }
    });
  }
})