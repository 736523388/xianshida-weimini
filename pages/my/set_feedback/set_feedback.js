const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  submit: function(e) {
    console.log(e)
    var that = this
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/feedback',
      data: {
        content: e.detail.value.content,
        phone: e.detail.value.phone,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000,
          })
        }
      },
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