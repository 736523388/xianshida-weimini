//index.js
//获取应用实例
const app = getApp()
const { isLogin } = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
var top_msg={
  headimg:"",
  id:'',
  level_title:"",
  jf:''
}
Page({
  data: {
    // 个人中心通用信息
    person_msg: [],
    my_order: [
      { img: "../../../images/my/order_icon1.png",url: "/pages/my/my_order/my_order?status=1", name: "待付款", key: "1",orderCount: 0 },
      { img: "../../../images/my/order_icon2.png", url: "/pages/my/my_order/my_order?status=2", name: "待发货", key: "2", orderCount: 0 },
      { img: "../../../images/my/order_icon3.png", url: "/pages/my/my_order/my_order?status=3", name: "待收货", key: "3", orderCount: 0 },
      { img: "../../../images/my/order_icon4.png", url: "/pages/my/my_order/my_order?status=4", name: "待评价", key: "4", orderCount: 0 },
      { img: "../../../images/my/order_icon4.png", url: "/pages/my/refund_money_list/refund_money_list", name: "退款售后", key: "5", orderCount: 0 },
    ],
    my_menu: [
      // { img: "../../../images/my/menu_icon1_1.jpg", url: '/pages/my/withdraw_cash/withdraw_cash', name: "提现", key: "1" },
      { img: "../../../images/my/menu_icon3.jpg", url: "/pages/my/my_jf/my_jf", name: "积分", key: "1" },
      
      { img: "../../../images/my/menu_icon6.jpg", url: '/pages/my/my_coupon/my_coupon', name: "优惠券", key: "2" },
      { img: "../../../images/my/menu_icon5.jpg", url: '/pages/my/my_address/my_address', name: "收货地址", key: "3" },
      // { img: "../../../images/my/menu_icon7.jpg", url: '/pages/my/two_code/two_code', name: "我的二维码", key: "3" },
      { img: "../../../images/my/menu_icon9.jpg", url: '/pages/my/set/set', name: "设置", key: "4" },
      // { img: "../../../images/my/menu_icon10.jpg", url: '/pages/my/refund_money_list/refund_money_list', name: "退款售后", key: "2" },
        // { img: "../../../images/pifa.png", url: '/pages/my/wholesaler/wholesaler', name: "批发商" },
    ],
    top_msg:{},
    my_jf:"",
    animationData: {}
  },
  getorderCount: function () {
    let that = this
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/order_count',
      data: {
        token: wc.get('token'),
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if(res.statusCode === 200){
           if(res.data.code === 1){
             let my_order = that.data.my_order
             for(let i in my_order){
               if(my_order[i].key == '1') {
                 my_order[i].orderCount = res.data.data.noPayCount //评论
               }
               else if (my_order[i].key == '2') {
                 my_order[i].orderCount = res.data.data.noShippingCount//支付
               }
               else if (my_order[i].key == '3') {
                 my_order[i].orderCount = res.data.data.noReceivingCount//收货
               }
               else if (my_order[i].key == '4') {
                 my_order[i].orderCount = res.data.data.noCommentCount//发货
               }
             }
             console.log(my_order)
             that.setData({
               my_order: my_order
             })
           }
        }
      },
    })
  },

  skip_person_msg:function(){
    wx.navigateTo({
     url: '/pages/my/set_person_msg/set_person_msg',
    })
  },

  skip_team: function () {
    var tm = JSON.stringify(this.data.top_msg)
    wx.navigateTo({
      url: '/pages/my/team/team?tm='+tm,
    })
  },
  skip_equty: function (e) {
    wx.navigateTo({
      url: '/pages/my/my_equities/my_equities?index=' + e.currentTarget.dataset.index,
    })
  },
  skip_order: function () {
    wx.navigateTo({
      url: '/pages/my/my_order/my_order',
    })
  },
  // 提现
  skip_wc: function () {
    wx.navigateTo({
      url: '/pages/my/withdraw_cash/withdraw_cash',
    })
  },
  skip_jf: function () {
    wx.navigateTo({
      url: '/pages/my/my_jf/my_jf?jf='+this.data.my_jf,
    })
  },
  onLoad: function (e) {
    console.log('onLoad')
    if (e.scene) {
      console.log(e.scene)
      wc.put("sceneUserId",e.scene)
    }
    if(e.parent_id){
      console.log(e.parent_id)
      wc.put("sceneUserId",e.parent_id)
    }
  },
  onShow() {
    var that = this
    console.log(wc.get("sceneUserId"))
    // 登录
    isLogin(() => {
      this.getorderCount()
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
        var top_msg = {
          headimg: "",
          id: '',
          level_title: "",
          nickname: ""
        }
        if (res.data.code == 1) {
          top_msg.headimg = res.data.data.headimg
          top_msg.id = res.data.data.id
          top_msg.level_title = res.data.data.level_title
          top_msg.nickname = res.data.data.nickname
          wc.put("headimg", res.data.data.headimg)
          for (var i = 0; i < res.data.data.bcard_data.length ;i++){
            if (res.data.data.bcard_data[i].show && res.data.data.bcard_data[i].title == "可使用积分"){
              that.setData({
                my_jf: res.data.data.bcard_data[i].value
              })
            }
          }
          that.setData({
            person_msg: res.data.data,
            top_msg: top_msg
          })
        }
      },
    })
    })

    var circleCount = 0;
    this.animationData = wx.createAnimation({
      duration:1000,   
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) {
      }
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationData.scale(1.15).step();
      } else {
        this.animationData.scale(1.0).step();
      }
      this.setData({
        animationData: this.animationData.export() 
      });
      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 1000);
  },

})
