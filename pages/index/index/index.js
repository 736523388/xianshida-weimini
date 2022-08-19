//index.js
//获取应用实例
let flage = true
const createRecycleContext = require('miniprogram-recycle-view')
const app = getApp()
import {
  getStorage,
  isLogin
} from '../../../utils/handleLogin'
import {
  $init,
  $digest
} from '../../../utils/common.util'
var ctx = null
Page({
  
  data: {
    userInfo: {}, //用户信息
    identity: 1, //身份

    //推荐商品
    nominate: [],
    // banner
    imgs: [{
        url: '/images/ban2.png'
      },
      {
        url: '/images/ban1.png'
      },
      {
        url: '/images/ban2.png'
      },
      {
        url: '/images/ban1.png'
      }
    ],
    recommendgoods: {},
    recommendgoodspage: 1,
    recommendgoodsPrice: '',
    getRecommend: true,
    speciallist: [],
    specialCate: [],
    currentSwiper: 0,
    autoplay: true,
    circular: true,
    // 菜单  小图标
    menuTop: [{
        img: "/images/nav-icon.png",
        text: "国际品牌"
      },
      {
        img: "/images/nav-icon.png",
        text: "100%正品"
      },
      {
        img: "/images/nav-icon.png",
        text: "优质服务"
      }
    ],
    // 菜单  导航
    menuNav: [],

    // 限量购 标题
    limit1: "限量",
    limit2: "抢购",
    limit3: "每人限购一次",
    // 限量购  主体产品
    limitCont: [],
    // 限量购  拼团、砍价
    limitDImg: [],
    // 大牌专享
    brandTitle1: "大牌专享",
    brandTitle2: "偷窥达人购物车 好物剁手不停",
    brandBg: "https://cdn.xhzsm.com/brand-bg.png",
    // 销量榜
    sVTitle1: '全球销量榜',
    sVTitle2: '偷窥达人购物车 好物剁手不停',
    // 单品推荐
    rTitle1: '热销单品推荐',
    rTitle2: '偷窥达人购物车 好物剁手不停',
    rImg: 'https://cdn.xhzsm.com/rImg.png',
    // 首页配置
    allocation: [],
    loading: false,
    loaded: false,
    goods_list: [],
    goods_page: 1
  },
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
    // this.setData({
    //   currentSwiper: e.detail.current
    // })
  },
  // 限量购  产品点击跳转
  limitLink: function (e) {
    wx.navigateTo({
      url: '/pages/index/productContent/productContent?id=' + e.currentTarget.dataset.id,
    })
  },

  //获取首页推荐商品
  recommend: function () {
    if (this.data.getRecommend === false) {
      return false
    }
    let token = getStorage('token')
    let that = this

    let pamas = {
      token: token
    }
    //获取首页推荐商品
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    //获取首页推荐商品
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/recommendgoods',
      method: 'POST',
      data: pamas,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        console.log(typeof res.data.data)
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.hideLoading()
            that.data.recommendgoods.data = res.data.data.data
            that.data.recommendgoodsPrice = res.data.data
            $digest(that)
            console.log(that.data.recommendgoods)
            console.log(that.data.recommendgoods.show_price)
            console.log(that.data.recommendgoodsPrice)
          }
        }
      }
    })

  },
  // 获取banner和商品分类
  load: function (identity) {
    // 获取banner
    wx.request({
      data: {identity},
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
            this.data.speciallist = res.data.data
            $digest(this)
          }
        }
      }
    })
    // 获取首页配置
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/getconfig',
      method: 'POST',
      success: res => {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            this.data.allocation = res.data.data
            $digest(this)
          }
        }
      }
    })

  },

  // 搜索跳转
  ban_link: function () {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  /**
   * banner 跳转
   */
  // banLink:function(e){
  //   console.log(e)

  //   if (e.currentTarget.dataset.type === "brand"){
  //     wx.navigateTo({
  //       url: '/pages/classify/brandCont/brandCont?id=' + this.data.imgs[e.currentTarget.dataset.index].brand_id,
  //     })
  //   } else if (e.currentTarget.dataset.type === "goods"){
  //     wx.navigateTo({
  //       url: '/pages/index/productContent/productContent?id=' + this.data.imgs[e.currentTarget.dataset.index].goods_id,
  //     })
  //   } else if (e.currentTarget.dataset.type === "special") {
  //     wx.navigateTo({
  //       url: '/pages/index/shop/shop?id=' + this.data.imgs[e.currentTarget.dataset.index].special_id,
  //     })
  //   }else{
  //     wx.navigateTo({
  //       url: '/pages/index/single/single?id=' + this.data.imgs[e.currentTarget.dataset.index].id,
  //     })
  //   }
  // },
  ctx: Object,
  windowWidth: 0,
  onReady: function(){
    wx.getSystemInfo({
      success: res => {
        this.windowWidth = res.windowWidth;
        //创建RecycleContext对象来管理 recycle-view 定义的的数据
        this.ctx = createRecycleContext({
          id: 'recycleId',
          dataKey: 'recycleList',
          page: this,
          itemSize: this.itemSizeFunc,
        })
      },
    })
  },
  //设置item宽高信息，样式所设必须与之相同
  itemSizeFunc: function (item, idx) {
    console.log(this.windowWidth * 0.47)
    console.log(this.windowWidth * 0.63)
    return {
      width: this.windowWidth * 0.49,
      height: this.windowWidth * 0.64
    }
  },
  onLoad: function () {
    $init(this)
    this.data.recommendgoods = {}
    this.data.recommendgoodspage = 1
    this.data.getRecommend = true
    $digest(this)
    //加载BANNER和分类及首页配置
    this.load(1)
    //加载商品数据
    this.recommend()
    this.getGoodsList()
  },
  getGoodsList(){
    if(this.data.loading !== false || this.data.loaded === true){
      return false
    }
    this.setData({loading: true})
    wx.request({
      url: app.globalData.urlhost +  '/api/store.goods/allgoods',
      method: 'GET',
      params: {
        page: this.data.goods_page,
      },
      success: res => {
        console.log('goods',res)
        this.data.loading = false
        this.ctx.append(res.data.data.data)
        this.ctx.append(res.data.data.data)
        this.ctx.append(res.data.data.data)
        this.ctx.append(res.data.data.data)
        this.ctx.append(res.data.data.data)
        this.ctx.append(res.data.data.data)
        this.ctx.append(res.data.data.data)
        this.ctx.append(res.data.data.data)
        this.ctx.append(res.data.data.data)
        if(res.data.data.data.length < 10){
          this.data.loaded = true
        } else {
          this.data.goods_page++
        }
        $digest(this)
      }
    })
  },
  onShow: function () {
    console.log('index onshow')
  },
  goTospike: function () {
    wx.navigateTo({
      url: '/pages/index/assemble/assemble',
    })
    console.log('去拼团')
  },
  onPullDownRefresh: function () {
    // wx.showNavigationBarLoading()
    // this.data.recommendgoods = {}
    // this.data.recommendgoodspage = 1
    // this.data.getRecommend = true
    // this.load()
    // this.recommend()
    // this.allocation()
    wx.stopPullDownRefresh()
    this.onShow()
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},

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