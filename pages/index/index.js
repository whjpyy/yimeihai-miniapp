const config = require('../../config');
const { net } = require('../../utils/index');

Page({
  data: {
    active: [
      {
        image: 'https://meidaplus.oss-cn-hangzhou.aliyuncs.com/meidaplus/assets/index_card2.png',
        // url: '/pages/vipCard/vipCard'
        url:'/pages/vipCard/cardDetail2/index'
      },
      {
        image: 'https://meidaplus.oss-cn-hangzhou.aliyuncs.com/meidaplus/assets/index_active2.png',
        url: '/pages/active/active'
      }
    ]
  },
  onLoad: function () {
  },
  jumpLink: function(e) {
    var url = e.currentTarget.dataset.url;
    if(url) {
      wx.navigateTo({
        url: url
      });
    }
  },
  onAuthOver: function () {
    var that = this;
    net.request({
      url: config.index,
      data: {
        version: config.currentVersion
      },
      success(res) {
        res.dataLoaded = true;
        if (!res.shopVisible) {
          that.data.active.pop();
          res.active = that.data.active;
        }
        that.setData(res);
      }
    });
  }
})
