//app.js
App({
  onLaunch: function () {
    wx.request({
      url: this.globalData.urlhost + '/api/base.system/sysconf?name=web_logo',
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.setStorageSync('web_logo', res.data.data)
            console.log('web_logo',wx.getStorageSync('web_logo'))
          }
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    code: null,
    // urlhost: "http://192.168.1.15:8081",
    // urlhost: "http://xianshida.test.net",
      urlhost:'https://xianshida.test.cqclxsc.com'
  }
})