var app = getApp()
const Config = app.config
const util = require('../../utils/util')
const windowWidth = wx.getSystemInfoSync().windowWidth

Page({
  data: {
    wc: {
      word: '',   
      optLeft: [],
      optRight: []
    },
    wcBlockXC: 0,
    wcBlockDisable: false,
    dictTemp: [],
    learnedWords: []
  },
  onLoad() {
    this.wcBlockAutoCenter()
    this.loadDicts()
  },
  onUnload() {
    this.saveWord()
  },
  wcBlockAutoCenter() {
    const center = (windowWidth - 40 - 212) / 2

    this.setData({
      wcBlockXC: center
    })
  },
  wcBlockHoming() {
    this.setData({
      wcBlockDisable: true,
      wcBlockXC: this.data.wcBlockXC
    })
  },
  wcBlockSlide(e) {
    const { x, source: slideType } = e.detail
    const { wcBlockXC, dictTemp } = this.data
    const wcBlockX = x | 0
    const rightEnd = windowWidth - 40 - 212

    // 当单词卡滑块滑动到中心后解锁移动锁
    if(x == wcBlockXC) this.setData({ wcBlockDisable: false })
    // 非拖动事件或非滑块到边则停止往下执行
    if(slideType != 'touch') return false;
    if(!(wcBlockX == 0 || wcBlockX == rightEnd)) return false;
    
    // 判断单词卡滑块位置是否对应正确答案
    if (wcBlockX == [0, rightEnd][dictTemp[0].key]) {
      this.nextWord()
      wx.vibrateShort({ type: 'light' })
    } else {
      app.msg(0, '选错了')
    }

    this.wcBlockHoming()
  },
  loadDicts() {
    const that = this

    wx.showLoading({ title: '加载词库中' })

    // 向API请求词库数据
    wx.request({
      url: app.config.api + '/dicts/load/' + app.globalData.dictLength,
      success: res => {
        const dict = res.data.rows

        // 如果返回数据为0，则停止往下执行并提示
        if (dict.length == 0) {
          this.setData({ wc: { word: 'Nothing new word' } })
          return wx.showModal({
            title: '无新单词',
            content: '你已经记完了所有单词，暂未有新单词更新',
            showCancel: false,
            complete: (res) => wx.navigateBack()
          })
        }

        // 不为0，则临时保存词库数据并显示第一个单词
        const frist = dict[0]

        that.setData({
          dictTemp: dict,
          wc: {
            word: frist.word,
            optLeft: [ frist.left_pos, frist.left_cn ],
            optRight: [ frist.right_pos, frist.right_cn ]
          }
        })
      },
      fail: res => app.msg(0, '无法请求'),
      complete: () => wx.hideLoading()
    })
  },
  nextWord() {
    const newLearnedWords = this.data.learnedWords
          newLearnedWords.push(this.data.dictTemp[0])

    // 将刚学的单词加入已学单词数据中
    this.setData({ learnedWords: newLearnedWords })

    // 记单词满足指定数量即可打卡
    if(newLearnedWords.length == Config.dakaLimit && !app.globalData.user.dakaToday) this.doDaka()

    // 删除临时词库数据的第一条数据
    this.data.dictTemp.shift()

    // 如果删除完后没有数据了就停止往下执行并提示
    if(this.data.dictTemp.length == 0) {
      wx.showToast({ title: '已记完词库', icon: 'none' })
      this.setData({ wc: { word: 'End' } })

      return !app.globalData.user.dakaToday && this.doDaka();
    }

    // 还有单词则继续显示
    const frist = this.data.dictTemp[0]

    this.setData({
      wc: {
        word: frist.word,
        optLeft: [ frist.left_pos, frist.left_cn ],
        optRight: [ frist.right_pos, frist.right_cn ]
      }
    })
  },
  doDaka() {
    wx.showModal({
      title: '打卡助手',
      content: `已记单词过${Config.dakaLimit}个，现可打卡`,
      showCancel: false,
      confirmText: '去打卡',
      success (res) {
        if (res.confirm) dakaReq()
      }
    })

    function dakaReq() {
      wx.request({
        url: Config.api + '/daka',
        method: 'POST',
        data: {
          openid: app.globalData.openid,
          time: util.DATE().datetime
        },
        success: res => {
          app.msg(res.data.code, res.data.msg)
          if (res.data.code) app.globalData.user.dakaToday = 1
        },
        fail: res => app.msg(0, '无法请求')
      })
    }
  },
  saveWord() {
    const time = util.DATE().date
    const storageKey = Config.storageKey.dict
    let learnedWords = this.data.learnedWords

    // 如果已学单词数据为空则停止往下执行
    if (!learnedWords.length) return false;

    wx.getStorage({ key: storageKey })
      .then(res => {
        const Dict = res.data

        // 如果当前词典有当天数据，则将新数据与旧数据合并
        if (Array.isArray(Dict[time])) {
          learnedWords = Dict[time].concat(learnedWords)
        }

        Dict[time] = learnedWords

        wx.setStorageSync(storageKey, Dict)
        app.globalData.saveWordCallback()
      })
      .catch(res => {
        wx.setStorageSync(storageKey, { [time]: learnedWords })
        app.globalData.saveWordCallback()
      })
  }
})