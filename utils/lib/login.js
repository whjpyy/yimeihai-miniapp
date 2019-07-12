const constants = require('./constants');
const config = require('../../config');
const noop = () => { };
const defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  url: null
};

function code2session(code, call) {
  wx.request({
    url: config.code2session,
    header: { code: code },
    success(res) {
      if (!res || res.statusCode != 200 || res.data.code == "9999") {
        call(null, new Error(constants.ERR_SERVER_TIPS));
      } else {
        if (res.data.code === '0000') {
          wx.setStorageSync(constants.HEADER_SKEY, res.data.rows);
          call(res.data.rows, null);
        } else {
          call(null, new Error(res.data.message));
        }
      }
    },
    fail(err) {
      call(null, new Error(constants.ERR_NET_TIPS));
    }
  });
}

function login(call) {
  wx.login({
    success(loginRes) {
      code2session(loginRes.code, (key, err) => {
        if (key) {
          wx.setStorageSync(constants.HEADER_SKEY, key);
          call(key, err);
        } else {
          call(null, err);
        }
      });
    },
    fail(err) {
      call(null, new Error(constants.ERR_LOGIN_TIPS));
    }
  });
}

function token(options = {}) {
  options = Object.assign({}, defaultOptions, options);
  wx.checkSession({
    success() {
      let key = wx.getStorageSync(constants.HEADER_SKEY);
      key ? options.success(key) : login((key, err) => {
        key ? options.success(key) : options.fail(err);
      });
    },
    fail() {
      login((key, err) => {
        key ? options.success(key) : options.fail(err);
      });
    }
  });
}

module.exports = {
  token
};