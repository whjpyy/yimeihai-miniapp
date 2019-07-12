const constants = require('./constants');
const login = require('./login');
const config = require('../../config');
const noop = () => { };

function request(options = {}) {
  let requireLogin = options.login;
  let success = options.success || noop;
  let fail = options.fail || noop;
  let complete = options.complete || noop;
  let originHeader = options.header || {};

  const callSuccess = function() {
    wx.hideLoading();
    success.apply(null, arguments);
    complete.apply(null, arguments);
  };

  const callFail = function (error) {
    wx.hideLoading();
    if(!options.fail) {
      wx.showToast({
        title: error.message ? error.message : constants.ERR_NET_TIPS,
        icon: 'none',
        duration: 3000,
        mask: true
      });
    }
    fail.apply(null, arguments);
    complete.apply(null, arguments);
  };

  wx.showLoading({
    title: '请稍后...',
    mask: true
  });

  requireLogin ? doRequsetWithLogin() : doRequest();

  function doRequestWithLogin() {
    login.userInfo({
      url: config.userInfo,
      data: data,
      success: doRequest,
      fail: callFail
    });
  }

  function doRequest() {
    wx.request(Object.assign({}, options, {
      header: originHeader,
      success(response) {
        if (!response || response.statusCode != 200 || response.data.code == "9999") {
          callFail(new Error(constants.ERR_SERVER_TIPS));
        } else {
          if (response.data.code == '0000') {
            callSuccess(response.data.rows, response.data.total);
          } else {
            if (options.branch) {
              wx.hideLoading();
              options.branch(response.data);
            } else {
              callFail(new Error(response.data.message));
            }
          }
        }
      },
      fail: callFail,
      complete: complete
    }));
  }
}

module.exports = {
  request
};