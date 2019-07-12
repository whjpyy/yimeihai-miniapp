const constants = require('./constants');
const net = require('./net');
const config = require('../../config');
const noop = () => {};

function order(payId, success) {
  wx.showLoading({
    title: '请稍后...',
    mask: true
  });
  wx.login({
    success(loginResult) {
      wx.hideLoading();
      net.request({
        url: config.order,
        data: { id: payId },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          code: loginResult.code
        },
        success: success
      });
    },
    fail: function (err) {
      wx.hideLoading();
      wx.showToast({
        title: constants.ERR_LOGIN_TIPS,
        icon: 'none',
        duration: 3000,
        mask: true
      });
    }
  });
}

function call(success) {
  net.request({
    url: config.payment,
    success: options.success
  });
}

function request(options = {}) {
  wx.requestPayment({
    timeStamp: options.timeStamp,
    nonceStr: options.nonceStr,
    package: options.package,
    signType: options.signType || 'MD5',
    paySign: options.paySign,
    success: options.success || noop,
    fail(err) {
      wx.showToast({
        title: constants.ERR_PAYMENT_TIPS,
        icon: 'none',
        duration: 3000,
        mask: true
      });
    }
  })
}

module.exports = {
  order,
  call,
  request
};