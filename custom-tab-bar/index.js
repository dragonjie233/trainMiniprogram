const app = getApp()

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#07c054",
    list: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/assets/images/en.png",
        selectedIconPath: "/assets/images/en.png",
        text: "英语"
      },
      {
        pagePath: "/pages/math/index",
        iconPath: "/assets/images/math.png",
        selectedIconPath: "/assets/images/math.png",
        text: "数学"
      },
      {
        pagePath: "/pages/chinese/index",
        iconPath: "/assets/images/cn.png",
        selectedIconPath: "/assets/images/cn.png",
        text: "语文"
      }
    ]
  },
  attached() {
  },
  ready() {
    this.setData({
      selected: app.globalData.selected
    })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      app.globalData.selected = data.index
      wx.switchTab({url})
    }
  }
})