// pages/index/assembleRule/assembleRule.js
const app = getApp();
import { $init, $digest } from '../../../utils/common.util'
import { promisify } from '../../../utils/promise.util'
import { isLogin, getStorage } from '../../../utils/handleLogin'
//var WxParse = require('../../../wxParse/wxParse.js')
import { wxParse } from '../../../wxParse/wxParse'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:66
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this
    // 获取规则内容
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/agreement',
      data: {
       id:that.data.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if(res.statusCode == 200){
          if(res.data.code == 1){
            wx.hideLoading()
            //富文本转换
            wxParse('article', 'html', res.data.data, that, 5);
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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