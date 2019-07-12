// modules/tab/index.js
Component({
  //父级传的值
  properties: {
    tabs: Array
  },
  /**
   * 初始数据
   */
  data: {
    scrollLeft: 0,
    active: 0,
  },
  //用户操作事件
  methods: {
    /*点击选中*/
    ontapItem(e) {
      let now = e.currentTarget.dataset.value;
      let offsetLeft = e.currentTarget.offsetLeft;
      let pageWidth, that = this;
      wx.getSystemInfo({
        success: function(res) {
          pageWidth = res.windowWidth;
          //左滚动
          if (offsetLeft + 60 > pageWidth + that.data.scrollLeft) {
            that.setData({
              scrollLeft: that.data.scrollLeft + 60
            })
          }
          //右滚动
          if (offsetLeft < that.data.scrollLeft) {
            that.setData({
              scrollLeft: that.data.scrollLeft - 60
            })
          }
        }
      })
      //高亮选中
      if (now != this.data.active) {
        this.setData({
          active: now
        })
        this.triggerEvent('onSelected', this.data.tabs[now])
      }
    },
    /*滚动事件*/
    onscrollFn(e) {
      let scrollLeft = e.detail.scrollLeft;
      this.setData({
        scrollLeft
      })
    }
  }
})