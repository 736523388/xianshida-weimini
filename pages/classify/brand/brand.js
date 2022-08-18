// pages/classify/brand/brand.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:{
      
    }
  },
  // 分类点击
  classify:function(){
    wx.switchTab({
      url: '/pages/classify/classify/classify',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 获取品牌
      var that=this;
      wx.showLoading({
        title: '',
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      wx.request({
        url: app.globalData.urlhost +'/api/store.goods_brand/index',
        data: {
          homepage: 1,
          pagesize:30
        },
        success:function(res){
          if(res.statusCode===200){
            if(res.data.code===1){
              wx.hideLoading()
              that.setData({
                images: res.data.data
              })
            }
          }
          // console.log(res)
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