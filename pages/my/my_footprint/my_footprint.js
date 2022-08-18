const app = getApp()
var wc = require('../../../src/wcache.js');
const { isLogin } = require('../../../utils/handleLogin');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     footprint:[],
    hide_price_txt:""
  },

  del:function(e){
    var that=this
    wx.request({
      url: app.globalData.urlhost + '/api/user.foot_print/del',
      data: {
        token: wc.get("token"),
        foot_id:e.currentTarget.dataset.foot_id
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
         wx.showToast({
           title:res.data.msg,
           duration:3000,
         })
         that.onShow()
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    // 登录
    isLogin(() => { })
    wx.request({
      url: app.globalData.urlhost + '/api/user.foot_print/index',
      data: {
        token:wc.get("token"),
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            footprint:res.data.data.data,
            hide_price_txt: res.data.data.hide_price_txt
          }) 
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})