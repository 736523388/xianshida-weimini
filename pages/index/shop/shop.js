// pages/index/shop/shop.js
const app = getApp()
import {
  getStorage,
  isLogin
} from '../../../utils/handleLogin'
import {
  $init,
  $digest
} from '../../../utils/common.util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 产品
    product:[],
    // id
    id:1,
    special_cover:'',
    special_logo:'',
    special_title:'',
    special_desc:'',
    hide_price_txt:'',
    show_price:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    $init(this)
    this.data.id=e.id
    $digest(this)
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
    $init(this)
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    //  获取主题列表
    var that=this;
    let token = getStorage('token')
    wx.request({
      url: app.globalData.urlhost +'/api/store.goods/specialdetail',
      data:{
        id:that.data.id,
        token:token
      },
        
      success:function(res){
        if(res.statusCode == 200){
          if(res.data.code == 1){
            console.log(res)
            wx.hideLoading()
            that.data.special_cover = res.data.data.data.special.special_cover
            that.data.special_desc = res.data.data.data.special.special_desc
            that.data.special_logo = res.data.data.data.special.special_logo
            that.data.special_title = res.data.data.data.special.special_title
            that.data.product = res.data.data.data.goods
            that.data.hide_price_txt = res.data.data.hide_price_txt 
            that.data.show_price = res.data.data.show_price
            console.log(that.data.show_price)
            $digest(that)
          }
          
        }
        
      }
    })
    
  },
  // 链接跳转
  shopLink:function(e){
    wx.navigateTo({
      url: '/pages/index/productContent/productContent?id=' + e.currentTarget.dataset.id
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