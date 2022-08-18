// pages/index/coupon/coupon.js
const app = getApp()
import { getStorage,isLogin } from '../../../utils/handleLogin'
import { $init,$digest } from '../../../utils/common.util'
Page({

  data: {
    goods_id: 0,
    couponList: [],
    // 使用说明
    explain:[
      [
        { title:"优惠券获取"},
        [
          "1.通过专题页领取；",
          "2.平台统一派发；",
          "3.通过其他运营活动获得；",
          "4.会员发至账户内；"
        ]
      ],
      [
        { title: "优惠券获取" },
        [
          "1.通过专题页领取；",
          "2.平台统一派发；",
          "3.通过其他运营活动获得；",
          "4.会员发至账户内；"
        ]
      ],
      [
        { title: "优惠券获取" },
        [
          "1.通过专题页领取；",
          "2.平台统一派发；",
          "3.通过其他运营活动获得；",
          "4.会员发至账户内；"
        ]
      ],
      [
        { title: "优惠券获取" },
        [
          "1.通过专题页领取；",
          "2.平台统一派发；",
          "3.通过其他运营活动获得；",
          "4.会员发至账户内；"
        ]
      ]
    ],
    // 优惠券
    explainFlage:false,
    // 领取成功
    receiveFlage:false
  },
  // 显示优惠券使用说明
  explainShow:function(){
    this.setData({
      explainFlage: true
    })
  },
  // 关闭优惠券使用说明
  explainHide:function(){
    this.setData({
      explainFlage:false
    })
  },
  // 优惠券领取
  receiveShow:function(e){
    let index = e.currentTarget.dataset.index
    let that = this
    wx.request({
      url: app.globalData.urlhost + '/api/user.coupon/receive',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: that.data.couponList[index].id,
        token: getStorage('token')
      },
      dataType: 'json',
      success: function (res) {
          console.log(res)
          if(res.statusCode === 200){
            if(res.data.code === 1){
              that.data.couponList[index].is_receive = true
              that.data.btn = '领取成功'
              that.data.receiveFlage = true
              $digest(that)
              setTimeout(() => {
                that.setData({
                  receiveFlage: false
                })
              }, 1500)
            }else{
              wx.showToast({
                title:res.data.msg,
                icon: 'none',
                duration:2000,
              })
            }
          }
      }
    })
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.hasOwnProperty('goods_id')){
      this.data.goods_id = options.goods_id
    }
    $init(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  load: function () {
     let that = this
     wx.request({
       url: app.globalData.urlhost + '/api/user.coupon/index',
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       data: {
         goods_id: this.data.goods_id,
         token: getStorage('token')
       },
       dataType: 'json',
       success: function (res) {
         console.log(res)
         if (res.statusCode === 200) {
           if(res.data.code === 1){
             res.data.data.forEach((item,index) => {
               item.coupon_quota = (Math.round(item.coupon_quota * 100) / 100).toString()
               item.coupon_discount = (Math.round(item.coupon_discount * 100) / 100).toString()
               item.coupon_start_time = that.timestampToTime(item.coupon_start_time)
               item.coupon_end_time = that.timestampToTime(item.coupon_end_time)
               item.is_receive = false
             })
             that.data.couponList = res.data.data
             $digest(that)
           }
         }
       }
     })
  },
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = this.change(date.getDate()) + ' ';
    let h = this.change(date.getHours()) + ':';
    let m = this.change(date.getMinutes()) + ':';
    let s = this.change(date.getSeconds());
    return Y + M + D ;
  },
  change: function (t) {
    if (t < 10) {
      return "0" + t;
    } else {
      return t;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    isLogin(() => {
      this.load()
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