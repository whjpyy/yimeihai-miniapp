const { constants, skey, login, user, tester } = require('../../utils/index');
const config = require('../../config');

Component({
  data: {
    title: '友情提示',
    message: '',
    showDialog: false,
    showCancelButton: false,
    confirmButtonText: '',
    confirm: '',
    openType: '',
    getUserInfo: '',
    getPhoneNumber: '',
    userInfo: null
  },
  ready() {
    let that = this;
    if (!getApp().globalData[constants.USER_INFO]) {
      tester.check(switchRes => {
        if (switchRes) {
          wx.showModal({
            title: '登录提醒',
            content: '版本体验中，请选择登录方式',
            cancelText: '微信登录',
            confirmText: '体验登录',
            success(res) {
              if (res.confirm) {
                skey.clear();
                tester.infos(infoRes => {
                  that.triggerEvent('authover', {});
                });
              } else {
                that.updateInfo();
              }
            }
          });
        } else {
          that.updateInfo();
        }
      });
    } else {
      that.triggerEvent('authover', {});
    }
  },
  methods: {
    updateInfo() {
      let that = this;
      wx.showLoading({
        title: '请稍后...',
        mask: true
      });
      user.updateInfo({
        success(res) {
          wx.hideLoading();
          if (res) {
            if (res.mobile) {
              that.triggerEvent('authover', {});
            } else {
              that.dialog(constants.AUTH_PHONE_NUMBER_TIPS, constants.OPEN_TYPE_PHONE_NUMBER);
            }
          } else {
            skey.clear();
            that.authSetting();
          }
        },
        fail() {
          wx.hideLoading();
        }
      });
    },
    authSetting() {
      let that = this;
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            that.login();
          } else {
            that.dialog(constants.AUTH_USER_INFO_TIPS, constants.OPEN_TYPE_USER_INFO);
          }
        },
        fail(error) {
          that.dialog(constants.ERR_NET_TIPS);
        }
      });
    },
    confirm() {
      if (this.data.userInfo) {
        if (!this.data.userInfo.mobile) {
          this.phoneNumber();
        }
      } else {
        this.authSetting();
      }
    },
    getUserInfo(e) {
      if (e.detail.encryptedData) {
        this.login({
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        });
      } else {
        this.dialog(constants.AUTH_USER_INFO_TIPS, constants.OPEN_TYPE_USER_INFO);
      }
    },
    getPhoneNumber(e) {
      if (e.detail.encryptedData) {
        this.phoneNumber({
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        });
      } else {
        this.dialog(constants.AUTH_PHONE_NUMBER_TIPS, constants.OPEN_TYPE_PHONE_NUMBER);
      }
    },
    dialog(message, type) {
      let datas = {
        showDialog: true,
        openType: '',
        getUserInfo: '',
        getPhoneNumber: '',
        confirm: '',
        message
      };
      if (type) {
        datas.confirmButtonText = '确定';
        datas.openType = type;
        datas[type] = type;
      } else {
        datas.confirmButtonText = '重试';
        datas.confirm = 'confirm';
      }
      this.setData(datas);
    },
    login(data) {
      let that = this;
      wx.showLoading({
        title: '请稍后...',
        mask: true
      });
      user.getInfo({
        data,
        success(res) {
          wx.hideLoading();
          that.setData({ userInfo: res });
          if (res.mobile) {
            that.triggerEvent('authover', {});
          } else {
            that.dialog(constants.AUTH_PHONE_NUMBER_TIPS, constants.OPEN_TYPE_PHONE_NUMBER);
          }
        },
        fail(err) {
          wx.hideLoading();
          that.dialog(err.message, constants.OPEN_TYPE_USER_INFO);
        }
      });
    },
    phoneNumber(data) {
      let that = this;
      wx.showLoading({
        title: '请稍后...',
        mask: true
      });
      user.getNumber({
        data,
        success(res) {
          wx.hideLoading();
          that.triggerEvent('authover', {});
          that.setData({ userInfo: res });
        },
        fail(err) {
          wx.hideLoading();
          that.dialog(err.message, constants.OPEN_TYPE_PHONE_NUMBER);
        }
      });
    }
  }
});