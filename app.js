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
    dictLength: 0,
    selected: 0
  },
  onLaunch() {
    this.autoUpdate()
  },
  /** 自动更新 */
  autoUpdate () {
    const um = wx.getUpdateManager()
    um.onCheckForUpdate(res => {
      if (!res.hasUpdate) return;

      um.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              um.applyUpdate()
            }
          }
        })
      })

      um.onUpdateFailed(() => {
        wx.showModal({
          title: '新版本已上线',
          content: '请您删除当前小程序，重新打开'
        })
      })
    })
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
