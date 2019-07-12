const config = require('../../../config');
const { net } = require('../../../utils/index');

Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;
    net.request({
      url: config.integralDetail,
      data: {
        id: options.id
      },
      success(res) {
        res.surplusAmount = (Number(res.shouldAmount) - Number(res.alreadyAmount))/100;
        res.alreadyAmount /= 100;
        res.shouldAmount /= 100;
        res.dataLoaded = true;
        res.rebateOrderRecordList = res.rebateOrderRecordList.map((v)=>{
          v.amount /= 100;
          return v
        })
        that.setData(res);
      }
    });
  }
})