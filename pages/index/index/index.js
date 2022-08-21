//index.js
//获取应用实例
const app = getApp()
import {
  $init,
  $digest
} from '../../../utils/common.util'
Page({
  data: {
    identity: 1, //身份
    // banner
    imgs: [],
    specialCate: [],
    currentSwiper: 0,
    autoplay: true,
    circular: true,
    // 首页配置
    allocation: [],
    loading: false,
    loaded: false,
    goods_list: [],
    goods_page: 1,
    loaderror: false
  },
  //跳转商品列表
  skip_all: function (e) {
    wx.navigateTo({
      url: '/pages/classify/classifyList/classifyList?id=' + e.currentTarget.dataset.id,
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
            this.data.imgs = res.data.data;
            $digest(this)
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
            this.data.specialCate = res.data.data
            $digest(this)
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
    $init(this)
    //加载BANNER和分类及首页配置
    this.load(1)
    //加载商品数据
    this.getGoodsList()
  },
  getGoodsList(ref) {
    console.log('getGoodsList', ref)
    if(ref === 'ref'){
      this.setData({
        goods_list: [],
        goods_page: 1,
        loaded: false,
        loaderror: false
      })
    } else if(ref !== undefined){
      this.setData({
        loaderror: false
      })
    }
    if (this.data.loading !== false || this.data.loaded === true) {
      return false
    }
    this.setData({ loading: true })
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/allgoods',
      params: {
        page: this.data.goods_page,
      },
      success: res => {
        console.log('goods', res)
        if(res.statusCode !== 200 || res.data.code !== 1){
          this.setData({
            loading: false,
            loaderror: true
          })
          return
        }
        this.setData({
          goods_list: this.data.goods_list.concat(res.data.data.data),
          goods_page: res.data.data.data.length < 10 ? this.data.goods_page : this.data.goods_page+1,
          loaded: res.data.data.data.length < 10,
          loading: false
        })
        console.log('goods data',this.data.goods_list)
      },
      fail: () => {
        this.setData({
          loading: false,
          loaderror: true
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
  },
  onPullDownRefresh: function () {
    this.getGoodsList('ref')
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log('onReachBottom')
    this.getGoodsList()
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