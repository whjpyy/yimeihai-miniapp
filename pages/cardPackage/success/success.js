
Page({
  data: {
    entrence: -1
  },
  onLoad: function (options) {
    if (options.entrence == 1) {
      var transferInfo = wx.getStorageSync('__TRANSFER_INFO__');
      wx.removeStorageSync('__TRANSFER_INFO__');
      this.setData({ transferInfo, entrence: options.entrence });
      wx.setNavigationBarTitle({
        title: '转让成功'
      });
    } else {
      var bookingInfo = wx.getStorageSync('__BOOKING_INFO__');
      wx.removeStorageSync('__BOOKING_INFO__');
      this.setData({ bookingInfo, entrence: options.entrence });
    }
  },
})