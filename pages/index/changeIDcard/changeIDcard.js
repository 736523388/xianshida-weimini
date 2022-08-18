// pages/mine_address/mine_address.js
var app = getApp();
var wc = require('../../../src/wcache.js');
const { isLogin } = require('../../../utils/handleLogin');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bool: 1,
    id_list: []
  },
  skip_addid: function() {
    wx.navigateTo({
      url: '/pages/my/addId/addId',
    })
  },
  changeSet: function (e) {
    console.log(e)
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let that = this
    prevPage.setData({
      setIDcard: that.data.id_list[e.currentTarget.dataset.index],
      setIDcardFalg: true
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  //  编辑实名 
  redact: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id_list = JSON.stringify(that.data.id_list[index])
    wx.navigateTo({
      url: '/pages/my/addId/addId?id_list=' + id_list,
    })
  },
  // 删除实名
  deleteaddress: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '确定删除该条实名认证？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.urlhost + '/api/user.authentication/delete',
            data: {
              token: wc.get('token'),
              id: e.currentTarget.dataset.addressid,
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function(res) {
              if (res.data.code == 1) {
               that.onShow()
              }
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000,
              })
            },
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    var that = this;
    // 登录
    isLogin(() => { })
    wx.request({
      url: app.globalData.urlhost + '/api/user.authentication/index',
      data: {
        token: wc.get('token')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          id_list: res.data.data
        });
        if (that.data.id_list == null) {
          that.setData({
            bool: 0
          })
        } else {
          that.setData({
            bool: 1
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

  }
})