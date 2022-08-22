//app.js
App({
  //生命周期回调——监听小程序初始化
  onLaunch: function () {
    // this.loadFontFace()
    //程序初始化缓存必要数据
    wx.request({
      url: this.globalData.urlhost + '/api/base.system/sysconf?name=web_logo',
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.setStorageSync('web_logo', res.data.data)
          }
        }
      }
    })
  },
  loadFontFace() {
    wx.loadFontFace({
      family: 'PingFangSC-Medium',
      global: true,
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success(res) {
        console.log(res.status)
      },
      fail: function(res) {
        console.log(res.status)
      },
      complete: function(res) {
        console.log(res.status)
      }
    });
  },
  //生命周期回调——监听小程序切后台
  onHide: function(){},
  globalData: {
    userInfo: null,
    code: null,
    // urlhost: "http://192.168.1.15:8081",
    // urlhost: "http://xianshida.test.net",
      urlhost:'https://xianshida.test.cqclxsc.com'
  }
})