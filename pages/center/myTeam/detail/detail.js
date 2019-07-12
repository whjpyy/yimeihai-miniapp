// pages/center/myTeam/detail/detail.js
const config = require('../../../../config');
const { skey, net } = require('../../../../utils/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    itemInfo:'null'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.id?this.setData({
      id: options.id
    }) : this.setData({
        id: ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onAuthOver(){
    this.getAjax()
  },
  //获取数据
  getAjax(){
    if (!this.data.id){
      return
    }
    let that = this;
    net.request({
      url: config.teamuser,
      data: {
        userId: this.data.id
      },
      success(res) {
        let total = 0;
        if (res.levelCount.length > 0){
          var newLeve = res.levelCount.map((v)=>{
            total += v.teamTotal;
            let text = '';
            if (v.levelCode == 'LV1'){
              text = '普通会员'
            } else if (v.levelCode == 'LV2'){
              text = '黄金会员'
            } else if (v.levelCode == 'LV3') {
              text = '铂金会员'
            } else if (v.levelCode == 'LV4') {
              text = '钻石会员'
            }
            return {
              levelCode: v.levelCode+text,
              teamTotal: v.teamTotal
            }
          })
          res.levelCount = newLeve
        }
        res.total = total;
        that.setData({
          itemInfo: res
        });
        console.log(res)
      }
    });
  }
})