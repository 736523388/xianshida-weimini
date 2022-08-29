// pages/classify/classify.js
import {
  getStorage
} from '../../../utils/handleLogin'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 左边导航选中
    num: 0,
    aleft: [],
    cate_id: '',
    goods_list: {},
    page: 1,
    loading: 'more',// more noMore loading
    // loadend
    loadEnd: "我是有底线的~",
    loadError: false,
    loadErrorTxt: '加载失败，点击重试',
  },
  page: 1,
  _freshing: false,
  // 左边导航点击
  active: function (e) {
    this.setData({
      num: e.currentTarget.dataset.index,
      cate_id: e.currentTarget.dataset.id,
    })
    this._freshing = true
    this.getGoods()
  },
  waterFallResh(loading){
    console.log('loading',loading)
    this.setData({
      loading: this.data.loading === 'loading' ? 'more' : 'noMore'
    })
  },
  /**
   * 获取商品列表
   * @param {*} ref 是否刷新列表
   */
  getGoods(ref) {
    if (this._freshing || ref === 'ref') {
      this.page = 1
      this.setData({
        goods_list: {},
        page: 1,
        loadError: false,
        loading: 'more'
      })
    } else if (ref !== undefined) {
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
      url: app.globalData.urlhost + '/api/store.goods/allgoods',
      data: {
        page: this.page,
        cate_id: this.data.cate_id,
        token: getStorage('token')
      },
      success: res => {
        // console.log(res)
        if (res.statusCode !== 200 || res.data.code !== 1) {
          return
        }
        let { goods_list, loading } = this.data
        if (goods_list.hasOwnProperty('data')) {
          // goods_list.data = goods_list.data.concat(res.data.data.data)
          goods_list.data = res.data.data.data
        } else {
          goods_list = {
            data: res.data.data.data,
            hide_price: res.data.data.hide_price,
            hide_price_txt: res.data.data.hide_price_txt,
            show_price: res.data.data.show_price,
          }
        }
        this.page++
        if (res.data.data.data.length < 10) {
          loading = 'noMore'
        } else {
          loading = 'loading'
        }
        this.setData({ goods_list, loading, page: this.data.page+1 })
        this._freshing = false
        console.log('goods data',this.data.goods_list)
      },
      fail: error => {
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
  getCate() {
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods_cate/lists',
      success: res => {
        if (res.statusCode !== 200 || res.data.code !== 1) {
          return
        }
        console.log(res.data.data[this.data.num].id)
        this.setData({
          aleft: res.data.data,
          cate_id: this.data.cate_id ? this.data.cate_id : res.data.data[this.data.num].id
        })
        this.getGoods()
      },
      fail: error => {
        console.log('getCate fail:', error)
      },
      complete: () => {
        console.log('getCate complete')
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    console.log('on show', options, this.data.num)
    let cate_index = wx.getStorageSync('cate_index')
    console.log('cate_index', cate_index)
    this.setData({
      num: cate_index
    })
    this._freshing = true
    this.getCate()
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCate()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    //页面create
    // this.getCate()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('category hide')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom', this.page)
    this.getGoods()
  },
  changeCate(e) {
    this.setData({
      cate_id: e.currentTarget.dataset.id
    })
    this.getGoods('ref')
  }
})