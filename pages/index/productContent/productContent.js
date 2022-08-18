// pages/index/productContent/productContent.js
const app=getApp();
import { $init, $digest } from '../../../utils/common.util'
import { promisify } from '../../../utils/promise.util'
import { isLogin, getStorage } from '../../../utils/handleLogin'
//var WxParse = require('../../../wxParse/wxParse.js')
import { wxParse } from '../../../wxParse/wxParse'
var timeFlag=true;
var timer = false
var pageTimer = {
  groupTimer: [],
  spikeTimer: false
}
Page({
    // //分享转发
    // onShareAppMessage: function (options) {
    //     console.log(options)
    //     var that = this;
    //     // 设置转发内容
    //     var shareObj = {
    //         title: "宅厨鲜生",
    //         path: '', // 默认是当前页面，必须是以‘/’开头的完整路径
    //         imgUrl: '', //转发时显示的图片路径，支持网络和本地，不传则使用当前页默认截图。

    //     };

    //     // 返回shareObj
    //     return shareObj;
    // },
  /**
   * 页面的初始数据
   */
  data: {
    hide_price : '',
    hide_price_txt : '',
    show_price : '',  
    detail : [],
    aid:0,
    checkspec: null,
    ReadytobuyStatus: 0,
    // 详情 图片
    img2:'',
    nodes:[],
    // id
    id:true,
    id2: false,
    flage:true,
    // 评价 tab
    true1:true,
    true2: false,
    true3: false,
  
    // 评价列表
    list:[],
    //购买Tips确认按钮是否可点击
    tipsshowprice:0,
    tipsshowstock:0,
    optionIndex:-1,
    optionFlage:false,
    btnFlage:false,
    Num:1,
    close:false,
    // 分享弹出层
    shareFlage:false,
    // 分享图片
    imgFlage:false,
    // 商品库存
    stock2:5,
    // 商品id
    goodsId:0,
    // 商品规格
    goodsSpec:'',
    // 商品数量
    goodsNumber:0,
    // 评论页数
    commentPage:1,
    // 分享海报
    qr_code:"",
    // 评论id
    commentId:0,
    // 购物车数量
    goodsNum:0,
    //商品评论
    goodsComment:[],
    goodsCommentCount:[],
    goodsCommentPagesize:10,
    goodsCommentPage:1,
    getComment: true,
    goodsCommentType:0,
    // 评论图片暂存
    imgList:'',
    // 暂存 获取二维码扫描的参数
    scene:[],
    // 获取二维码扫描的用户id
    sceneUserId:0,
    loginStatus: false,
    // 评论列表显示高度
    commentHeight:"evaluate-list2",
    // 开通会员省多少元
    save:0,
    // 商品标题
    goodsTitle:"",
    // 商品描述
    goodsDesc:"",
    // 商品主图
    goodsLogo:"",
    userId: 10,
    // 判断从哪个活动进入详情页
    activityKey:'',
     // 倒计时
    aday: 0,
    ahour: 0,
    aminute: 0,
    asecond: 0,
    activity_name: '',
    activity: {},
    CountDown: 0,
    alone_pay: false
  },
   

    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(res){
        console.log("this.data.sceneUserId", this.data.sceneUserId)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            console.log('pages/index/productContent/productContent?id=' + this.data.aid + '&sceneUserId=' + this.data.sceneUserId)
        }
        let share_title = this.data.detail.goods_title
        if (this.data.activityKey == 'spike') {
            share_title = '秒杀价' + this.data.detail.activity_info.activity.activity_price + '元，' + share_title
        } else if (this.data.activityKey == 'group') {
            share_title = this.data.detail.activity_info.activity.complete_num + '人拼只需' + this.data.detail.activity_info.activity.activity_price + '元，' + share_title
        }
        return {
            title: share_title,
            path: 'pages/index/productContent/productContent?id=' + this.data.aid + '&sceneUserId=' + this.data.sceneUserId,
            imageUrl: this.data.detail.goods_logo

        }
    },

    getGroup: function (e) {
        isLogin(() => {
            let id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/index/assembleGo/assembleGo?id=' + id,
            })
        })
    },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (e) {  
    /*隐藏转发按钮*/
    //wx.hideShareMenu()
    /**变量初始化*/
    $init(this)   
    var sceneUserId = 0;
    if (e.hasOwnProperty('scene')){
      let scene = e.scene.split("_", 2)
      if(scene){
        sceneUserId = scene[0]
        this.data.aid = scene[1]
      }
    }else{
      if (e.hasOwnProperty('sceneUserId')){
        sceneUserId = e.sceneUserId
      }
      this.data.aid = e.id
    }
    $digest(this)
    // 存缓存
    wx.setStorageSync('sceneUserId', sceneUserId)
    console.log(e)
    try {
      const value = wx.getStorageSync('sceneUserId')
      if (value) {
        // Do something with return value
        isLogin()
      }
    } catch (e) {
      console.log(e)
      // Do something when catch error
    }
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    console.log('onHide')
    for (var each in pageTimer.groupTimer) {
      clearInterval(pageTimer.groupTimer[each])
    }
    // clearInterval(timer)
    // 运行 获取评论函数
    this.comment()
    // 运行 获取购物车数量
    this.goodsNum()
    // 获取商品详情
    this.getCont()
  },
  /*获取商品详情*/
  getCont:function(){
    var that = this;
    var saveNum = 0;
    // 获取详情页数据
    let params = {
      id: that.data.aid
    }
    let token = getStorage('token', '')
    if (token) {
      params.token = token
    }
    wx.request({
       url: app.globalData.urlhost + '/api/store.goods/detail',
      //url: 'http://www.xhz.com/api/store.goods/detail',
      data: params,
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code === 1) {
            console.log(res)
            if (res.data.data.data.spec_list.length === 0) {
              /*处理商品规格*/
              res.data.data.data.spec_list = [
                {
                  name: '规格', value: [{
                    spec_title: '默认规格',
                    is_show: true,
                    is_seleted: (res.data.data.data.spec[0].goods_stock - res.data.data.data.spec[0].goods_sale) > 0 ? true : false,
                    is_elective: (res.data.data.data.spec[0].goods_stock - res.data.data.data.spec[0].goods_sale) > 0 ? true : false,
                  }]
                }
              ]
              that.data.checkspec = res.data.data.data.spec[0]
              that.data.optionFlage = (res.data.data.data.spec[0].goods_stock - res.data.data.data.spec[0].goods_sale) > 0 ? true : false
            } else {
              // 判断是否是活动详情页
              //循环规格列表
              res.data.data.data.spec_list.forEach((item) => {
                //循环规格可选项
                item.value.forEach((values, index) => {
                  //是否显示
                  let is_show = false
                  //是否可选
                  let is_elective = false
                  //循环所有商品规格
                  res.data.data.data.spec.forEach((speitem, speindex) => {
                    //如果商品规格中包含此选项
                    //if (speitem.goods_spec == (item.name + ':' + values)) {
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
            console.log(res.data.data.data.spec_list)
            /*处理商品规格结束*/
            //富文本转换
            wxParse('article', 'html', res.data.data.data.goods_content, that, 5);
            /*当前用户ID 默认为0*/
            that.data.sceneUserId = res.data.data.data.mid
            /*商品详情 */
            that.data.detail = res.data.data.data
            /*价格显示*/
            that.data.hide_price = res.data.data.hide_price
            that.data.hide_price_txt = res.data.data.hide_price_txt
            that.data.show_price = res.data.data.show_price
            /*二维码分享*/
            if (res.data.data.data.hasOwnProperty('qr_code')){
              that.data.qr_code = res.data.data.data.qr_code
            }
            
            // 开通会员立省多少元，保留两位小数
            saveNum = that.data.detail.spec[0].market_price - that.data.detail.spec[0].selling_price
            that.data.save = Math.floor(saveNum * 100) / 100

            //  活动详情页数据

            if (that.data.detail.hasOwnProperty('activity_info')) {
              that.data.activityKey = that.data.detail.activity_info.type
              if (that.data.detail.activity_info.type == 'spike') {
                that.data.activity_name = '限时购'
                let time = that.data.detail.activity_info.activity.activity_end_time
                time = time.replace(/-/g, '/')
                console.log(time)
                time = (new Date(time)).getTime() - (new Date()).valueOf()
                that.countDown(time / 1000)
              } else if (that.data.detail.activity_info.type == 'group'){
                console.log(that.data.detail.activity_info)
                that.data.detail.activity_info.grouping.forEach((item, index) => {
                    that.startGroupTime(index)
                })
              }
            }
            $digest(that)
          }
          else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function (res) {
                if (res.confirm) {//这里是点击了确定以后
                  wx.navigateBack()
                  console.log('用户点击确定')
                } else {//这里是点击了取消以后
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      },
    })
  },
  startGroupTime: function (index){
    // for (var each in pageTimer.groupTimer) {
    //   clearInterval(pageTimer.groupTimer[each])
    // }
    let that = this
      // console.log(index)
    let grouping = that.data.detail.activity_info.grouping[index]
    grouping.day = '00'
    grouping.hour = '00'
    grouping.minute = '00'
    grouping.second = '00'
    grouping.after_time--
    that.data.detail.activity_info.grouping[index] = grouping
    $digest(that)
    pageTimer.groupTimer[index] = setInterval(function () {
      if (grouping.after_time > 0){
        grouping.day = Math.floor(grouping.after_time / (60 * 60 * 24));
        grouping.hour = Math.floor(grouping.after_time / (60 * 60)) - (grouping.day * 24);
        grouping.minute = Math.floor(grouping.after_time / 60) - (grouping.day * 24 * 60) - (grouping.hour * 60);
        grouping.second = Math.floor(grouping.after_time) - (grouping.day * 24 * 60 * 60) - (grouping.hour * 60 * 60) - (grouping.minute * 60);
        if (grouping.day <= 9) grouping.day = '0' + grouping.day;
        if (grouping.hour <= 9) grouping.hour = '0' + grouping.hour;
        if (grouping.minute <= 9) grouping.minute = '0' + grouping.minute;
        if (grouping.second <= 9) grouping.second = '0' + grouping.second;
        console.log(grouping.hour + ':' + grouping.minute + ':' + grouping.second)
        that.data.detail.activity_info.grouping[index] = grouping
        $digest(that)
        grouping.after_time--
      }
      else{
        clearInterval(pageTimer.groupTimer[index])
      }
    }, 1000)
  },
  //选择规格
  setSpecSeleted:function(e){
    //如果点击项已选中 则打断不往下执行
    if (this.data.detail.spec_list[e.currentTarget.dataset.key1].value[e.currentTarget.dataset.key2].is_seleted === true){
      return false
    }
    //如果点击项不可点击 则打断不往下执行
    if (this.data.detail.spec_list[e.currentTarget.dataset.key1].value[e.currentTarget.dataset.key2].is_elective === false){
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    this.data.Num = 1
    //确认框暂时设为可选
    this.data.optionFlage = true
    //已选规格数组
    let params = []
    //当前点击规格下标
    let check
    //循环规格列表
    this.data.detail.spec_list.forEach((item,index) => {
       //设置规格全选状态
       let is_true = false
       //循环规格可选属性
       item.value.forEach((values,key) => {
         //如果点击属性规格为当前循环规格
         if (e.currentTarget.dataset.key1 === index) {
           //设置所有属性未选中
           values.is_seleted = false
           //如果当前点击属性为当前属性
           if (e.currentTarget.dataset.key2 === key){
             //设置点击属性选中
             values.is_seleted = true
             //设置当前点击规格下标
             check = index
           }
         }
         if(values.is_seleted === true){
           is_true = true
           params.push(item.name + ':' + values.spec_title)
         }
       })
       //如果未全选则设置全选状态为false
       if(is_true === false){
         this.data.optionFlage = false
       }
    })
    $digest(this)
   
    //处理其他规格
    this.checkspec(check)
    //查找所选择的规格数据
    if (this.data.optionFlage === true){
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
          this.data.goodsId = specitem.goods_id
          this.data.goodsSpec = specitem.goods_spec
          $digest(this)
        }
      })
    }
  },
  checkspec:function(i){
    let spec_list = this.data.detail.spec_list
    spec_list.forEach((item, index) => {
      if(index !== i){
        console.log(item)
        let checkparams = []
        spec_list.forEach((item2, index2) => {
          if(index2 !== index){
            item2.value.forEach((childditem, childdindex) => {
              if (childditem.is_seleted === true){
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
 
  // 详情 评价点击
  id1:function(){
    this.setData({
      id: true,
      id2: false
    })
  },
  id2: function () {
    this.setData({
      id: false,
      id2: true
    })
  },
  btn:function(){
    if (this.data.optionFlage){
      // console.log(this.data.optionFlage)
    }
  },
  // 点击评论tab
  bindGetComment: function (e){
    if (this.data.goodsCommentType == e.currentTarget.dataset.id){
      return false
    }
    this.data.goodsCommentType = e.currentTarget.dataset.id
    this.data.goodsComment = []
    this.data.goodsCommentPage = 1
    this.data.getComment = true
    this.comment()
  },
  // 获取商品评论
  comment: function () {
    if (this.data.getComment === false) {
      return false
    }
    var that = this;
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/goods_comment',
      data: {
        goods_id: that.data.aid,
        page: that.data.goodsCommentPage,
        type: that.data.goodsCommentType
      },      
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            // console.log(res)
            //that.data.goodsComment = res.data.data.data.comment
            that.data.goodsComment = that.data.goodsComment.concat(res.data.data.data.comment)
            that.data.imgList = that.data.goodsComment
            // console.log(that.data.goodsComment)
            that.data.goodsCommentCount = res.data.data.data.count
            if (res.data.data.data.comment.length<=3){
              that.data.commentHeight ="evaluate-list2"
            }else{
              that.data.commentHeight = "evaluate-list"
            }
            if (res.data.data.data.comment.length < that.data.goodsCommentPage){
              that.data.getComment = false
            }
            that.data.goodsCommentPage++
            $digest(that)
          }
        }
      }
    })
  },
  // 评论列表里的图片点击
  showImg:function(e){
    var src = e.currentTarget.dataset.src,
      srcList = e.currentTarget.dataset.father.image;
      wx.previewImage({
        current: src,
        urls: srcList
      })
  },
  // 获取 购物车数量
  goodsNum:function(){
    var that = this
    let token = getStorage('token', '')
    wx.request({
      url: app.globalData.urlhost + '/api/store.cart/cartnum',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token:token
      },
      dataType: 'json',
      success:function(res){
        if(res.statusCode == 200){
          if(res.data.code == 1){
            // console.log(res)
            that.data.goodsNum = res.data.data
            $digest(that)
          }
        }
      }
    })
  },
  // 数量 加 点击
  plus:function(){
    if (this.data.optionFlage === false) {
      return false
    }
    let Stock = this.data.checkspec.goods_stock - this.data.checkspec.goods_sale
    let Quota = 0
    if (this.data.detail.is_quantity === 1){
      Quota = this.data.detail.quantity_number
    }
    if (Quota === 0){
      Quota = Stock
    }
    if (this.data.Num === Quota){
      return false
    }
    this.data.Num ++
    $digest(this)
  },
  // 数量 减 点击
  reduce:function(){
    if (this.data.optionFlage === false) {
      return false
    }
    if(this.data.Num === 1){
      return false
    }
    this.data.Num -- 
    $digest(this)
  },
  // 关闭按钮点击
  close:function(){
    this.data.close = false
    $digest(this)
  },
  //立即购买或加入购物车
  Readytobuy: function (e) {
    isLogin(() => {
      this.data.ReadytobuyStatus = e.currentTarget.dataset.status
      this.data.alone_pay = e.currentTarget.dataset.status == '2' ? false : true
      this.data.close = true
      $digest(this)
    })
   
  },
  //确定购买或者确定加入购物车
  ConfirmOperation: function (){
    var that=this
    isLogin(() => {
      // console.log(getStorage('token', ''))
      if (this.data.optionFlage === false) {
        return false
      }
      if (this.data.activityKey == 'group'){
        if (!this.data.alone_pay){
          this.goToGroupcreate()
        }else{
          this.goToBuycreate()
        }
      } else if (this.data.ReadytobuyStatus == '1') {//加入购物车
        let params = {
          token: getStorage('token'),
          goods_id: this.data.aid,
          goods_spec: this.data.checkspec.goods_spec,
          number: this.data.Num
        }
        wx.request({
          url: app.globalData.urlhost + '/api/store.cart/add',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: params,
          dataType: 'json',
          success: function (res) {
            // console.log(res)
          },
          fail: function (e) {
            // console.log(e)
          }

        })
        wx.showToast({
          title: '成功加入购物车',
          icon: 'success',
          duration: 1000
        })
        // that.data.close = false
        that.setData({
          close: false
        })
        console.log(that.data.close)
        console.log('加入购物车' + this.data.aid + '@' + this.data.checkspec.goods_spec + '@' + this.data.Num)
      } else if (this.data.ReadytobuyStatus == '2') {//立即购买
        this.goToBuycreate()
      }
    }) 
    $digest(this)
  },
  /**
   * 单独购买
   */
  goToBuycreate(){
    wx.navigateTo({
      url: '/pages/my/confirm_order/confirm_order?key=' + this.data.aid + '@' + this.data.checkspec.goods_spec + '@' + this.data.Num
    })
  },
  /**
   * 去开团
   */
  goToGroupcreate(pid = 0) {
    let groupUrl = '/pages/index/groupOrderCon/groupOrderCon?key=' + this.data.aid + '@' + this.data.checkspec.goods_spec + '@' + this.data.Num + '&pid=' + pid
    wx.navigateTo({
      url: groupUrl
    })
  },
  // 分享图标点击
  shareShow:function(){
    this.setData({
      shareFlage: true
    })
  },
  // 分享弹出层关闭按钮点击
  shareHide: function () {
    this.setData({
      shareFlage: false
    })
  },
  // 分享二维码点击
  imgShare:function(){
    isLogin(()=>{ 
      this.setData({
        imgFlage: true,
        shareFlage: false
      })
      this.download()
    })
  },
  // 关闭分享图片
  imgHide:function(){
    this.setData({
      imgFlage: false,
    })
  },
  // 下载图片
  download: function (e) {
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    var that=this;
    let src = that.data.qr_code;
    
    // 下载图片
    wx.downloadFile({
      url: src,
      success(res) {
        if (res.statusCode === 200) {
          wx.showLoading({
            title: '已保存图片到相册',
            mask: true,
            success: function (res) {
              wx.hideLoading()
             },
            fail: function (res) { },
            complete: function (res) { },
          })
          //  保存到本地相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath
          })
         
        }
      }
    })
    
  },
//  底部链接跳转
  indexLink:function(){
    wx.switchTab({
      url: '/pages/index/index/index',
    })
  },
  indexLink: function () {
    wx.switchTab({
      url: '/pages/index/index/index',
    })
  },
  shop:function(){
    wx.switchTab({
      url: '/pages/shop_care/shop_care/shop_care',
    })
  },
  //带天数的倒计时
  countDown: function(times){
    clearInterval(pageTimer.spikeTimer)
    var that = this
    pageTimer.spikeTimer = setInterval(function () {
      var day = 0,
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
        console.log(day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒");
        that.data.aday = day
        that.data.ahour = hour
        that.data.aminute = minute
        that.data.asecond = second
        $digest(that)
        times--
      }else{
        clearInterval(pageTimer.spikeTimer)
        that.onShow()
      }
    }, 1000);

},
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
    for (var each in pageTimer.groupTimer) {
      clearInterval(pageTimer.groupTimer[each])
    }
    //clearInterval(pageTimer.spikeTimer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
    clearInterval(pageTimer.spikeTimer)
    for (var each in pageTimer.groupTimer) {
      clearInterval(pageTimer.groupTimer[each])
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },


  
    
  
    
})