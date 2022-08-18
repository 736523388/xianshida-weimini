// pages/my/refund_money/refund_money.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_num: "",
    order_id:""
  },
  sales_return: function(e) {
    wx.navigateTo({
      url: '/pages/my/sales_return/sales_return?is_back_goods=' + e.currentTarget.dataset.is_back_goods + "&order_num=" + this.data.order_num + "&order_id=" + this.data.order_id,
    })
  },
  money_return: function(e) {
    wx.navigateTo({
      url: '/pages/my/money_return/money_return?is_back_goods=' + e.currentTarget.dataset.is_back_goods + "&order_num=" + this.data.order_num + "&order_id=" + this.data.order_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    if (e.order_num) {
      this.setData({
        order_num: e.order_num,
        order_id: e.order_id
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