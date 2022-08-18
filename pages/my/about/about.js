const app = getApp()
var wc = require('../../../src/wcache.js');
var WxParse = require("../../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents:[]
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
    var that = this
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/about',
      data: {},
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          WxParse.wxParse('article', 'html', res.data.data, that, 5);
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