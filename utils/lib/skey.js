
const constants = require('./constants');
let app = getApp();

module.exports = {
  get() {
    let global = app && app.globalData[constants.USER_INFO];
    let session = wx.getStorageSync(constants.USER_INFO);
    return session || global;
  },
  set(session) {
    app.globalData[constants.USER_INFO] = session;
    return wx.setStorageSync(constants.USER_INFO, session);
  },
  clear() {
    wx.removeStorageSync(constants.HEADER_SKEY);
    wx.removeStorageSync(constants.USER_INFO);
  }
};