// pages/index/second/second.js
const app = getApp();
import { $init, $digest } from '../../../utils/common.util'
import { promisify } from '../../../utils/promise.util'
import { isLogin, getStorage } from '../../../utils/handleLogin'
//var WxParse = require('../../../wxParse/wxParse.js')
import { wxParse } from '../../../wxParse/wxParse';
var times = 100;
var timer;
var bg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 时间
    secondTime:[
      "正在疯抢",
      "即将开抢",
      "明日预告"
    ],
    cont:[],
    // tabId
    tabId:0,
    // 一页数量
    secondNum:10,
    // 页数
    secondPage:1,
    // 进度
    jindu:[],
    // 折扣
    zhekou:[],
    timesTitle: {
      title: '正在疯抢',
      bg_img: '',
      current_hour: '',
      ahour: 0,
      aminute: 0,
      asecond: 0,
      footdesc: '距结束',
      tabId: 1
    },
    getMore: true,
  },
  /*倒计时*/
  countDown: function (times) {
    clearInterval(timer)
    let that = this
    timer = setInterval(function () {
      times--
      var day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值
      if (times > 0) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        // console.log(day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒");
        that.data.timesTitle.ahour = hour
        that.data.timesTitle.aminute = minute
        that.data.timesTitle.asecond = second
        $digest(that)
      } else {
        clearInterval(timer)
        that.onShow()
      }
    }, 1000);
  },
  // tab切换
  timeActive:function(e){
    var index = e.currentTarget.dataset.index;
    if (this.data.timesTitle.tabId == index) {
      return false
    }
    this.data.timesTitle.tabId = index
    this.data.cont = []
    this.data.secondPage = 1
    $digest(this)
    clearInterval(timer)
    // 获取秒杀数据
    this.getSecond() 
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     $init(this) 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.data.cont = []
    that.data.secondPage = 1
    that.data.tabId = 0
    $digest(that)
    that.getSecond()
  },
  getSecond:function(){
    var that = this
    // 加载LODING
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    wx.request({
      url: app.globalData.urlhost + '/api/promotion.spike/lists',
      data: {
        page_size: that.data.secondNum,
        page_now: that.data.secondPage,
        type: that.data.timesTitle.tabId
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.hideLoading()
          if (res.data.code == 1) {
            console.log(res.data)
            /*商品信息*/
            //that.data.cont = res.data.data.goods_list
            that.data.cont = that.data.cont.concat(res.data.data.goods_list)
            if (that.data.secondPage<=1){
              that.data.timesTitle.bg_img = res.data.data.bg_img
            }
            res.data.data.goods_list.forEach(function(item,index){        
              var zhekou = (item.zhekou) * 10;
              item.zhekou = zhekou.toFixed(2);
              that.data.jindu= item.jindu
              console.log(item.jindu)
            })
            let remaining_second = 0;
            if (that.data.timesTitle.tabId == '1'){
              that.data.timesTitle.current_hour = res.data.data.current_hour
              that.data.timesTitle.title = '正在疯抢'
              that.data.timesTitle.footdesc = '距结束'
              remaining_second = res.data.data.remaining_second

            } else if (that.data.timesTitle.tabId == '2'){
              that.data.timesTitle.current_hour = res.data.data.next_hour
              that.data.timesTitle.title = '即将开抢'
              that.data.timesTitle.footdesc = '距开始'
              remaining_second = res.data.data.remaining_second
            } else if (that.data.timesTitle.tabId == '3') {
              that.data.timesTitle.current_hour = ''
              that.data.timesTitle.title = '明日预告'
              that.data.timesTitle.footdesc = '距开始'
              remaining_second = res.data.data.tomorrow_remaining_second
            }
            /*页码+*/
            // that.data.secondPage++
            if (res.data.data.goods_list.length == that.data.secondNum){
              that.data.secondPage++
            }else{
              that.data.getMore = false
            }

            if (that.data.timesTitle.tabId != that.data.tabId){
              /*倒计时开始*/
              let day = Math.floor(times / (60 * 60 * 24));
              let hour = Math.floor(remaining_second / (60 * 60)) - (day * 24);
              let minute = Math.floor(remaining_second / 60) - (day * 24 * 60) - (hour * 60);
              let second = Math.floor(remaining_second) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
              if (day <= 9) day = '0' + day;
              if (hour <= 9) hour = '0' + hour;
              if (minute <= 9) minute = '0' + minute;
              if (second <= 9) second = '0' + second;
              that.data.timesTitle.ahour = hour
              that.data.timesTitle.aminute = minute
              that.data.timesTitle.asecond = second
              that.data.tabId = that.data.timesTitle.tabId
              that.countDown(remaining_second--)
            }
            
            /*倒计时结束*/
            $digest(that)
          }
        }

      }
    })
   
  },
 
  // 链接
  secondLink: function (e) {
    console.log(e)
    console.log(this.data.jindu)
    // if (this.data.jindu>=1){
    //   wx.navigateTo({
    //     url: ''
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: '/pages/index/productContent/productContent?id=' + e.currentTarget.dataset.id
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer)
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
    // 下拉刷新
    if (this.data.getMore){
      this.getSecond()
    }else{
      return false
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})