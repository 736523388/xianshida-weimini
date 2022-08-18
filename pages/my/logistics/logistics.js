// pages/logistics/logistics.js
var app = getApp();
var wc = require('../../../src/wcache.js');
const { isLogin } = require('../../../utils/handleLogin');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_no:"",
    message:[]
    ,
    wuliu: [],
    img:"",
    wl_status: ["在途中", "已签收", "问题件"]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this
    console.log(e)
    if (e.order_no){
      that.setData({
        order_no: e.order_no,
        img: e.img
      })
    }
   
  },
  // 复制订单编号
  click: function (e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.message.LogisticCode,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 2000,
        })
      }
    })
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
      url: app.globalData.urlhost + '/api/store.order/logistics',
      data: {
        token: wc.get("token"),
        order_no: that.data.order_no,
        type: 0
      },
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        that.setData({
          message: res.data.data,
          wuliu: res.data.data.Traces,
          store: res.data.data.store
        })
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