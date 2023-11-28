module.exports = {
  /**
   * 获取当前日期时间
   */
  DATE: () => {
    const DateOpt = { timeZone: 'Asia/Shanghai', hour12: false }
    const DateStr = new Date().toLocaleString('zh-CN', DateOpt).replace(/\//g, '-')
    const DateArr = DateStr.split(' ')

    return {
      date: DateArr[0],
      time: DateArr[1],
      datetime: DateStr
    }
  }
}