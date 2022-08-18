//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //自动登陆
    // this.login(()=>{
    //    console.log('已经授权，直接登陆')
    // })
  },
  loginx: function () {
    if (!wc.get('token')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    } else {
      return true
    }
  },
  globalData: {
    userInfo: null,
    code: null,
    // urlhost: "http://192.168.1.15:8081",
    //urlhost: "https://ncp.a.xueao400.com",
      urlhost:'https://xianshida.test.cqclxsc.com'
  }
})