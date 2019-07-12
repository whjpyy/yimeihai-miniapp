const constants = require('./constants');
const config = require('../../config');
const skey = require('./skey');
const login = require('./login');
const noop = () => { };
const defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  url: null
};

function userInfo(call) {
  wx.getUserInfo({
    lang: 'zh_CN',
    success(res) {
      call({
        encryptedData: res.encryptedData,
        iv: res.iv
      }, null);
    },
    fail(userError) {
      call(null, new Error(constants.ERR_USER_INFOS_TIPS));
    }
  });
}

function decodeInfo(param, call) {
  wx.request({
    url: config.userInfo,
    header: param,
    success(res) {
      if (!res || res.statusCode != 200 || res.data.code == "9999") {
        call(null, new Error(constants.ERR_SERVER_TIPS));
      } else {
        if (res.data.code === '0000') {
          skey.set(res.data.rows);
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

function getInfo(options) {
  options = Object.assign({}, defaultOptions, options);
  login.token({
    success(key) {
      if (options.data) {
        options.data.sessionKey = key.session_key;
        decodeInfo(options.data, (res, err) => {
          res ? options.success(res) : options.fail(err);
        });
      } else {
        userInfo((user, err) => {
          user.sessionKey = key.session_key;
          decodeInfo(user, (res, err) => {
            res ? options.success(res) : options.fail(err);
          });
        });
      }
    },
    fail: options.fail
  });
}

function updateInfo(options = {}) {
  options = Object.assign({}, defaultOptions, options);
  login.token({
    success(key) {
      wx.request({
        url: config.updateInfo,
        header: { openid: key.openid },
        success(res) {
          if (!res || res.statusCode != 200 || res.data.code == "9999") {
            options.fail(new Error(constants.ERR_SERVER_TIPS));
          } else {
            if (res.data.code === '0000') {
              skey.set(res.data.rows)
              options.success(res.data.rows);
            } else {
              options.fail(new Error(res.data.message));
            }
          }
        },
        fail(err) {
          options.fail(new Error(constants.ERR_NET_TIPS));
        }
      });
    },
    fail: options.fail
  });
}

function getNumber(options = {}) {
  options = Object.assign({}, defaultOptions, options);
  login.token({
    success(key) {
      options.data.sessionKey = key.session_key;
      options.data.id = skey.get().id;
      wx.request({
        url: config.bindMobile,
        header: options.data,
        success(res) {
          if (!res || res.statusCode != 200 || res.data.code == "9999") {
            options.fail(new Error(constants.ERR_SERVER_TIPS));
          } else {
            if (res.data.code == '0000') {
              skey.set(res.data.rows);
              options.success(res.data.rows)
            } else {
              options.fail(new Error(res.data.message));
            };
          }
        },
        fail(err) {
          options.fail(new Error(constants.ERR_NET_TIPS));
        }
      });
    },
    fail: options.fail
  });
}

module.exports = {
  getInfo,
  updateInfo,
  getNumber
};