// pages/index/bargin/bargin.js
const app = getApp();
import { $init, $digest } from '../../../utils/common.util'
import { promisify } from '../../../utils/promise.util'
import { isLogin, getStorage } from '../../../utils/handleLogin'
import { wxParse } from '../../../wxParse/wxParse'
var wc = require('../../../src/wcache.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 倒计时
    timer: false,
    aday:0,
    ahour: 0,
    aminute: 0,
    asecond: 0,
    //活动规则显示
    ruleFlage:false,
    //当前砍价金额
    dadao_price: 0,
    // 弹出层
    eImg:"https://cdn.xhzsm.com/bargain-img3.png",
    eFlage:false,
    // 分享弹出层
    shareImg:"https://cdn.xhzsm.com/bargain-img4.png",
    shareFlage:false,
    // 第一次分享给好友 返回到小程序界面
    s1Return: false,
    // 接收从列表页传过来的关键字
    key:{
      /*活动ID*/
      id: 0,
      /*砍价ID*/
      order_bargain_id: 0
    },
    // 砍价数据
    bargainCont:[],
    // 进度条
    progress: 0,
    // 已砍   left值
    width: 0,
    // 猜你喜欢
    getLike:[],
    // 规则id
    ruleId:64,
    // 当前所选规格
    checkspec: {},
    //规格列表
    detail: [],
    //选择规格确定按钮是否可点击
    optionFlage: false,
    // 规格显示/隐藏
    setClose: false,
    checkListI: 0,
    web_logo: ''
    
  },
  gotoHome: function () {
    wx.switchTab({
      url: '/pages/index/index/index',
    })
  },
  // 活动规则点击
  ruleShow:function(){
    this.data.ruleFlage = true
    $digest(this)
  },
  // 活动规则 关闭 点击
  ruleClose:function(){
    this.data.ruleFlage = false
    $digest(this)
  },
  // 请求砍价详情页数据
  getBargainCont:function(){
    console.log('请求砍价详情页数据开始')
    var that=this;
    /*loading层*/
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    let params = {
        id: that.data.key.id,
        token: getStorage('token'),
        order_bargain_id: that.data.key.order_bargain_id
    }
    console.log('params:',params)
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/detail',
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res)
        if(res.statusCode == 200){
          /*取消loading*/
          wx.hideLoading()
          /*请求成功*/
          if(res.data.code == 1){
            
            /*砍价弹出层开始*/
            if (res.data.data.dadao_price > 0 || that.data.dadao_price > 0){
              that.data.eFlage = true
              setTimeout(function () {
                that.data.eFlage = false
                that.data.shareFlage = true
                $digest(that)
              }, 2000)
            }
            /*砍价弹出层结束*/
            res.data.data.goods_info.low_price = parseFloat(res.data.data.goods_info.low_price)
            res.data.data.goods_info.start_price = parseFloat(res.data.data.goods_info.start_price)
            /*计算剩余未砍*/
            res.data.data.goods_info.d_value = that.numSub(res.data.data.goods_info.now_price, res.data.data.goods_info.low_price)
            /*计算已砍金额*/
            res.data.data.goods_info.a_value = that.numSub(res.data.data.goods_info.start_price, res.data.data.goods_info.now_price)
            that.data.bargainCont = res.data.data
            let num = Number(res.data.data.goods_info.a_value / that.numSub(res.data.data.goods_info.start_price, res.data.data.goods_info.low_price)) 
            that.fn(num)
            if (res.data.data.goods_info.success_time >= 0 && res.data.data.goods_info.order_no == ''){
              // 结束时间
              let times = res.data.data.goods_info.end_time - (new Date().getTime()) / 1000
              if(times > 0){
                /*倒计时开始*/
                let day = Math.floor(times / (60 * 60 * 24))
                let hour = Math.floor(times / (60 * 60)) - (day * 24)
                let minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60)
                let second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
                if (day <= 9) day = '0' + day
                if (hour <= 9) hour = '0' + hour
                if (minute <= 9) minute = '0' + minute
                if (second <= 9) second = '0' + second
                that.data.aday = day
                that.data.ahour = hour
                that.data.aminute = minute
                that.data.asecond = second
                // 执行倒计时函数
                that.countDown(times)
              }else{
                console.log('eee')
                //that.onShow()
              }
            }    
            $digest(that)
          }else{
          /*请求失败*/
          console.lgo(res.data.msg)
          }
        }
      }
    })
  },
  // 进度条
  fn: function (num) {
    
    var num2 = num * 100
    this.data.progress = num2
    if (num <= 0.135){
      this.data.width = 0
    }else{
      this.data.width = num2 - 13.5
    }
    $digest(this)
  },
  share1: function () {
    this.data.shareFlage = false
    $digest(this)
  },
  //带天数的倒计时
  countDown: function (times) {
    let that = this
    clearInterval(that.data.timer)
    that.data.timer = setInterval(function () {
      times--
      let day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值
      if (times > 0) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        that.data.aday = day
        that.data.ahour = hour
        that.data.aminute = minute
        that.data.asecond = second
        $digest(that)
      } else {
        console.log('倒计时结束')
        clearInterval(that.data.timer)
        //that.onShow()
      }
      
    }, 1000)
  },
  // 获取猜你喜欢数据
  getLike:function(){
    var that=this
    /*loading层*/
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/recommend',
      data: that.data.key.id,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        wx.hideLoading()
        if(res.statusCode == 200){
          if(res.data.code == 1){
            console.log(res)
            res.data.data.forEach((item,index) => {
              item.low_price = parseFloat(item.low_price)
            })
            that.data.getLike = res.data.data
            $digest(that)
          }
        }
      }
    })
  },
  // 获取活动规则数据
  getRule:function(){
    var that=this;
    // 获取规则内容
   
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/agreement',
      data: {
        id: that.data.ruleId
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            console.log(res)
            //富文本转换
            wxParse('article', 'html', res.data.data, that, 5);
          }
        }
      }
    })
  },
  // 猜你喜欢点击
  addShow: function (e) {
    this.getSpec(e)
  },
  // 关闭按钮点击
  close: function () {
    this.data.setClose = false
    $digest(this)
  },
  /**
   * 获取商品规格
   */
  getSpec: function (e) {
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
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
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
                    if (onchecck.indexOf(',' + item.name + ':' + values + ',') > -1) {
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
          if (onchecck.indexOf(',' + checkitem + ',') == -1) {
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
      id: that.data.getLike[that.data.checkListI].id,
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
        wx.hideLoading()
        if (res.statusCode == 200) {
          that.data.setClose = false
          $digest(that)
          console.log(res.data)
          if (res.data.code === 1) {
            //跳转到砍价详情页
            wx.navigateTo({
              url: '/pages/index/bargainCont/bargainCont?id=' + params.id + '&order_bargain_id=' + res.data.data.goods_info.order_bargain_id + '&dadao_price=' + res.data.data.dadao_price,
            })
          } else {
            if (res.data.hasOwnProperty('data') && res.data.data.hasOwnProperty('order_bargain_id')) {
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
            } else {
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
   * 生命周期函数--监听页面加载
   */

  onLoad: function (e) {
    this.setData({
      web_logo: wx.getStorageSync('web_logo')
    })
    console.log(e)
    var that = this;
    $init(that)
     /*活动ID*/
    if (e.hasOwnProperty('id')){
      that.data.key.id = e.id
      console.log(that.data.key.id)
    }
    /*砍价ID*/
    if (e.hasOwnProperty('order_bargain_id')) {
      that.data.key.order_bargain_id = e.order_bargain_id
    }
    /*砍价金额*/
    if (e.hasOwnProperty('dadao_price')) {
      that.data.dadao_price = e.dadao_price
    }
    if (e.parent_id) {
      console.log(e.parent_id)
      wc.put("sceneUserId", e.parent_id)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    isLogin(()=>{
      console.log('isLoginCallback')
      clearInterval(this.data.timer)
      // 获取砍价商品数据
      this.getBargainCont()
      // 获取猜你喜欢数据
      this.getLike()
      // 获取活动规则
      this.getRule()
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      //::todo 下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that=this;
    var id = that.data.key.id;
    var order_bargain_id = that.data.bargainCont.goods_info.order_bargain_id
    var parent_id = that.data.bargainCont.author.id
    return{
      title: '我发现一件好货，来一起砍价' + that.data.bargainCont.goods_info.low_price +'元拿吧！！！',
      path: 'pages/index/bargainCont/bargainCont?id=' + id + '&order_bargain_id=' + order_bargain_id + '&parent_id=' + parent_id
    }
  },
  /**
   * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
   *
   * @param num1减数  |  num2被减数
  */
  numSub: function (num1, num2) {
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
  },
  onHide: function(res){
    this.data.dadao_price = 0
    $digest(this)
    clearInterval(this.data.timer)
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer)
  },
  goToOrder: function (){
    console.log('eee')
    wx.navigateTo({
      url: '/pages/index/bargainOrderCon/bargainOrderCon?id=' + this.data.bargainCont.goods_info.order_bargain_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
  
})