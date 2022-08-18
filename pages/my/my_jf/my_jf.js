const app = getApp()
const {
  isLogin
} = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
var page = 1
Page({


  data: {
    jf_list: [],
    my_jf:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    if(e.jf){
      this.setData({
        my_jf: e.jf
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    page = 1
    // 登录
    isLogin(() => { })
    wx.request({
      url: app.globalData.urlhost + '/api/user.integral_log/index',
      data: {
        token: wc.get('token'),
        page: 1
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            jf_list: res.data.data.data
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    page++
    wx.request({
      url: app.globalData.urlhost + '/api/user.integral_log/index',
      data: {
        token: wc.get('token'),
        page: page
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 1) {
          if (res.data.data.data.length == 0){
            return
          }else{
            var jf_list = that.data.jf_list
            var jf = jf_list.concat(res.data.data.data)
            that.setData({
              jf_list:jf
            })
            console.log(jf)
          }
        }
      },
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})