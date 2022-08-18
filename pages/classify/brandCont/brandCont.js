// pages/classify/classifyList/classifyList.js
//获取应用实例
const app = getApp()
import { getStorage, isLogin } from '../../../utils/handleLogin'
import { $init, $digest } from '../../../utils/common.util'
var s1=true,
    title=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 品牌介绍
    introduce:{},
    // 价格图标
    src1:"/images/upper.png",
    src2: "/images/lower2.png",
    // title
    color1:"#F43C77",
    color2:"#333",
    // 产品
    rCont: {},
    // id
    goodsListId:0,
    // 页数
    goodspage:1,
    // 商品排序
    sort: "hot",
    // loadend
    loadEnd: true,
    //是否可以触底加载
    isFinish: true,
  },
  // 价格图标点击
  src:function(){
    var that=this;
    if(s1){
      that.setData({
        src1:"/images/upper2.png",
        src2: "/images/lower.png",
        sort: "pricehight"
      })
    }else{
      that.setData({
        src1: "/images/upper.png",
        src2: "/images/lower2.png",
        sort: "pricelow"
      })
    }
    s1=!s1;
  },
  // title点击
  hot:function(){
    this.setData({
      color1: "#F43C77",
      color2: "#333",
      sort: hot
    })
  },
  price: function () {
    this.setData({
      color1: "#333",
      color2: "#F43C77"
    })
  },
  // 获取品牌数据
  goodsList:function(){
    let that = this
    if (this.data.isFinish === false) {
      return false
    }
    
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
   
    let sort = this.data.goodsListId

    wx.request({
      url: app.globalData.urlhost +'/api/store.goods_brand/detail',
      data:{
        id: that.data.goodsListId
      },
      success:function(res){
        // console.log(res)
        if(res.statusCode == 200){
          if(res.data.code ==1 ){
            
            that.data.introduce = res.data.data
            // that.setData({
            //   introduce: res.data.data
            // })  
            $digest(that)        
          }
        }

      }
    })
    // 获取品牌产品
    wx.request({
      url: app.globalData.urlhost +'/api/store.goods/allgoods',
      data: {
        token: getStorage("token"),
        brand_id: that.data.goodsListId,
        page: that.data.goodspage
      },
      success:function(res){
        if(res.statusCode ==200 ){
          if(res.data.code ==1 ){
            wx.hideLoading()
            // console.log(res)
            if (that.data.rCont.hasOwnProperty('data')){
              that.data.rCont.data = that.data.rCont.data.concat(res.data.data.data)
            }else{
              that.data.rCont.data=res.data.data.data
              that.data.rCont.hide_price = res.data.data.hide_price
              that.data.rCont.hide_price_txt = res.data.data.hide_price_txt
              that.data.rCont.show_price = res.data.data.show_price            
            }
            if (res.data.data.data.length == 0) {
              that.data.loadEnd = false
              console.log(that.data.loadEnd)
              // that.setData({
              //   loadEnd:"暂时没有商品哦~"
              // })
            }
            if (res.data.data.data.length < 10) {
              that.data.isFinish = false
              
            } else {
              that.data.goodspage++

            }
            $digest(that)
           
          }
        }
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    $init(this)
    var that=this
    this.data.goodsListId = e.id;
    // console.log(e.id)
    if (that.data.loadEnd == true) {
      this.data.loadEnd = "我是有底线的~"
      // console.log(this.data.loadEnd)
    } else {
      this.data.loadEnd = "暂时没有商品哦~"
      // console.log(this.data.loadEnd)
    }
    $digest(this)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
    this.goodsList();
    // this.loading()
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