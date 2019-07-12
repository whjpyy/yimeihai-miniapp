const config = require('../../../config');
const { skey, net } = require('../../../utils/index');

Page({
  data: {
    addrPickerValue: '请选择',
    orgPickerValue: '请选择',
    applyIndex: -1,
    progressIndex: -1
  },
  onLoad: function (options) {
    var that = this;
    if (options.progressIndex == 0 && options.applyIndex == 0) {
      this.setData({
        progressIndex: options.progressIndex,
        applyIndex: options.applyIndex,
        purchaserMobile: skey.get().mobile,
        activityId: options.id
      });
      wx.removeStorageSync('__BOOKING__'); 
      net.request({
        url: config.user,
        data: {
          userId: skey.get().id
        },
        success(res) {
          let inviter = getApp().globalData.inviter;
          that.setData({
            isRecommend: inviter ? false : res.parentId,
            recommendMobile: res.recommendMobile || ( inviter ? inviter.mobile : ''),
            recommendInvitationCode: res.recommendInvitationCode || ( inviter ? inviter.invitationCode : ''),
            dataLoaded: true
          });
        }
      });
    } else {
      this.setData({
        progressIndex: 0,
        applyIndex: 2,
        purchaserMobile: skey.get().mobile,
        reportId: options.id
      });
      net.request({
        url: config.activeDetail,
        data: {
          id: options.id
        },
        success(res) {
          var states = ['待回访', '待消费', '已消费', '已关闭'];
          res.applyState = states[res.status];
          res.progressIndex = 0;
          res.applyIndex = 2;
          if (res.status == 0) {
            res.progressIndex = 1;
          } else if (res.status == 1) {
            res.progressIndex = 2;
          } else if (res.status == 2) {
            res.progressIndex = 3;
          }
          res.dataLoaded = true;
          res.canCancel = Number(res.status) > 1 ? false : true;
          that.setData(res);
        }
      });
    }
  },
  onShow: function () {
    var bookingInfo = wx.getStorageSync('__BOOKING__');
    if(bookingInfo) {
      this.setData({ orgPickerValue: bookingInfo.merch });
    }
  },
  makeCall: function (e) {
    var tel = e.currentTarget.dataset.tel
    if (tel) {
      wx.makePhoneCall({
        phoneNumber: tel.split(',')[0]
      });
    }
  },
  getOrg: function() {
    wx.navigateTo({
      url: '/pages/active/merch/merch'
    });
  },
  formSubmit: function(e) {
    var that = this;
    var data = e.detail.value;
    var errMessage = '';

    data.activityId = this.data.activityId;
    // data.address = this.data.addrPickerValue;
    data.address = '';
    
    if (data.recommendInvitationCode && data.recommendMobile) {
      if (!data.recommendInvitationCode.replace(/[ ]/g, '') && !data.recommendMobile.replace(/[ ]/g, '')) {
        delete data.recommendInvitationCode;
        delete data.recommendMobile;
      }
    }

    var bookingInfo = wx.getStorageSync('__BOOKING__');
    if (bookingInfo) {
      data.orderShops = bookingInfo.merchId;
    }

    if (!data.purchaser.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写报名人名称~！';
    } else if (!data.purchaserIdentId.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写身份证号码~！';
    } else if (!(/^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))((\d{4})|(\d{3}[Xx]))$/i.test(data.purchaserIdentId))) {
      errMessage = '抱歉，身份证号码输入不正确，请重新输入~！';
    } else if (data.recommendMobile && !data.recommendInvitationCode.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写邀请人的邀请码~！';
    } else if (data.recommendInvitationCode && !data.recommendMobile.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写邀请人的手机号~！';
    } 
    // else if (this.data.addrPickerValue == '请选择') {
    //   errMessage = '抱歉，请选择就诊地点~！';
    // }
    else if (this.data.orgPickerValue == '请选择') {
      errMessage = '抱歉，请选择就诊机构~！';
    }

    if (errMessage) {
      wx.showToast({
        title: errMessage,
        icon: 'none',
        duration: 1500,
        mask: true
      });
    } else {
      data.purchaserId = skey.get().id;
      data.shopName = this.data.orgPickerValue;
      net.request({
        url: config.activeApply,
        data,
        method: 'POST',
        success(res) {
          res.applyIndex = 1;
          res.shopId = bookingInfo.merchId;
          res.shopName = bookingInfo.merch;
          that.setData(res);
          wx.removeStorageSync('__BOOKING__');
        }
      });
    }
  },
  cancelOrder: function() {
    var that = this;
    net.request({
      url: config.activeCancelOrder,
      data: {
        reportId: that.data.reportId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.showModal({  
          title: '友情提示',
          content: '取消预约成功~',
          showCancel: false,
          success(res) {
            if(res.confirm) {
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      }
    });
  }
})