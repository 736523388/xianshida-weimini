//index.js
//获取应用实例
const app = getApp()
const {login} = require('../../../utils/handleLogin');

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    web_logo:''
  },
  onLoad: function () {
    console.log('登陆授权页')
    this.setData({
      web_logo: wx.getStorageSync('web_logo')
    })
    wx.getSetting({
      success: (res) => {
        if(res.authSetting['scope.userInfo']){
          login(() => {
             wx.navigateBack()
          })
        }
      }
    })
  }, 
  getUserInfo: function(e){
    console.log(e)
    
    if(e.detail.userInfo){
      login(() => {
         wx.navigateBack()
      })
    }
  }
})
