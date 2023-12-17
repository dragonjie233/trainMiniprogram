var app = getApp()
const Config = app.config
const util = require("../../utils/util")

Page({
  data: {
    navbar: {
      height: 0,
      menuRight: 0,
      menuTop: 0,
      menuHeight: 0
    },
    panel: {
      wordTotal: 0,
      wordToday: 0
    },
    user: app.globalData.user,
    userSettingShow: false
  },
  onLoad() {
    this.navbarCustom()
    this.userLogin()
    this.registerSaveWordCallback()
  },
  onShow() {
    this.loadDictInfo()
  },
  /** 顶部导航条自定义 */
  navbarCustom() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    this.setData({
      navbar: {
        height: systemInfo.statusBarHeight + 44,
        menuWidth: menuButtonInfo.width,
        menuHeight: menuButtonInfo.height,
        menuTop: menuButtonInfo.top,
        menuRight: systemInfo.screenWidth - menuButtonInfo.right,
      }
    })
  },
  /** 显示用户设置窗 */
  showUserSetting() {
    this.setData({ userSettingShow: !this.data.userSettingShow })
  },
  /** 跳转记单词页面 */
  toPageMemory() {
    wx.navigateTo({ url: '/pages/memory/index' })
  },
  /** 跳转单词数据页面 */
  toPageLearnedWords(e) {
    wx.navigateTo({ url: '/pages/learnedWords/index?s=' + e.currentTarget.id })
  },
  /** 用户登录 */
  userLogin() {
    const that = this

    wx.login({
      success: res => {
        const code = res.code
        const date = util.DATE().date

        wx.showLoading({ title: '登录中...', mask: true })

        wx.request({
          url: Config.api + '/user/login',
          method: 'POST',
          data: { code, date },
          success: res => {
            if (res.statusCode != 200) return wx.showLoading({
              title: '无法登录请重试',
              mask: true
            })
            wx.hideLoading()

            app.globalData.logined = true
            app.globalData.openid = res.data.openid

            const userObj = {
              status: res.data.status,
              nickName: res.data.nickName,
              dakaTotal: res.data.daka_total,
              dakaToday: res.data.daka_today
            }

            app.globalData.user = userObj
            that.setData({
              user: userObj,
              userSettingShow: !res.data.status
            })
          },
          fail: res => app.msg(res.code, res.errMsg)
        })
      }
    })
  },
  /** 用户修改事件 */
  userModify(e) {
    const that = this
    const { nickName: name } = e.detail.value
    const { openid } = app.globalData

    if (name == '') {
      return wx.showModal({
        title: '温馨提示',
        content: '要修改的内容不能为空',
        showCancel: false
      })
    }

    wx.request({
      url: app.config.api + '/user/modify',
      method: 'POST',
      data: { openid, name },
      success: res => {
        that.data.user['nickName'] = name
        that.setData({
          user: that.data.user,
          userSettingShow: false
        })

        app.msg(res.data.code, res.data.msg)
      },
      fail: res => app.msg(0, '无法请求')
    })
  },
  /** 首次使用绑定事件 */
  userBind(e) {
    const that = this
    const { nickName: name } = e.detail.value
    const { openid } = app.globalData

    wx.request({
      url: app.config.api + '/user/bind',
      method: 'POST',
      data: { openid, name },
      success: res => {
        that.setData({
          user: {
            status: 1,
            nickName: name
          },
          userSettingShow: false
        })

        app.msg(res.data.code, res.data.msg)
      },
      fail: res => app.msg(0, '无法请求')
    })
  },
  /** 用户删除账号 */
  userDelete() {
    wx.showModal({
      title: '确定删除账号？',
      content: '此操作会删除您本地和数据库中所有数据，将无法恢复！',
      complete: res => {
        if (res.confirm) wx.showToast({ title: '功能未开放', icon: 'none' })
      }
    })
  },
  /** 加载本地词库信息 */
  loadDictInfo() {
    const that = this
    const time = util.DATE().date
    const storageKey = Config.storageKey.dict

    wx.getStorage({ key: storageKey })
      .then(res => {
        let total = 0
        let today = 0

        // 获取所有已学单词的总数
        Object.values(res.data).map(val => total = total + val.length)
        // 获取当天所学单词的总数
        if (Array.isArray(res.data[time])) today = res.data[time].length

        that.setData({
          panel: {
            wordTotal: total,
            wordToday: today
          }
        })

        app.globalData.dictLength = total
      })
      .catch(res => {})
  },
  /** 注册记单词页面保存单词的回调函数 */
  registerSaveWordCallback() {
    const that = this
    app.globalData.saveWordCallback = () => that.loadDictInfo()
  }
})