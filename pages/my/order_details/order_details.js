var app = getApp();
var wc = require('../../../src/wcache.js');
const { isLogin } = require('../../../utils/handleLogin');
Page({
  // 
  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
    order_desc:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    if (e.id) {
      this.setData({
        orderid: e.id
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
    // 登录
    isLogin(() => { })
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/detail',
      data: {
        token: wc.get('token'),
        order_id: that.data.orderid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            goods: res.data.data.goods,
            order_desc: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 复制订单编号
  click: function(e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.order_desc.order_no,
      success: function(res) {
       wx.showToast({
         title: '复制成功',
         icon: 'none',
         duration:2000,
       })
      }
    })
  }
})