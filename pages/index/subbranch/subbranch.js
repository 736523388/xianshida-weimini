// pages/classify/classify.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_list:[]
  },

  navagation: function (e) {
    var that = this
    console.log(11111)
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: parseFloat(e.currentTarget.dataset.lat),
          longitude: parseFloat(e.currentTarget.dataset.lng),
          name: e.currentTarget.dataset.name,
          scale: 28
        })
      }
    })
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

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
    var that = this;
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/store_list',
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code === 1) {
            wx.hideLoading()
            that.setData({
              shop_list: res.data.data,
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
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