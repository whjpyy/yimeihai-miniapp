
Component({
  properties: {
    mainTitle: String,
    subTitle: {
      type: String,
      value: ''
    },
    showMore: {
      type: Boolean,
      value: true
    },
    url: {
      type: String,
      value: ''
    }
  },
  data: {},
  attached() {},
  methods: {
    jumpLink() {
      if(this.data.url) {
        wx.navigateTo({
          url: this.data.url
        });
      }
    }
  }
});