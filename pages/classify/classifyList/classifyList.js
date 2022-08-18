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
    // 商品列表
    goodsList: {},
    // 商品分类id
    cateId: 0,
    // 商品排序
    sort: 'hot',
    //分页
    page: 1,
    //是否可以触底加载
    isFinish: true,
    //搜索关键字
    Keyword: '',
    // loadend
    loadEnd: "我是有底线的~"
  },
  goodssort: function(e){
    if (e.currentTarget.dataset.index === this.data.sort){
      return false
    }
    if (e.currentTarget.dataset.index === 'price'){
      if (this.data.sort === 'pricehight'){
        this.data.sort = 'pricelow'
      }else{
        this.data.sort = 'pricehight'
      }
    }else{
      this.data.sort = 'hot'
    }
    this.data.page = 1
    this.data.goodsList = {}
    this.data.isFinish = true
    $digest(this)
    this.load()
  },
  // 产品列表接收数据
  load: function (){

    if (this.data.isFinish === false){
      return false
    }
    let params = {
      token: getStorage('token'),
      page: this.data.page,
      sort: this.data.sort,
      goods_title: this.data.Keyword
    }
    if(this.data.cateId){
      params.cate_id = this.data.cateId
    }
    // console.log(params)
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    let that = this
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/allgoods',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: params,
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if(res.statusCode === 200){
          if(res.data.code === 1){
            wx.hideLoading()    
            if (that.data.goodsList.hasOwnProperty('data')) {
              that.data.goodsList.data = that.data.goodsList.data.concat(res.data.data.data)
            } else {
              that.data.goodsList.data = res.data.data.data
              that.data.goodsList.hide_price = res.data.data.hide_price
              that.data.goodsList.hide_price_txt = res.data.data.hide_price_txt
              that.data.goodsList.show_price = res.data.data.show_price
            }            
            if (res.data.data.data.length < 10) {
              that.data.isFinish = false
            } else {
              that.data.page++
              
            }           
            $digest(that)
          }
        }
      }
    })
  },
  // 搜索
  search: function (e){
    //  console.log(e)
     if(e.detail.value.Keyword){
       this.data.Keyword = e.detail.value.Keyword
       this.data.page = 1
       this.data.goodsList = {}
       this.data.isFinish = true
       this.data.sort = 'hot'
       $digest(this)
     }
     this.load()
  },
  resignFocus:function(e){
    if (e.detail.value) {
      this.data.Keyword = e.detail.value
      this.data.page = 1
      this.data.goodsList = {}
      this.data.isFinish = true
      this.data.sort = 'hot'
      $digest(this)
    }
    this.load()
  },
  // 跳转到详情页
  goodsLink:function(e){
    wx.navigateTo({
      url: '/pages/index/productContent/productContent?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    $init(this)
    var that=this
    // console.log(e)
    // 商品id
    if (e.hasOwnProperty('id')) {
      this.data.cateId = e.id
    }
    // 搜索关键字
    if (e.hasOwnProperty('key')){
      this.data.Keyword = e.key
    }
    
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
    this.load()
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

    //分享转发
    onShareAppMessage: function (options) {
        console.log(options)
        var that = this;
        // 设置转发内容
        var shareObj = {
            title: "豪臻",
            path: '', // 默认是当前页面，必须是以‘/’开头的完整路径
            imgUrl: '', //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。

        };

        // 返回shareObj
        return shareObj;
    }
})