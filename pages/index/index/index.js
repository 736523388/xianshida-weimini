//index.js
//获取应用实例
let flage = true
const app = getApp()
import {
  getStorage,
  isLogin
} from '../../../utils/handleLogin'
import {
  $init,
  $digest
} from '../../../utils/common.util'

var wc = require('../../../src/wcache.js');

var page;
Page({
  data: {
      userInfo:{},//用户信息
      identity:1,//身份

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
    recommendgoodsPrice:'',
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
    allocation:[],
    
  },
  skip_all:function(e){
    wx.navigateTo({
      url: '/pages/classify/classifyList/classifyList?id=' + e.currentTarget.dataset.id,
    })
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

                if(res.data.code == 0){
                    _this.load(_this.data.identity);
                }else{
                    if (res.data.data.user_level != 0) {
                        _this.setData({
                            identity: 2
                        })
                    } else {
                        _this.setData({
                            identity: 1
                        })
                    }
                    _this.load(_this.data.identity);
                }

                

                

            },
        })
    },

    //轮播图跳转
    goTo(e){
        var item = e.currentTarget.dataset.item;
        console.log(item)
        if (item.target_type == 2){
            console.log(item.url)
            wx.navigateTo({
                url: '../../'+item.url,
            })
        } else if (item.target_type == 1){
            console.log(item)
            wx.navigateTo({
                url: '../productContent/productContent?id='+item.url,
            })
        }
    },

  /**
   * 获取推荐商品
   */
  getnominate: function () {
    var that = this;
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/goods_nominate',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            that.data.nominate = res.data.data.data
            $digest(that)
          }
        }
      }
    })
  },
  // 自定义banner指示点
  swiperChange: function(e) {
    // this.setData({
    //   currentSwiper: e.detail.current
    // })
  },
  // 限量购  产品点击跳转
  limitLink: function(e) {
    wx.navigateTo({
      url: '/pages/index/productContent/productContent?id=' + e.currentTarget.dataset.id,
    })
  },
  // 获取首页配置
  allocation:function(){
    var that=this;
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/getconfig',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            that.data.allocation = res.data.data
            $digest(that)
              console.log(res)
          }
        }
      }
    })
  },

  //获取首页推荐商品
  recommend: function() {
    if (this.data.getRecommend === false){
      return false
    }
    let token = getStorage('token')
    let that = this

    let pamas= {
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
      success: function(res) {
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


            that.getUserInfo();
          }
        }
      }
    })
    
  },

    load: function (identity) {
    let token = getStorage('token')
    let that = this
    
    let params = {
        identity: identity
    }
      console.log("params", params)
    // 获取banner
    wx.request({
      data:params,
      url: app.globalData.urlhost + '/api/store.banner/index',
      success: function(res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            that.data.imgs = res.data.data;
            console.log(res)
            $digest(that)
          } else {
            wx.showLoading({
              title: '加载中',
            })
          }

        }
      }
    })

    //获取分类
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods_cate/special',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            that.data.speciallist = res.data.data
            $digest(that)
          }
        }
      }
    })

  },

  // 搜索跳转
  ban_link: function() {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  // 大牌专享  点击更多跳转
  brandLink:function(){
    wx.navigateTo({
      url: '/pages/classify/brandList/brandList',
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
 
  onLoad: function() {
    $init(this)
    
    this.data.recommendgoods = {}
    this.data.recommendgoodspage = 1
    this.data.getRecommend = true
    //this.load()
   
    this.allocation()
    this.getnominate()
    $digest(this)
    this.getLogo()
  },
  /**
   * 获取LOGO 并存入缓存
   */
  getLogo(){
    let that = this
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/sysconf',
      method: 'GET',
      data: {
        name: 'web_logo'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            wx.setStorageSync('web_logo', res.data.data)
            console.log(wx.getStorageSync('web_logo'))
          }
        }
      }
    })
  },
  onShow: function() {
    let token = getStorage('token');    
    this.recommend()
    if (token){
      if (flage){
        // this.data.recommendgoods = {}
        console.log(this.data.recommendgoodspage)
        this.data.recommendgoodspage = ((this.data.recommendgoodspage)-1)+1
        console.log(this.data.recommendgoodspage)
        this.data.getRecommend = true
        //this.load()
        this.allocation()
        console.log(1)
        flage = false
        if (page != this.data.recommendgoodspage){
          this.recommend()
        }
        $digest(this)
      }
    }else{
      console.log(12)
      return false
    }
  },
  goTospike: function (){
    wx.navigateTo({
      url: '/pages/index/assemble/assemble',
    })
     console.log('去拼团')
    // wx.showModal({
    //   title: '提示',
    //   content: '敬请期待',
    //   showCancel: false,
    //   confirmText: '确认'
    // })
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
  onReachBottom: function () {
  },

    //分享转发
    onShareAppMessage: function (options) {
        console.log(options)
        var that = this;
        // 设置转发内容
        var shareObj = {
            title: "豪臻",
            path: '', // 默认是当前页面，必须是以‘/’开头的完整路径
            imgUrl: '', //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。

        };

        // 返回shareObj
        return shareObj;
    }
  
})