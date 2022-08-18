// pages/index/barginList/barginList.js
const app = getApp();
import { $init, $digest } from '../../../utils/common.util'
import { promisify } from '../../../utils/promise.util'
import { isLogin, getStorage } from '../../../utils/handleLogin'
var page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // banner
    banner: '',
    // 文字跑马灯
    move:[],
    textList:[],
    // 砍价商品列表
    list: [],
    // 一页个数
    pageSize:5,
    // 页码
    pageNow:1,
    // 上拉加载开关
    bargainFlag:true,
    // 当前所选规格
    checkspec: {},
    //规格列表
    detail: [],
    //选择规格确定按钮是否可点击
    optionFlage: false,
    // 规格显示/隐藏
    setClose: false,
    checkListI: 0,
    // 页码是否叠加
    isEarth: false,
  },
  // 关闭按钮点击
  close: function () {
    this.data.setClose = false
    $digest(this)
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
    this.getBanner()
    //this.getHeight()
    
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
    this.data.list = []
    this.data.pageNow = 1
    this.data.bargainFlag = true
    $digest(this)
    this.getBargainList()
    this.getText()
    
  },
 // 获取砍价列表数据
  getBargainList: function () {
    var that=this
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/lists',
      data: {
        page_size: that.data.pageSize,
        page_now: that.data.pageNow,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if (res.statusCode == 200) {
          wx.hideLoading()
          if (res.data.code === 1) {
            res.data.data.forEach((item,index)=>{
              item.low_price = parseFloat(item.low_price)
            })
            that.data.list = that.data.list.concat(res.data.data)
            if (res.data.data.length < that.data.pageSize){
               that.data.bargainFlag = false
            }else{
               that.data.pageNow ++
            }
            $digest(that)
          }
        }
      }
    })
  },
  // 获取砍价banner
  getBanner:function(){
    var that=this
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/sysconf',
      data: {
        name:'bargain_bg_img'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.statusCode == 200){
          wx.hideLoading()
          if(res.data.code == 1){
            that.data.banner = res.data.data
            $digest(that)
          }
        }
      }
    })
  },
  //  获取文字滚动  快斧榜
  getText:function(){
    var that=this
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/fast_success',
      data: {
        name: 'bargain_bg_img'
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if(res.statusCode == 200){
          if(res.data.code == 1){
            that.data.move = res.data.data
            $digest(that)
            //that.getHeight()
          }
        }
      }
    })
  },
  /**
   * 商品列表点击
   */
  addShow: function (e) {
    isLogin(() => {
      this.getSpec(e)
    })
  },
  /**
   * 获取商品规格
   */
  getSpec:function(e){
    console.log(e)
    let goods_id = e.currentTarget.dataset.goods_id
    let checkListI = e.currentTarget.dataset.i
    let that = this
    that.data.checkspec = {}
    that.data.optionFlage = false
    that.data.setClose = true
    that.data.checkListI = checkListI
    $digest(that)
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/goods_sku',
      data: {
        goods_id: goods_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res)
        if(res.statusCode == 200){
          wx.hideLoading()
          if (res.data.code === 1) {
            console.log(res.data)
            if (res.data.data.spec_list.length === 0) {
              res.data.data.spec_list = [
                {
                  name: '规格', value: [{
                    spec_title: '默认规格',
                    is_show: true,
                    is_seleted: (res.data.data.spec[0].goods_stock - res.data.data.spec[0].goods_sale) > 0 ? true : false,
                    is_elective: (res.data.data.spec[0].goods_stock - res.data.data.spec[0].goods_sale) > 0 ? true : false,
                  }]
                }
              ]
              that.data.checkspec = res.data.data.spec[0]
              that.data.optionFlage = (res.data.data.spec[0].goods_stock - res.data.data.spec[0].goods_sale) > 0 ? true : false
            } else {
              //循环规格列表
              res.data.data.spec_list.forEach((item) => {
                //循环规格可选项
                item.value.forEach((values, index) => {
                  //是否显示
                  let is_show = false
                  //是否可选
                  let is_elective = false
                  //循环所有商品规格
                  res.data.data.spec.forEach((speitem, speindex) => {
                    //如果商品规格中包含此选项
                    let onchecck = ',' + speitem.goods_spec + ','
                    if (onchecck.indexOf(',' + item.name + ':' + values + ',') > -1){
                      is_show = true
                      //如果任一商品规格的库存大于销量
                      if (speitem.goods_stock > speitem.goods_sale) {
                        is_elective = true
                      }
                    }
                  })
                  item.value[index] = {}
                  item.value[index].spec_title = values
                  item.value[index].is_seleted = false
                  item.value[index].is_show = is_show
                  item.value[index].is_elective = is_elective
                })
              })
            }
            that.data.detail = res.data.data
            console.log(that.data.detail)
            $digest(that)
          }
          else {
            console.log('获取商品规格失败')
          }
        }
      }
    })
  },

  /**
   * 选择规格
   */
  setSpecSeleted: function (e) {
    //如果点击项已选中 则打断不往下执行
    if (this.data.detail.spec_list[e.currentTarget.dataset.key1].value[e.currentTarget.dataset.key2].is_seleted === true) {
      return false
    }
    //如果点击项不可点击 则打断不往下执行
    if (this.data.detail.spec_list[e.currentTarget.dataset.key1].value[e.currentTarget.dataset.key2].is_elective === false) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    //确认框暂时设为可选
    this.data.optionFlage = true
    //已选规格数组
    let params = []
    //当前点击规格下标
    let check
    //循环规格列表
    this.data.detail.spec_list.forEach((item, index) => {
      //设置规格全选状态
      let is_true = false
      //循环规格可选属性
      item.value.forEach((values, key) => {
        //如果点击属性规格为当前循环规格
        if (e.currentTarget.dataset.key1 === index) {
          //设置所有属性未选中
          values.is_seleted = false
          //如果当前点击属性为当前属性
          if (e.currentTarget.dataset.key2 === key) {
            //设置点击属性选中
            values.is_seleted = true
            //设置当前点击规格下标
            check = index

          }
        }
        if (values.is_seleted === true) {
          is_true = true
          params.push(item.name + ':' + values.spec_title)
        }
      })
      //如果未全选则设置全选状态为false
      if (is_true === false) {
        this.data.optionFlage = false
      }
    })
    $digest(this)

    //处理其他规格
    this.checkspec(check)
    //查找所选择的规格数据
    if (this.data.optionFlage === true) {
      this.data.detail.spec.forEach((specitem, specindex) => {
        let is_check = true
        params.forEach((checkitem, checkindex) => {
          let onchecck = ',' + specitem.goods_spec + ','
          if (onchecck.indexOf(',' + checkitem + ',') == -1){
          // if (specitem.goods_spec != checkitem) {
            is_check = false
          }
        })
        if (is_check === true) {
          this.data.checkspec = specitem     
        }
      })
    }
    $digest(this)
  },
  /**
   * 处理其它规格
   */
  checkspec: function (i) {
    let spec_list = this.data.detail.spec_list
    spec_list.forEach((item, index) => {
      if (index !== i) {
        let checkparams = []
        spec_list.forEach((item2, index2) => {
          if (index2 !== index) {
            item2.value.forEach((childditem, childdindex) => {
              if (childditem.is_seleted === true) {
                checkparams.push(item2.name + ':' + childditem.spec_title)
              }
            })
          }
        })
        //循环可选项
        item.value.forEach((values, key) => {
          let is_elective = false
          let is_show = false
          this.data.detail.spec.forEach((specitem, specindex) => {
            if (specitem.goods_spec.indexOf(item.name + ':' + values.spec_title) > -1) {
              let is_check = true
              checkparams.forEach((checkitem, checkindex) => {
                if (specitem.goods_spec.indexOf(checkitem) > -1) {
                  is_check = false
                }
              })
              if (is_check === true) {
                is_show = true
                if (specitem.goods_stock > specitem.goods_sale) {
                  is_elective = true
                }
              }
            }
            values.is_elective = is_elective
            values.is_show = is_show
          })
        })
      }
    })

    $digest(this)
  },
  // 规格确定点击
  confirm: function () {
    var that = this
    if (that.data.optionFlage === false) {
      return false
    }
    let params = {
      id: that.data.list[that.data.checkListI].id,
      token: getStorage('token'),
      goods_spec: that.data.checkspec.goods_spec
    }
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // 发起砍价
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/detail',
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.statusCode == 200){
          wx.hideLoading()
          that.data.setClose = false
          $digest(that)
          console.log(res.data)
          if(res.data.code === 1){
            //跳转到砍价详情页
            wx.navigateTo({
              url: '/pages/index/bargainCont/bargainCont?id=' + params.id + '&order_bargain_id=' + res.data.data.goods_info.order_bargain_id + '&dadao_price=' + res.data.data.dadao_price,
            })
          }else{
            if (res.data.hasOwnProperty('data') && res.data.data.hasOwnProperty('order_bargain_id')){
              wx.showModal({
                title: '当前有未完成的团',
                content: res.data.msg,
                confirmText: '查看详情',
                confirmColor: '#F32C6E',
                success(ee) {
                  if (ee.confirm) {
                    wx.navigateTo({
                      url: '/pages/index/bargainCont/bargainCont?id=' + params.id + '&order_bargain_id=' + res.data.data.order_bargain_id,
                    })
                  }
                }
              })
            }else{
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                confirmText: '确认'
              })
            }
          }
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //停止当前页面下拉刷新
    wx.stopPullDownRefresh()
    //onShow
    this.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.bargainFlag === true){
      this.getBargainList()
    }
    return false
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onUnload: function (){
    wx.switchTab({
      url: '../index/index'
    })
  }
})