App({
  config: {
    api: 'https://train.101001000.cc',
    dakaLimit: 10,
    storageKey: {
      dict: 'Dict',
      wrongWordDict: 'wrongDict'
    },
  },
  globalData: {
    logined: false,
    openid: null,
    user: {
      status: 0,
      nickName: '未登录',
      dakaTotal: 0,
      dakaToday: 0
    },
    dictLength: 0
  },
  /**
   * Toast消息提示
   * @param {*} code 请求结果码
   * @param {*} msg 消息内容
   */
  msg(code, msg) {
    code ? wx.showToast({ title: msg }) : wx.showToast({ title: msg, icon: 'error' })
  }
})
