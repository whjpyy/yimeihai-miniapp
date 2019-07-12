const constants = require('./constants');
const net = require('./net');
const skey = require('./skey');
const config = require('../../config');
const noop = () => { };

function check(success = noop, fail = noop) {
  net.request({
    url: config.testVersion,
    data: {
      version: config.currentVersion
    },
    success(res) {
      success(res.testSwitch);
    },
    fail: fail
  });
}

function infos(success = noop, fail = noop) {
  net.request({
    url: config.testUser,
    success(res) {
      skey.set({ 
        id: res.id, 
        code: res.code, 
        fullName: res.fullName, 
        icon: res.icon,
        mobile: res.mobile, 
        memberLevelName: res.memberLevelName, 
        invitationCode: res.invitationCode,
        telephone: res.telephone
      });
      success(res);
    },
    fail: fail
  });
}

module.exports = {
  check,
  infos
};