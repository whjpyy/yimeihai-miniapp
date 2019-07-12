
Component({
  properties: {
    infos: Object,
    url: {
      type: String,
      value: '/pages/caseDetail/caseDetail'
    }
  },
  data: {},
  attached() { },
  methods: {
    jumpLink() {
      if (this.data.url) {
        wx.navigateTo({
          url: this.data.url + '?id=' + this.data.infos.id
        });
      }
    }
  }
});