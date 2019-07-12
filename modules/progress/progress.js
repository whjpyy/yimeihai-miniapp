
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    idx: {
      type: Number,
      value: 0
    },
    type: {
      type: String,
      value: 'order'
    }
  },
  data: {
  },
  attached() {
    const datas = {
      order: ['填写订单', '确认订单', '支付订单'],
      kiting: ['申请', '审核', '打款', '回执'],
      active: ['报名', '回访', '到店美容', '返现']
    };
    this.setData({ texts: datas[this.data.type] });
  },
  methods: {
  }
});