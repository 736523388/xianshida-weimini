// pages/index/bargainMy/bargainMy.js
const app = getApp();
import { $init, $digest } from '../../../utils/common.util'
import { isLogin, getStorage } from '../../../utils/handleLogin';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*我的砍价列表*/
    bargainList: [],
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
    console.log('onShow')
    //this.data.bargainList = []
    this.data.bargainList.forEach((item,index) => {
      if (item.hasOwnProperty('timer')){
        clearInterval(item.timer)
      }
    })
    isLogin(()=>{
      this.getBargainMy()
    })
  },
  // 获取我的砍价
  getBargainMy:function(){
    var that = this;
    var token = getStorage('token');
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/my_bargain',
      data: {
        token:token
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if(res.statusCode == 200){
          wx.hideLoading()
          if(res.data.code == 1){
            res.data.data.sort(function(x,y){
              return y.success_time - x.success_time
            })
            res.data.data.forEach((item,index) => {
              item.d_value = that.numSub(item.now_price, item.low_price)
            })
            that.data.bargainList = res.data.data
            $digest(that)
            that.data.bargainList.forEach((item,index) => {
              if (item.success_time == 0) {
                that.startTime(index)
              }
            })
          }
        }
      }
    })

  },
  // 初始 倒计时
  startTime: function (index){
    let that = this
    // console.log(index)
    
    that.data.bargainList[index].timer = false
    that.data.bargainList[index].day = '00';
    that.data.bargainList[index].hour = '00';
    that.data.bargainList[index].minute = '00';
    that.data.bargainList[index].second = '00';
    that.data.bargainList[index].times = parseInt((that.data.bargainList[index].end_time * 1000 - new Date().getTime())/1000)
    $digest(that)
    // console.log(that.data.bargainList[index])
    // return false
    if (that.data.bargainList[index].times > 0){
      that.data.bargainList[index].timer = setInterval(function(){
        that.data.bargainList[index].times--
        //console.log(item)
        that.data.bargainList[index].day = Math.floor(that.data.bargainList[index].times / (60 * 60 * 24));
        that.data.bargainList[index].hour = Math.floor(that.data.bargainList[index].times / (60 * 60)) - (that.data.bargainList[index].day * 24);
        that.data.bargainList[index].minute = Math.floor(that.data.bargainList[index].times / 60) - (that.data.bargainList[index].day * 24 * 60) - (that.data.bargainList[index].hour * 60);
        that.data.bargainList[index].second = Math.floor(that.data.bargainList[index].times) - (that.data.bargainList[index].day * 24 * 60 * 60) - (that.data.bargainList[index].hour * 60 * 60) - (that.data.bargainList[index].minute * 60);
        if (that.data.bargainList[index].day <= 9) that.data.bargainList[index].day = '0' + that.data.bargainList[index].day;
        if (that.data.bargainList[index].hour <= 9) that.data.bargainList[index].hour = '0' + that.data.bargainList[index].hour;
        if (that.data.bargainList[index].minute <= 9) that.data.bargainList[index].minute = '0' + that.data.bargainList[index].minute;
        if (that.data.bargainList[index].second <= 9) that.data.bargainList[index].second = '0' + that.data.bargainList[index].second;
        // that.data.bargainList[index].times--
        $digest(that)
      },1000)
    }else{
      clearInterval(that.data.bargainList[index].timer)
    }
  },
  /**
   * 列表点击事件
   * 正在砍价或者砍价成功跳转到砍价页面
   * 砍价失败跳转到列表页面
   */
  nowClick: function (e) {
    console.log(e)
    let dataset = e.currentTarget.dataset
    let url = ''
    try{
      
      if (dataset.successtime >= 0){
        url = '/pages/index/bargainCont/bargainCont?id=' + dataset.id + '&order_bargain_id=' + dataset.bargainid
      }else{
        url = '/pages/index/bargainList/bargainList'
      }
    } catch (e){
      console.log(e)
    }
    if(url != ''){
      wx.navigateTo({
        url: url,
      })
    }
  },

/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 *
 * @param num1减数  |  num2被减数
*/
numSub: function (num1, num2) {
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch(e) {
      baseNum1 = 0;
    }
  try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch(e) {
      baseNum2 = 0;
    }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  onUnload: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }
})