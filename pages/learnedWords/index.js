var app = getApp()
const Config = app.config
const util = require("../../utils/util")

Page({
  data: {
    s: null,
    title: '',
    wordlist: {},
    wrongwordlist: {}
  },
  storageKey: Config.storageKey.dict,
  storageKey2: Config.storageKey.wrongWordDict,
  onLoad(opt) {
    // 接收路径参数，用于判断页面来源
    this.setData({
      s: parseInt(opt.s),
      title: parseInt(opt.s) ? '今日所学单词' : '已学单词'
    })
    this.loadWords()
  },
  /** 加载单词数据 */
  loadWords() {
    const that = this
    const time = util.DATE().date
    const s = this.data.s

    wx.getStorage({ key: this.storageKey })
      .then(res => {
        let arr = []
        let title = ''

        if (s) {
          arr = res.data[time]
          that.loadWrongwords()
        } else {
          Object.values(res.data).map(val => arr.push(...val))
        }
        
        that.setData({
          title: title,
          wordlist: arr
        })
      })
  },
  /** 加载错误单词数据 */
  loadWrongwords() {
    const that = this
    const time = util.DATE().date

    wx.getStorage({ key: that.storageKey2 })
      .then(res => that.setData({ wrongwordlist: res.data[time] }))
  },
  /** 清除本地单词数据 */
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
        wx.setStorageSync(that.storageKey2, {})
      }
    })
  }
})