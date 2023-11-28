var app = getApp()
const Config = app.config
const util = require("../../utils/util")

Page({
  data: {
    s: null,
    title: '',
    wordlist: {}
  },
  storageKey: Config.storageKey.dict,
  onLoad(opt) {
    this.setData({ s: parseInt(opt.s) })
    this.loadWords()
  },
  loadWords() {
    const that = this
    const time = util.DATE().date
    const s = this.data.s

    wx.getStorage({ key: this.storageKey })
      .then(res => {
        let arr = []
        let title = ''

        if (s) {
          title = '今日所学单词'
          arr = res.data[time]
        } else {
          title = '已学单词'
          Object.values(res.data).map(val => arr.push(...val))
        }
        
        that.setData({
          title: title,
          wordlist: arr
        })
      })
  },
  clearWords() {
    const that = this

    wx.showModal({
      title: '确定清除？',
      content: '此操作会清除你所记的全部单词，将无法恢复！',
      complete: (res) => {
        if (!res.confirm) return false;
        if (!Object.keys(that.data.wordlist).length) {
          return wx.showToast({ title: '空词库无需清除', icon: 'none' });
        }

        wx.setStorage({ key: that.storageKey, data: {}})
          .then(() => {
            wx.showToast({ title: '已清除', icon: 'none' })
            that.setData({ wordlist: {} })
          })
          .catch(() =>  wx.showToast({ title: '清除失败', icon: 'none' }))
      }
    })
  }
})