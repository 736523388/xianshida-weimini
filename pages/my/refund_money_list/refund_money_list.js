// pages/items/items.js
var app = getApp();
var wc = require('../../../src/wcache.js');
const { isLogin } = require('../../../utils/handleLogin');
var page = "";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 支付参数
    code: "",
    payment: {},
    status: "",
    status_list: ["申请中", "已审核", "已退款"],
    scrollLeft: 0,
    current1: true,
    current2: false,
    current3: false,
    current4: false,
    current5: false,
    totalMoney: 0,
    goodsnum: 0,
    // content
    contents: [],
  },
  // 跳转到物流页面
  skip_logistic: function(e) {
    wx.navigateTo({
      url: '/pages/my/logistics/logistics?id=' + e.currentTarget.dataset.orderid,
    })
  },
  // 查看订单详情
  // orderdetails: function (e) {
  //   wx.navigateTo({
  //     url: '/pages/my/order_details/order_details?id=' + e.currentTarget.dataset.orderid,
  //   })
  // },
  onLoad:function(e){
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    //价钱统计和数量统计
    var that = this;
    // 登录
    isLogin(() => { })
    page = 1;
    // 获取全部订单
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/back_order_list',
      data: {
        token: wc.get('token'),
      },
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            contents: res.data.data
          })
          if (res.data.data.length == 0) {
            that.setData({
              is_all: false
            })
          } else {
            that.setData({
              is_all: true
            })
          }
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})