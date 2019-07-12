const config = require('../../../config');
const { skey, net } = require('../../../utils/index');

Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;
    net.request({
      url: config.kittingRecord,
      data: {
        userId: skey.get().id
      },
      success(res) {
        res.dataLoaded = true;
        res.totalAmount /= 100;
        res.list = res.list.map((v)=>{
          v.payment /= 100;
          switch (v.status){
            case 1:
              v.status = '待审核';
              break;
            case 2:
              v.status = '审核不通过';
              break;
            case 3:
              v.status = "待打款";
              break;
            case 4:
              v.status = '待回执';
              break;
            case 5:
              v.status = '已完成'
              break;
            case 10:
              v.status = '已关闭'
              break;
          }
          return v
        })
        that.setData(res);
      }
    });
  }
})