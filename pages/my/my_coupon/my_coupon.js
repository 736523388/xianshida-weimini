var wc = require('../../../src/wcache.js');
const { isLogin } = require('../../../utils/handleLogin');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_bool1:1,
    nav_bool2:0,
    nav_bool3:0,
    status: 1,
    mycoupon_list:[],
    type:["","",""]
  },
  now_use:function(){
   wx.switchTab({
     url: '/pages/index/index/index',
   })
  },
  change_nav1:function(){
    var that= this
    that.setData({
      nav_bool1: 1,
      nav_bool2: 0,
      nav_bool3: 0,
    })
    wx.request({
      url: app.globalData.urlhost + '/api/user.coupon/mycoupon',
      data: {
        token: wc.get('token'),
        status: 1
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            mycoupon_list1: res.data.data
          })
        }
      },
    })
  },
  change_nav2: function () {
    var that = this
    that.setData({
      nav_bool1: 0,
      nav_bool2: 1,
      nav_bool3: 0,
    })
    wx.request({
      url: app.globalData.urlhost + '/api/user.coupon/mycoupon',
      data: {
        token: wc.get('token'),
        status:2
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            mycoupon_list2: res.data.data
          })
        }
      },
    })
  },
  change_nav3: function () {
    var that = this
    that.setData({
      nav_bool1: 0,
      nav_bool2: 0,
      nav_bool3: 1,
    })
    wx.request({
      url: app.globalData.urlhost + '/api/user.coupon/mycoupon',
      data: {
        token: wc.get('token'),
        status:3
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            mycoupon_list3: res.data.data
          })
        }
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
    var that = this
    // 登录
    isLogin(() => { })
    wx.request({
      url: app.globalData.urlhost + '/api/user.coupon/mycoupon',
      data: {
        token: wc.get('token'),
        status:1
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            mycoupon_list1: res.data.data
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