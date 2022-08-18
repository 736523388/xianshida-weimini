// pages/classify/classify.js
const app = getApp();

var wc = require('../../../src/wcache.js');

import {
  getStorage,
  isLogin
} from '../../../utils/handleLogin'

var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //用户信息
    userInfo: {},

    // 左边导航
    num: 0,
    bg: [
      "#FFADAD",
      "#FFC8DE",
      "#FFCCAD",
      "#FFE9AD",
      "#D0FFAD",
      "#C4FFD9",
      "#ADFFFE",
      "#ADC8FF",
      "#B7ADFF",
      "#FFADFC"
    ],
    bg2: "#FFADAD",
    // 右边类别
    aright: [],
    arightData: [],
    aleft: [],
    cate_id: ''
  },


  getUserInfo() {
    var _this = this;

    // 个人中心通用信息
    wx.request({
      url: app.globalData.urlhost + '/api/user.member/index',
      data: {
        token: wc.get('token'),
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        _this.setData({
          userInfo: res.data.data
        })

      },
    })
  },

  // 左边导航点击
  active: function (e) {
    var that = this;
    let token = getStorage('token')
    page = 1
    var index = e.currentTarget.dataset.index;
    this.setData({
      num: index,
      cate_id: e.currentTarget.dataset.id,

    })
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/allgoods',
      data: {
        page: 1,
        cate_id: that.data.cate_id,
        token: token
      },
      success: function (res) {
        // console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code === 1) {
            wx.hideLoading()
            that.setData({
              aright: res.data.data,
              arightData: res.data.data.data
            })
            console.log("active", res)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        }
      }
    })

  },
  //右边图片点击跳转页面
  link: function (e) {
    wx.navigateTo({
      url: '/pages/classify/classifyList/classifyList?id=' + e.currentTarget.dataset.id,
    })
  },
  skip_details: function (e) {
    wx.navigateTo({
      url: '/pages/index/productContent/productContent?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    let token = getStorage('token')
    let pamas = {
      token: token
    }

    console.log("token", token)
    page = 1
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods_cate/lists',
      //data: pamas,
      success: function (res) {
        // console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code === 1) {
            wx.hideLoading()
            that.setData({
              aleft: res.data.data,
              cate_id: res.data.data[0].id
            })
            wx.request({
              url: app.globalData.urlhost + '/api/store.goods/allgoods',
              data: {
                page: 1,
                cate_id: res.data.data[0].id,
                token: token
              },
              success: function (res) {
                // console.log(res)
                if (res.statusCode == 200) {
                  if (res.data.code === 1) {
                    wx.hideLoading()
                    that.setData({
                      aright: res.data.data,
                      arightData: res.data.data.data
                    })
                    console.log("aright", that.data.aright)
                    console.log("res", res)

                    that.getUserInfo();

                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                    })
                  }
                }
              }
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
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
  onLoad: function () {

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
    var that = this
    page++
    let token = getStorage('token')
    console.log("page", page)
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/allgoods',
      data: {
        page: page,
        cate_id: that.data.cate_id,
        token: token
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 1) {
          if (res.data.data.data.length == 0) {
            return
          } else {


            that.setData({
              arightData: that.data.arightData.concat(res.data.data.data)
            })

            // that.setData({
            //     aright: that.data.aright.data.concat(res.data.data.data)
            // })

            console.log("aright", that.data.aright)

          }
        }
      },
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})