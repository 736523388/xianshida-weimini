var wc = require('../../../src/wcache.js');
const { isLogin, getStorage } = require('../../../utils/handleLogin');
import { timestampToTime } from '../../../utils/util';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1,
    nav: [
      { index: 1, label: "未使用" },
      { index: 2, label: "已使用" },
      { index: 3, label: "已过期" },
    ],
    coupon_list: [],
    loading: 'more',
    loadEnd: "我是有底线的~",
    loadError: false,
    loadErrorTxt: '加载失败，点击重试~',
  },
  now_use: function () {
    if (this.data.status !== 1) {
      return
    }
    wx.switchTab({
      url: '/pages/index/index/index',
    })
  },
  change_nav(e) {
    console.log(e)
    if(this.data.status === e.target.dataset.index){
      return
    }
    this.setData({
      status: e.target.dataset.index
    })
    this._freshing = true
    this.loadData()
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
      url: app.globalData.urlhost + '/api/user.coupon/mycoupon',
      method: 'GET',
      data: {
        token: getStorage('token', ''),
        status: this.data.status
      },
      success: res => {
        console.log('loadData', res)
        if (res.statusCode === 200 && res.data.code === 1) {
          res.data.data.map(item => {
            item.coupon_quota = (Math.round(item.coupon_quota * 100) / 100).toString()
            item.coupon_discount = (Math.round(item.coupon_discount * 100) / 100).toString()
            item.coupon_start_time = timestampToTime(item.coupon_start_time)
            item.coupon_end_time = timestampToTime(item.coupon_end_time)
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
    this.loadData()
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