// pages/classify/classify.js
import {
  getStorage
} from '../../../utils/handleLogin'
const app = getApp();
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 左边导航
    num: 0,
    // 右边类别
    aright: [],
    arightData: [],
    aleft: [],
    cate_id: '',
    loading: false
  },


  // 左边导航点击
  active: function (e) {

    //商品数据初始化
    this.setData({
      page: 1,
      num: e.currentTarget.dataset.index,
      cate_id: e.currentTarget.dataset.id,
      arightData: []
    })
    wx.showLoading()
    this.getGoods(e.currentTarget.dataset.id)

  },
  //右边图片点击跳转页面
  link: function (e) {
    wx.navigateTo({
      url: '/pages/classify/classifyList/classifyList?id=' + e.currentTarget.dataset.id,
    })
  },
  //跳转商品详情页
  skip_details: function (e) {
    wx.navigateTo({
      url: '/pages/index/productContent/productContent?id=' + e.currentTarget.dataset.id,
    })
  },
  getGoods(cate_id) {
    let token = getStorage('token')
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/allgoods',
      data: {
        page: this.data.page,
        cate_id,
        token
      },
      success: res => {
        // console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code === 1) {
            wx.hideLoading()
            this.setData({
              aright: res.data.data,
              arightData: res.data.data.data,
              page: this.data.page + 1,
              loading: false
            })
            console.log("aright", this.data.aright)
            console.log("res", res)

          } else {
            wx.hideLoading()
            wx.showToast({
              title: '网络错误，请稍后重试',
              icon: 'none',
            })
            this.setData({
              loading: false
            })
          }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none',
          })
          this.setData({
            loading: false
          })
        }
      },
      fail: error => {
        wx.hideLoading()
        wx.showToast({
          title: error.errMsg,
          icon: 'none',
        })
        this.setData({
          loading: false
        })
      }
    })
  },
  getCate(ref) {
    if (this.data.loading !== false) {
      return false
    }
    this.setData({
      loading: true
    })
    if (ref) {
      this.setData({
        page: 1
      })
    }
    wx.showLoading()
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods_cate/lists',
      success: res => {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code === 1) {
            this.setData({
              aleft: res.data.data,
              cate_id: res.data.data[0].id
            })
            this.getGoods(res.data.data[0].id)
          } else {
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
            this.setData({
              loading: false
            })
          }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none',
          })
          this.setData({
            loading: false
          })
        }
      },
      fail: error => {
        wx.hideLoading()
        wx.showToast({
          title: error.errMsg,
          icon: 'none',
        })
        this.setData({
          loading: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    console.log(this.data.num)
    this.getCate(1)
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
    //页面create
    this.getCate()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('category hide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
            console.log("aright", that.data.aright)
          }
        }
      },
    })

  },
  changeCate(e){
    console.log(e.currentTarget.dataset.id)
  }
})