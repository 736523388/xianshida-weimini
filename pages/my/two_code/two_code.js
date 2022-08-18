const app = getApp()
const { isLogin } = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:"",
    header_img:"",
    parent_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
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
      url: app.globalData.urlhost + '/api/user.member/qr_code',
      data: {
        token: wc.get('token'),
      },
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            img: res.data.data.url,
            parent_id: res.data.data.mid
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */

   onShareAppMessage:function(res) {
  //  var that = this
  //    console.log(that.data.img)
  //   return {
  //     title:'',
  //     path: '/pages/my/my/my?parent_id=' + that.data.parent_id,
  //     imageUrl:that.data.img,
  //     success: function(res) {
  //     }
  //   }
  },
})