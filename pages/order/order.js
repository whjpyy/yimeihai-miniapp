const config = require('../../config');
const { skey, net, pay } = require('../../utils/index');

Page({
  data: {
    showConfirmDialog: false,
    progressIndex: 0
  },
  onLoad: function (options) {
    this.setData({
      progressIndex: options.pidx,
      cardId: options.cardId
    });
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      });
      this.getOrderInfos();
    } else {
      this.getBindData();
    }
    if (options.pidx == 1) {
      wx.setNavigationBarTitle({
        title: '确认订单',
      });
    } else if (options.pidx > 1) {
      wx.setNavigationBarTitle({
        title: '支付订单',
      });
    }
  },
  onUnload: function () {
    this.clearPayTime();
  },
  onShow: function() {
    if (this.data.paymentStop) {
      this.getOrderInfos();
    }
  },
  onHide: function() {
    this.clearPayTime();
  },
  submit: function() {
    var that = this;
    if (this.data.payId) {
      pay.order(that.data.payId, function(res) {
        pay.request({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          paySign: res.paySign,
          success(res) {
            that.clearPayTime();
            that.getOrderInfos();
            that.setData({ paymentStop: 2 });
          }
        });
      });
    }
  },
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value;
    var errMessage = '';

    // if (!data.userName.replace(/[ ]/g, '')) {
    //   errMessage = '抱歉，请填写真实姓名~！';
    // } else if (!data.identCard.replace(/[ ]/g, '')) {
    //   errMessage = '抱歉，请填写身份证号码~！';
    // } else if (!(/^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))((\d{4})|(\d{3}[Xx]))$/i.test(data.identCard))) {
    //   errMessage = '抱歉，身份证号码输入不正确，请重新输入~！';
    // } else 
    
    if (data.recommendMobile && !data.recommendInvitationCode.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写邀请人的邀请码~！';
    } else if (data.recommendInvitationCode && !data.recommendMobile.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写邀请人的手机号~！';
    }
    
    if(errMessage) {
      wx.showToast({
        title: errMessage,
        icon: 'none',
        duration: 1500,
        mask: true
      });
    } else {
      net.request({
        url: config.cardOrder,
        data: {
          userId: skey.get().id,
          recommendMobile: data.recommendMobile || '',
          recommendInvitationCode: data.recommendInvitationCode || '',
          consumptionCardId: that.data.consumptionCardId
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(referRes) {
          that.setData({
            saveOrder: {
              userId: skey.get().id,
              userName: '',
              identCard: '',
              consumptionCardId: that.data.consumptionCardId,
              referrerId: referRes && referRes.id ? referRes.id : '' 
            }
          });
          if (referRes && referRes.id) {
            that.setData({
              showConfirmDialog: true,
              bindInfos: {
                avatar: referRes.icon,
                name: referRes.name,
                id: referRes.code,
                mobile: referRes.mobile
              }
            });
          } else {
            that.saveOrder();
          }
        }
      });
    }
  },
  saveOrder: function () {
    var that = this;
    net.request({
      url: config.cardOrderSave,
      data: that.data.saveOrder,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        res.progressIndex = 1;
        res.payId = res.id;
        delete res.id;
        that.setData(res);
        that.countDown(parseInt((res.payExpireTimestamp - Date.now()) / 1000));
      }
    });
  },
  getBindData: function() {
    var that = this;
    net.request({
      url: config.user,
      data: {
        userId: skey.get().id
      },
      success(res) {
        let inviter = getApp().globalData.inviter;
        console.log(inviter)
        that.setData({
          isRecommend: inviter ? false : res.parentId,
          recommendMobile: res.recommendMobile || (inviter ? inviter.mobile : ''),
          recommendInvitationCode: res.recommendInvitationCode || (inviter ? inviter.invitationCode : ''),
        });
        net.request({
          url: config.cardBind,
          data: {
            consumptionCardId: that.data.cardId,
            userId: skey.get().id
          },
          success(res) {
            that.setData({
              userMobile: skey.get().mobile,
              consumptionCardId: that.data.cardId,
              consumptionCardName: res.name,
              consumptionCardValidate: res.validate,
              consumptionCardPrice: res.price
            });
          }
        });
      }
    });
  },
  getOrderInfos: function () {
    var that = this;
    net.request({
      url: config.cardOrderInfo,
      data: {
        orderId: that.data.orderId
      },
      success(res) {
        res.payId = res.id;
        res.userMobile = skey.get().mobile;
        delete res.id;
        that.setData(res);
        if (res.transactionNumber || that.data.paymentStop == 2) {
          that.setData({
            progressIndex: 2
          });
          wx.setNavigationBarTitle({
            title: '支付订单',
          });
        } else {
          that.countDown(parseInt((res.payExpireTimestamp - Date.now()) / 1000));
        }
      }
    });
  },
  countDown: function (counter) {
    var m = 0, s = 0;
    this.cdTimer = setInterval(() => {
      counter -= 1;
      if (counter <= 0) {
        this.clearPayTime();
        wx.showModal({
          title: '友情提醒',
          content: '支付已过期，请重新下单~!',
          showCancel: false,
          success(res) {
            if(res.confirm) {
              wx.redirectTo({
                url: '/pages/vipCard/vipCard'
              });
            }
          }
        });
      } else {
        m = parseInt(counter / 60);
        s = counter % 60;
        m = String(m).length == 1 ? '0' + m : m;
        s = String(s).length == 1 ? '0' + s : s;
      }
      this.setData({
        minute: m,
        second: s
      });
    }, 1000);
    this.setData({ paymentStop: 0 });
  },
  clearPayTime: function () {
    if (this.cdTimer) {
      clearInterval(this.cdTimer);
      this.cdTimer = null;
      if (this.data.progressIndex == 1) {
        this.setData({ paymentStop: 1 });
      }
    }
  },
  cancelOrder: function() {
    var that = this;
    wx.showModal({
      title: '友情提示',
      content: '抱歉，是否取消订单，取消后若购买，请重新下单~！',
      cancelText: '暂不取消',
      confirmText: '立即取消',
      success(res) {
        if(res.confirm) {
          net.request({
            url: config.cancelOrder,
            data: {
              id: that.data.payId
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              that.clearPayTime();
              wx.showModal({
                title: '友情提示',
                content: '订单取消成功~！',
                showCancel: false,
                success(res) {
                  if(res.confirm) {
                    wx.redirectTo({
                      url: '/pages/vipCard/vipCard'
                    });
                  }
                }
              });
            }
          });
        }
      }
    });
  }
})