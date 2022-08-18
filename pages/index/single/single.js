// pages/index/single/single.js
const app = getApp()
import {
  $init,
  $digest
} from '../../../utils/common.util'
import { wxParse } from '../../../wxParse/wxParse'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
    console.log(options)
    if (!options.hasOwnProperty('id')){
      wx.navigateBack()
    }
    this.data.id = options.id
    $digest(this)
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
    this.load()
  },
  load: function () {
    let that = this
    wx.request({
      url: app.globalData.urlhost + '/api/store.banner/detail',
      method: 'GET',
      data: {
        id: that.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            wxParse('article', 'html', res.data.data.content, that, 5);
          }
        }
      }
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