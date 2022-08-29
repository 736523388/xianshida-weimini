// pages/index/coupon/coupon.js
const app = getApp()
import { getStorage, isLogin } from '../../../utils/handleLogin'
import { $init, $digest } from '../../../utils/common.util'
import { timestampToTime } from '../../../utils/util';
Page({

  data: {
    goods_id: 0,
    // 使用说明
    explain: [
      [
        { title: "优惠券获取" },
        [
          "1.通过专题页领取；",
          "2.平台统一派发；",
          "3.通过其他运营活动获得；",
          "4.积分兑换。"
        ]
      ]
    ],
    // 优惠券
    explainFlage: false,
    // 领取成功
    receiveFlage: false,
    coupon_list: [],
    loading: 'more',
    loadEnd: "我是有底线的~",
    loadError: false,
    loadErrorTxt: '加载失败，点击重试~',
  },
  // 显示优惠券使用说明
  explainShow: function () {
    this.setData({
      explainFlage: true
    })
  },
  // 关闭优惠券使用说明
  explainHide: function () {
    this.setData({
      explainFlage: false
    })
  },
  receiveCoupon(index) {
    wx.request({
      url: app.globalData.urlhost + '/api/user.coupon/receive',
      data: {
        id: this.data.coupon_list[index].id,
        token: getStorage('token', '')
      },
      dataType: 'json',
      success: res => {
        console.log(res)
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '领取失败，请重试',
            icon: 'none',
            duration: 2000,
          })
          return
        }
        if (res.data.code !== 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
          return
        }
        let coupon_list = this.data.coupon_list
        coupon_list[index].is_receive = true
        this.setData({
          coupon_list,
          btn: '领取成功',
          receiveFlage: true
        })
        setTimeout(() => {
          this.setData({
            receiveFlage: false
          })
        }, 1500)
      },
      fail: error => {
        wx.showToast({
          title: '领取失败，请重试',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  // 优惠券领取
  receiveShow: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let coupon = this.data.coupon_list[index]
    if (coupon.integral > 0) {
      wx.showModal({
        title: '提示',
        content: '兑换此优惠券需要' + coupon.integral + '积分，是否确认兑换？',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定')
            this.receiveCoupon(index)
          }
        }
      })
    } else {
      this.receiveCoupon(index)
    }
    // this.receiveCoupon(index)
  },

  loadData(e) {
    console.log('loadData', e)
    if (e === 'ref' || this._freshing) {
      this.setData({
        coupon_list: [],
        loadError: false,
        loading: this.data.loading === 'loading' ? 'loading' : 'more'
      })
    } else if (e !== undefined) {
      this.setData({
        loadError: false
      })
    }
    if (this.data.loading !== 'more') {
      return
    }
    this.setData({
      loading: 'loading'
    })
    wx.request({
      url: app.globalData.urlhost + '/api/user.coupon/index',
      method: 'GET',
      data: {
        token: getStorage('token', ''),
        goods_id: this.data.goods_id
      },
      success: res => {
        console.log('loadData', res)
        if (res.statusCode === 200 && res.data.code === 1) {
          res.data.data.map(item => {
            item.coupon_quota = (Math.round(item.coupon_quota * 100) / 100).toString()
            item.coupon_discount = (Math.round(item.coupon_discount * 100) / 100).toString()
            item.use_threshold = (Math.round(item.use_threshold * 100) / 100).toString()
            item.coupon_start_time = timestampToTime(item.coupon_start_time)
            item.coupon_end_time = timestampToTime(item.coupon_end_time)
            item.is_receive = false
          })
          this.setData({
            coupon_list: this.data.coupon_list.concat(res.data.data),
            loading: 'noMore'
          })
          this._freshing = false
        }
      },
      fail: () => {
        this.setData({
          loading: 'more',
          loadError: true
        })
      },
      complete: () => {
        console.log('complate')
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty('goods_id')) {
      this.setData({
        goods_id: options.goods_id
      })
    }
    isLogin(() => { this.loadData() })
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
    setTimeout(() => this.loadData('ref'), 1000)
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