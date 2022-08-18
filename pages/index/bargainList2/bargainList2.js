// pages/index/bargainList2/bargainList2.js
const app = getApp();
import { $init, $digest } from '../../../utils/common.util'
import { promisify } from '../../../utils/promise.util'
import { isLogin, getStorage } from '../../../utils/handleLogin'
import { wxParse } from '../../../wxParse/wxParse'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 列表
    // numImg1: "/images/bList2-icon1.png",
    // numImg2: "/images/bList2-icon1.png",
    // numImg3: "/images/bList2-icon1.png",
   
    bList2:[
      {
        numImg:"/images/bList2-icon1.png",
        img:"/images/bList-icon1.png",
        text1:"比**斯",
        text2:"0元拿【法国进口】男士古驰香水...",
        num:2
      },
      {
        numImg: "/images/bList2-icon2.png",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "/images/bList2-icon3.png",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      },
      {
        numImg: "",
        img: "/images/bList-icon1.png",
        text1: "比**斯",
        text2: "0元拿【法国进口】男士古驰香水...",
        num: 2
      }
    ],
    list:[]
  },
  fn:function(e){
    var a = e.currentTarget.dataset.index;
    console.log(a);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
  },
  getList:function(){
    var that=this;
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/fast_success',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if(res.statusCode == 200){
          if(res.data.code == 1){
            wx.hideLoading()
            that.data.list=res.data.data
            if (that.data.list.length == 1){
              that.data.list[0].numImg = "/images/bList2-icon1.png";
            } else if (that.data.list.length == 2){
              that.data.list[0].numImg = "/images/bList2-icon1.png";
              that.data.list[1].numImg = "/images/bList2-icon2.png";
            } else if (that.data.list.length >= 3){
              that.data.list[0].numImg = "/images/bList2-icon1.png";
              that.data.list[1].numImg = "/images/bList2-icon2.png";
              that.data.list[2].numImg = "/images/bList2-icon3.png"
            }
   
            console.log(res)
            $digest(that)
          }
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList()
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