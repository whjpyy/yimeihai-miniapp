const config = require('../../../config');
const { skey, net } = require('../../../utils/index');

Page({
  data: {
    teams: [],
    level: 1,
    pageIndex: 1
  },
  onLoad: function (options) {
  },
  onReachBottom: function () {
    if (this.data.pageIndex < Math.ceil(this.data.total / 10)) {
      this.setData({ pageIndex: this.data.pageIndex + 1 });
      this.getDataList();
    }
  },
  onFilter: function(e) {
    var lv = parseInt(e.target.id.match(/\d/g)[0]);
    if(lv != this.data.level) {
      this.setData({
        level: lv,
        teams: [],
        pageIndex: 1
      });
      this.getDataList();
    }
  },
  getDataList: function () {
    var that = this;
    net.request({
      url: config.myTeam,
      data: {
        pageIndex: that.data.pageIndex,
        pageSize: 10,
        userId: skey.get().id,
        relation: that.data.level
      },
      success(res, total) {
        that.setData({
          teams: that.data.teams.concat(res),
          total
        });
      }
    });
  },
  onAuthOver: function () {
    var that = this;
    net.request({
      url: config.myTeamTotal,
      data: {
        userId: skey.get().id
      },
      success(res) {
        that.setData({ teamTotal: res });
        that.getDataList();
      }
    });
  }
})