//index.js
//获取应用实例
const app = getApp()
import {getStorage} from '../../../utils/handleLogin'
Page({
  data: {
    app_name: getStorage('app_name', ''),
    site_name: getStorage('site_name', ''),
    web_logo: getStorage('web_logo', ''),
    company_address: getStorage('company_address', ''),
    express_desc: getStorage('express_desc', ''),
    identity: 1, //身份
    // banner
    imgs: [],
    // 金刚区分类
    specialCate: [],
    keywords: wx.getStorageSync('search_keywords') || [],
    // 首页配置
    allocation: [],
    goods_list: [],
    loading: 'more',// more noMore loading
    // loadend
    loadEnd: "我是有底线的~",
    loadError: false,
    loadErrorTxt: '加载失败，点击重试',
  },
  page: 1,
  //跳转商品列表
  skip_all: function (e) {
    wx.navigateTo({
      url: '/pages/classify/classifyList/classifyList?id=' + e.currentTarget.dataset.id,
    })
  },
  clickIntegral(){
    wx.navigateTo({
      url: '/pages/index/coupon/coupon',
    })
  },
  clickCoupon(){
    wx.navigateTo({
      url: '/pages/index/coupon/coupon',
    })
  },
  //轮播图跳转
  goTo(e) {
    var item = e.currentTarget.dataset.item;
    console.log(item)
    if (item.target_type == 2) {
      console.log(item.url)
      wx.navigateTo({
        url: '../../' + item.url,
      })
    } else if (item.target_type == 1) {
      console.log(item)
      wx.navigateTo({
        url: '../productContent/productContent?id=' + item.url,
      })
    }
  },

  // 自定义banner指示点
  swiperChange: function (e) {
    // console.log(e)
    // this.setData({
    //   currentSwiper: e.detail.current
    // })
  },
  // 获取banner和商品分类
  load: function (identity) {
    // 获取banner
    wx.request({
      data: { identity },
      url: app.globalData.urlhost + '/api/store.banner/index',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            this.setData({
              imgs: res.data.data
            })
          }
        }
      }
    })
    //获取分类
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods_cate/special',
      method: 'POST',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            this.setData({
              specialCate: res.data.data
            })
          }
        }
      }
    })
    // 获取首页配置
    // wx.request({
    //   url: app.globalData.urlhost + '/api/store.goods/getconfig',
    //   method: 'POST',
    //   success: res => {
    //     if (res.statusCode == 200) {
    //       if (res.data.code == 1) {
    //         this.data.allocation = res.data.data
    //         $digest(this)
    //       }
    //     }
    //   }
    // })

  },

  // 搜索跳转
  ban_link: function () {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  onLoad: function () {
    //加载BANNER和分类及首页配置
    this.load(1)
    //加载商品数据
    this.getGoodsList()
  },
  getGoodsList(ref) {
    console.log('getGoodsList', ref)
    if(ref === 'ref'){
      this.page = 1
      this.setData({
        goods_list: [],
        loadError: false,
        loading: this.data.loading === 'loading' ? 'loading' : 'more'
      })
    } else if(ref !== undefined){
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
      params: {
        page: this.page,
      },
      success: res => {
        console.log('goods', res)
        if (res.statusCode !== 200 || res.data.code !== 1) {
          return
        }
        this.page++
        this.setData({
          goods_list: this.data.goods_list.concat(res.data.data.data),
          loading: res.data.data.data.length < 10 ? 'noMore' : 'more'
        })
        console.log('goods data',this.data.goods_list)
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
  onShow: function () {
    console.log('index onshow')
    console.log('search_keywords', wx.getStorageSync('search_keywords'))
  },
  onPullDownRefresh: function () {
    setTimeout(() => this.getGoodsList('ref'), 1000)
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log('onReachBottom')
    this.getGoodsList()
  },

  onReady: function(e){
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/sysconf?name=web_logo',
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.setStorageSync('web_logo', res.data.data)
            this.setData({
              web_logo: res.data.data
            })
          }
        }
      }
    })
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/sysconf?name=site_name',
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.setStorageSync('site_name', res.data.data)
            this.setData({
              site_name: res.data.data
            })
          }
        }
      }
    })
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/sysconf?name=company_address',
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.setStorageSync('company_address', res.data.data)
            this.setData({
              company_address: res.data.data
            })
          }
        }
      }
    })
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/sysconf?name=express_desc',
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.setStorageSync('express_desc', res.data.data)
            this.setData({
              express_desc: res.data.data
            })
          }
        }
      }
    })
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/sysconf?name=app_name',
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.setStorageSync('app_name', res.data.data)
            this.setData({
              app_name: res.data.data
            })
          }
        }
      }
    })
    wx.request({
      url: app.globalData.urlhost + '/api/store.search_txt/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:  res => {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            wx.setStorageSync('search_keywords', res.data.data)
            this.setData({
              keywords: res.data.data
            })
          }
        }
      }
    })
    
  },

  //分享转发
  onShareAppMessage: function (options) {
    // 设置转发内容
    return {
      title: "鲜食达",
      path: '', // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '', //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。
    };
  }

})