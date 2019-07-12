
Component({
  properties: {
    active: Number
  },
  relations: {
    '../tabbarItem/tabbarItem': {
      type: 'child',
      linked(target) {
        var that = this;
        this.data.items.push(target);
        setTimeout(function() {
          that.setActiveItem();
        });
      },
      unlinked(target) {
        var that = this;
        this.data.items = this.data.items.filter(item => item !== target);
        setTimeout(function () {
          that.setActiveItem();
        });
      }
    }
  },
  data: {
    items: [],
    currentActive: -1
  },
  observers: {
    active(active) {
      this.setData({ currentActive: active });
      this.setActiveItem();
    }
  },
  attached() {
    this.setData({ currentActive: this.data.active });
  },
  methods: {
    setActiveItem() {
      this.data.items.forEach((item, index) => {
        item.setActive({ active: index === this.data.currentActive });
      });
    },
    onChange(child, url) {
      const active = this.data.items.indexOf(child);

      if (active !== this.data.currentActive && active !== -1) {
        this.triggerEvent('change', active);
        this.setData({ currentActive: active });
        this.setActiveItem();
        if (url) {
          wx.reLaunch({
            url: url
          });
        }
      }
    }
  }
});