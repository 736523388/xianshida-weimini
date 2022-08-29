// pages/classify/classifyList/classifyList.js
//获取应用实例
const app = getApp()
import { getStorage } from '../../../utils/handleLogin'
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
    loading: 'more',// more noMore loading
    // loadend
    loadEnd: "我是有底线的~",
    loadError: false,
    loadErrorTxt: '加载失败，点击重试',
    //搜索关键字
    Keyword: '',
    triggered: false

  },
  goodssort: function (e) {
    //点击当前筛选内容 停止
    if (e.currentTarget.dataset.index === this.data.sort) {
      return false
    }
    let { sort } = this.data

    if (e.currentTarget.dataset.index === 'price') {
      sort = (sort === 'pricehight' ? 'pricelow' : 'pricehight')
    } else {
      sort = 'hot'
    }
    this.setData({sort})
    this.load('ref')
  },
  waterFallResh(loading){
    // console.log('loading',loading)
    this.setData({
      loading: this.data.loading === 'loading' ? 'more' : 'noMore'
    })
  },
  // 产品列表接收数据
  load: function (e) {
    console.log('load', e)
    if(e === 'ref'){
      this.setData({
        goodsList: {},
        page: 1,
        loadError: false,
        loading: 'more'
      })
    } else if(e !== undefined){
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

    let params = {
      token: getStorage('token'),
      page: this.data.page,
      sort: this.data.sort,
      goods_title: this.data.Keyword
    }
    if (this.data.cateId) {
      params.cate_id = this.data.cateId
    }
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/allgoods',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: params,
      dataType: 'json',
      success: res => {
        if (res.statusCode !== 200 || res.data.code !== 1) {
          return
        }
        let { goodsList, page, loading } = this.data
        if (goodsList.hasOwnProperty('data')) {
          // goodsList.data = goodsList.data.concat(res.data.data.data)
          goodsList.data = res.data.data.data
        } else {
          goodsList = {
            data: res.data.data.data,
            hide_price: res.data.data.hide_price,
            hide_price_txt: res.data.data.hide_price_txt,
            show_price: res.data.data.show_price,
          }
        }
        page++
        if (res.data.data.data.length < 10) {
          loading = 'noMore'
        } else {
          loading = 'loading'
        }
        this.setData({ goodsList, page, loading, triggered: false })
        this._freshing = false
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
  onRefresh(){
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.load('ref')
    }, 1000)
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },
  onPulling(e) {
    // console.log('onPulling:', e)
  },
  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },
  changeSearch(e) {
    // if (!this.data.Keyword) {
    //   return
    // }
    this.setData({
      sort: 'hot'
    })
    this.load('ref')
  },
  changeSearchInput(e) {
    this.setData({
      Keyword: e.detail.value
    })
  },
  // 跳转到详情页
  goodsLink: function (e) {
    wx.navigateTo({
      url: '/pages/index/productContent/productContent?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    console.log(e)
    let { cateId, Keyword } = this.data
    // 商品id
    if (e.hasOwnProperty('id')) {
      cateId = e.id
    }
    // 搜索关键字
    if (e.hasOwnProperty('key')) {
      Keyword = e.key
    }
    this.setData({ cateId, Keyword })
  },
  onPullDownRefresh: function () {
    this.load('ref')
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
  },

  //分享转发
  onShareAppMessage: function (options) {
    console.log(options)
    var that = this;
    // 设置转发内容
    var shareObj = {
      title: "鲜食达",
      path: '', // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '', //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。

    };

    // 返回shareObj
    return shareObj;
  }
})