
Component({
  properties: {
    infos: Object,
    topMargin: {
      type: Boolean,
      value: true
    },
    bottomLine: {
      type: Boolean,
      value: true
    },
    url: {
      type: String,
      value: '/pages/orgDetail/orgDetail'
    }
  },
  data: {
    firstPaddingTop: '',
    lastBorderBottom: ''
  },
  attached() {
    this.setTopMargin();
    this.setBottomLine();
  },
  observers: {
    topMargin(topMargin) {
      this.setTopMargin();
    },
    bottomLine(bottomLine) {
      this.setBottomLine();
    }
  },
  methods: {
    setTopMargin() {
      if (!this.data.topMargin) {
        this.setData({ firstPaddingTop: 'pt-0' });
      }
    },
    setBottomLine() {
      if (!this.data.bottomLine) {
        this.setData({ lastBorderBottom: 'bb-none' });
      }
    },
    jumpLink() {
      if (this.data.url) {
        wx.navigateTo({
          url: this.data.url + '?id=' + this.data.infos.id
        });
      }
    }
  }
});