
Component({
  properties: {
    icon: String,
    text: String,
    url: {
      type: String,
      value: ''
    }
  },
  relations: {
    '../tabbar/tabbar': {
      type: 'parent'
    }
  },
  data: {
    active: false
  },
  methods: {
    onClick() {
      const parent = this.getRelationNodes('../tabbar/tabbar')[0];

      if (parent) {
        if (this.data.url) {
          parent.onChange(this, this.data.url);
        } else {
          parent.onChange(this);
        }
      }

      this.triggerEvent('click');
    },
    setActive(ref) {
      var active = ref.active;
      
      if (this.data.active !== active) this.setData({ active: active });
    }
  }
});