// pages/search/search.js
import { $init, $digest } from '../../../utils/common.util'
const app = getApp()
// 暂存搜索关键字
var key=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 最近搜索
    nearCont:{},
    // 热门搜索
    hotCont: [],
    searchValue:"",
    // 输入暂存
    inputValue:[],
    searchData:"",
    // 删除按钮
    closeFlage: false
    
  },
  unique1: function (arr){
    var hash = [];
    for(var i = 0; i<arr.length; i++) {
      if (hash.indexOf(arr[i]) == -1) {
        hash.push(arr[i]);
      }
    }
    return hash;
  },
  resignFocus: function(e){
    console.log(e)
    var keyword = e.detail.value
    this.data.inputValue = keyword
    if (keyword != "") {
      this.data.searchData = wx.getStorageSync('searchData') || [];
      this.data.searchData.unshift(keyword)
      this.data.searchData = this.unique1(this.data.searchData)
      wx.setStorageSync('searchData', this.data.searchData)
      $digest(this)
    }
    wx.navigateTo({
      url: '/pages/classify/classifyList/classifyList?key=' + keyword,
    })
  },
  // 搜索
  search:function(e){
    console.log(e)
    var keyword = e.detail.value.keyword;
    this.data.inputValue = keyword;
    if (keyword !=""){
      this.data.searchData = wx.getStorageSync('searchData') || [];
      this.data.searchData.unshift(keyword)
      this.data.searchData = this.unique1(this.data.searchData)
      wx.setStorageSync('searchData', this.data.searchData)
      $digest(this)
    }
    wx.navigateTo({
      url: '/pages/classify/classifyList/classifyList?key='+keyword,
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
    // this.setData({
    //   searchValue:""
    // })
    // 获取热门搜索
    this.getHotSearch()
  },
  //获取热门搜索
  getHotSearch: function(){
    var that = this
    wx.showLoading()
    wx.request({
      url: app.globalData.urlhost + '/api/store.search_txt/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            that.data.hotCont = res.data.data
            wx.hideLoading()
            $digest(that)
          }
        }
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
    // 获取缓存
    
    var searchData = wx.getStorageSync('searchData') || []
    this.data.searchData = wx.getStorageSync('searchData') || []
    // 删除按钮
    if (this.data.searchData.length == 0){
      this.data.closeFlage = false
    }else{
      this.data.closeFlage = true
    }
    $digest(this)
  },
  // 热门搜索点击
  searchLink:function(e){
    console.log(e)
    let keyword = e.currentTarget.dataset.title
    if (keyword != "") {
      this.data.searchData = wx.getStorageSync('searchData') || [];
      this.data.searchData.unshift(keyword)
      this.data.searchData = this.unique1(this.data.searchData)
      wx.setStorageSync('searchData', this.data.searchData)
      $digest(this)
    }
    wx.navigateTo({
      url: '/pages/classify/classifyList/classifyList?key=' + keyword,
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

  },
  // 删除最近搜索
  nearDelete:function(){
    var that = this
      wx.showModal({
        title: '提示',
        content: '是否删除历史搜索',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync('searchData', []);
            that.data.searchData=[]
            that.data.closeFlage = false            
            $digest(that)
          }
        }
      })
      
  }
})