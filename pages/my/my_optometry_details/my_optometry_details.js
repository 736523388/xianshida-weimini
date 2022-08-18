const app = getApp()
const {
  isLogin
} = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '0',
    id:"",
    headimg:'',
    optometry_details:[],
    yg_bool:1,
    pj_bool:0,
  },

  change_current: function(e) {
    var that = this;
    this.setData({
      current: e.detail.current,
    })
  },
  change_yg:function(){
    this.setData({
      yg_bool: 1,
      pj_bool: 0,
    })
  },
  change_pj: function () {
    this.setData({
      yg_bool: 0,
      pj_bool: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    var that = this
    if (e.id) {
      that.setData({
        id: e.id,
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
    isLogin(() => {})
    // 可用等级列表
    wx.request({
      url: app.globalData.urlhost + '/api/user.optometry/view',
      data: {
        token: wc.get('token'),
        id:that.data.id
      },
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success: function(res) {
        console.log(res) 
        if (res.data.code == 1) {
          that.setData({
            optometry_details:res.data.data,
            headimg:wc.get("headimg"),
            yg_bool: 1,
            pj_bool: 0,
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
    wx.stopPullDownRefresh()
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

  }
})