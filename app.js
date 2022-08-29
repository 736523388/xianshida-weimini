//app.js
App({
  //生命周期回调——监听小程序初始化
  onLaunch: function () {
    // this.loadFontFace()
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
    // urlhost: "http://xianshida.test.net",
      urlhost:'https://xianshida.test.cqclxsc.com'
  }
})