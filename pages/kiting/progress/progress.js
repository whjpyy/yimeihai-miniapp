const config = require('../../../config');
const { skey, net } = require('../../../utils/index');

Page({
  data: {
    progressIndex: 0,
    entrance: 1
  },
  onLoad: function (options) {
    if (typeof options.entrance != 'undefined') {
      
    }
    if(options.entrance == 0) {
      var kitingInfos = wx.getStorageSync('__KITING_INFOS__');
      wx.removeStorageSync('__KITING_INFOS__');
      kitingInfos.entrance = options.entrance;
      kitingInfos.cashWithdrawalAmount /=100;
      this.setData(kitingInfos);
    } else {
      this.setData({
        entrance: options.entrance
      });
      var that = this;
      net.request({
        url: config.kittingDetail,
        data: {
          id: options.id
        },
        success(res) {
          if (res.receiptTime) {
            res.progressIndex = 3;
          } else if (res.paymentTime) {
            res.progressIndex = 2;
          } else if (res.auditTime) {
            res.progressIndex = 1;
          }
          res.cashWithdrawalAmount = Number(res.cashWithdrawalAmount)/100; 
          that.setData(res);
        }
      });
    }
  }
})