const config = require('../../../config');
const { net } = require('../../../utils/index');

Page({
  data: {
    showConfirmDialog: false
  },
  onLoad: function (options) {
    this.setData({
      cardId: options.cardId,
      cardName: options.cardName
    });
  },
  submit: function(e) {
    var that = this;
    var data = e.detail.value;
    var errMessage = '';

    if (!data.mobile.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写接收人手机号~！';
    } else if (!data.code.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写接收人ID~！';
    }

    if (errMessage) {
      wx.showToast({
        title: errMessage,
        icon: 'none',
        duration: 3000,
        mask: true
      });
    } else {
      data.id = that.data.cardId;
      net.request({
        url: config.transferConfirm,
        data,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          res.infos = data;
          res.showConfirmDialog = true;
          that.setData(res);
        }
      });
    }
  },
  confirmTransfer: function (e) {
    var that = this;
    net.request({
      url: config.transfer,
      data: that.data.infos,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.setStorageSync('__TRANSFER_INFO__', res);
        wx.redirectTo({
          url: '/pages/cardPackage/success/success?entrence=1'
        });
      }
    });
  }
})