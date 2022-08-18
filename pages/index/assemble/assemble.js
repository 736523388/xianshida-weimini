// pages/index/assemble/assemble.js
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
    // 最新订单
    topText:"最新订单来自黑龙江的下**衣",
    topImg:"/images/bList-icon1.png",
    // banner
    banner: '',
    // 商品分类
    nav:[],
    num:0,
    // 分类id
    cate_id:0,
    // 团购列表数据
    assembleList:[],
    // 一页的个数
    assembleNum:10,
    // 页码
    assemblePage:1,
    // 页码是否叠加
    isEarth: true,
  },
  /**
   * 导航点击
   */
  navClick:function(e){
    var index = e.currentTarget.dataset.index
    var cate_id = e.currentTarget.dataset.i
    this.data.num = index
    this.data.cate_id = cate_id
    this.data.assemblePage = 1
    this.data.assembleList = []
    $digest(this)
    this.getAssembleList()
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
    // 获取大图
    this.getBanner()
    // 获取分类
    this.getClassify()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取拼团列表数据
    this.data.assemblePage = 1
    this.data.assembleList = []
    $digest(this)
    this.getAssembleList()
  },
  // 获取砍价banner
  getBanner: function () {
    let that = this
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/sysconf',
      data: {
        name: 'group_bg_img'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            that.data.banner = res.data.data
            $digest(that)
          }
        }
      }
    })
  },
  // 获取拼团列表数据
  getAssembleList:function(){
    let that = this
    wx.showLoading({
      title: '',
    })
    let params = {
      page_size: that.data.assembleNum,
      page_now: that.data.assemblePage,
      cate_id: that.data.cate_id
    }
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.group/lists',
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        wx.hideLoading()
        if(res.statusCode == 200){
          if(res.data.code == 1){
            // console.log(res)
            that.data.assembleList = that.data.assembleList.concat(res.data.data)
            if (res.data.data.length < 10){
              that.data.isEarth=false
            }else{
              that.data.assemblePage++
            }
            $digest(that)
            // console.log(that.data.isEarth)
          }
        }
      }
    })
  },
  // 获取分类
  getClassify:function(){
    var that=this
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods_cate/index',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.statusCode == 200){
          if(res.data.code == 1){
            that.data.nav = res.data.data
            var nva1 = {
              id: 0,
              cate_title: '精选'
            }
            that.data.nav.unshift(nva1)
            $digest(that)
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
    let that = this
    that.data.assemblePage = 1
    that.data.assembleList = []
    $digest(that)
    let params = {
      page_size: that.data.assembleNum,
      page_now: that.data.assemblePage,
      cate_id: that.data.cate_id
    }
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.group/lists',
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            that.data.assembleList = that.data.assembleList.concat(res.data.data)
            if (res.data.data.length < 10) {
              that.data.isEarth = false
            } else {
              that.data.assemblePage++
            }
            $digest(that)
            wx.stopPullDownRefresh()
          }
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.isEarth) {
      this.getAssembleList()
    } else {
      return false
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})