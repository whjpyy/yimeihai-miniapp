const config = require('../../config');
const { skey, net } = require('../../utils/index');

Page({
  data: {
    showPicker: false,
    pickerValue: '请选择',
    amount: 0,
    accountBank:'',
    accountNumber:'',
    accountName:'',
    accountIdentId:''
  },
  onLoad: function (options) {
    var that = this;
    net.request({
      url: config.integralTotal,
      data: {
        userId: skey.get().id
      },
      success(res) {
        res /= 100;
        that.setData({ amount: res });
      }
    });
    this.getHistoryKiting();
  },
  //获取历史提现信息
  getHistoryKiting(){
    var that = this;
    net.request({
      url: config.kittingLatelyRecord,
      data:{
        userId: skey.get().id
      },
      success(res){
        if (res){
          that.setData({
            accountBank: res.accountBank,
            accountNumber: res.accountNumber,
            accountName: res.accountName,
            accountIdentId: res.accountIdentId
          })
        }
      }
    })
  },

  inputMoney: function(e) {
    var moneny = e.detail.value;
    var re = /^(([1-9]{1}\d*)|([0]?))(\.\d{0,2})?$/
    if (re.test(moneny)){
      this.setData({ moneny });
    }else{
      this.setData({ moneny:this.data.moneny });
    }
  },
  blurMoney: function() {
    // var moneny = this.data.moneny;
    // if (/^[1-9]\d*\.$/g.test(moneny)) moneny = moneny + '00';
    // if (moneny.replace(/[ ]/g, '')) { 
    //   this.setData({ moneny });
    // }
  },
  submit: function (e) {
    var that = this;
    var data = e.detail.value;
    var errMessage = '';

    if (this.data.amount == 0) {
      errMessage = '抱歉，你没有可消费学分~！';
    } else if (this.data.amount  < data.price){
      errMessage = '抱歉，学分不足~！';
    } else if (!data.price.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写消费学分~！';
    } else if (!parseFloat(data.price)) {
      errMessage = '抱歉，消费学分不能为0~！';
    } else if (!data.accountBank.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写开户银行~！';
    } else if (!data.accountNumber.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写银行卡号~！';
    } else if (!data.accountName.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写持卡人名称~！';
    } else if (!data.accountIdentId.replace(/[ ]/g, '')) {
      errMessage = '抱歉，请填写身份证号~！';
    }
    if (errMessage) {
      wx.showToast({
        title: errMessage,
        icon: 'none',
        duration: 1500,
        mask: true
      });
    } else {
      data.userId = skey.get().id;
      data.price *= 100; 
      net.request({
        url: config.kitting,
        data,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          wx.setStorageSync('__KITING_INFOS__', res);
          wx.redirectTo({
            url: '/pages/kiting/progress/progress?entrance=0'
          });
        }
      });
    }
  }
})