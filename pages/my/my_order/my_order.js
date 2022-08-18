// pages/items/items.js
var app = getApp();
var wc = require('../../../src/wcache.js');
const {
  isLogin
} = require('../../../utils/handleLogin');
var page = "";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 支付参数
    code: "",
    payment: {},
    status: "",
    status_list: ["无效", "新订单", "待发货", "待收货", "已收货", "完成", "已退货或退款"],
    scrollLeft: 0,
    current1: true,
    current2: false,
    current3: false,
    current4: false,
    current5: false,
    totalMoney: 0,
    goodsnum: 0,
    state: [
      "全部",
      "待付款",
      "待发货",
      "待收货",
      "已完成",
    ],
    // content
    contents: [],
    cui_bool: 1
  },
  // 跳转到物流页面
  skip_logistic: function(e) {
    console.log(e)
      wx.navigateTo({
        url: '/pages/my/logistics/logistics?order_no=' + e.currentTarget.dataset.order_no + "&img=" + this.data.contents[e.currentTarget.dataset.order_index].goods[0].goods_logo,
      })
  
  },

  changenav: function(e) {
    var num = e.target.dataset.current
    if (this.data.currenttab == num) {
      return 1
    } else {
      this.setData({
        currenttab: num
      })
    }
  },

  //  5个页面的点击调接口事件
  // 获取全部数据1
  changenav1: function() {
    var that = this;
    that.setData({
      current1: true,
      current2: false,
      current3: false,
      current4: false,
      current5: false,
      status: ""
    })
    that.onShow();
  },

  //  获取待付款数据 2
  changenav2: function() {
    var that = this;
    that.setData({
      current1: false,
      current2: true,
      current3: false,
      current4: false,
      current5: false,
      status: 1
    })
    that.onShow();
  },

  // 获取待发货数据 3
  changenav3: function() {
    var that = this;
    that.setData({
      current1: false,
      current2: false,
      current3: true,
      current4: false,
      current5: false,
      status: 2
    })
    that.onShow();
  },

  // 获取待收货数据 4
  changenav4: function() {
    var that = this;
    that.setData({
      current1: false,
      current2: false,
      current3: false,
      current4: true,
      current5: false,
      status: 3
    })
    that.onShow();
  },

  // 获取待评价数据 5
  changenav5: function() {
    var that = this;
    that.setData({
      current1: false,
      current2: false,
      current3: false,
      current4: false,
      current5: true,
      status: 4
    })
    that.onShow();
  },

  // 页面跳转
  skip_car: function() {
    wx.switchTab({
      url: '/pages/shopping_car/shopping_car',
    })
  },
  // 评价
  appraise: function(e) {
    var order_index = e.currentTarget.dataset.order_index
    var pj_list = JSON.stringify(this.data.contents[order_index])
    wx.navigateTo({
      url: '/pages/my/appraise/appraise?pj_list=' + pj_list,
    })
  },
  // 取消订单
  cancelorder: function(e) {
    var that = this;
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/cancel',
      data: {
        token: wc.get('token'),
        order_id: e.currentTarget.dataset.orderid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000,
        })
        that.onShow();
      },
    })
  },
  // 催发货
  urge: function(e) {
    var that = this;
    if (e.currentTarget.dataset.is_press == 1) {
      wx.showModal({
        title: '提示',
        content: '您已经催过了',
      })
    } else {
      wx.request({
        url: app.globalData.urlhost + '/api/store.order/press',
        data: {
          token: wc.get('token'),
          order_id: e.currentTarget.dataset.orderid
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
          that.onShow()
        },
      })
    }
  },
  // 删除订单
  // deleteorder: function(e) {
  //   var that = this;
  //   var groupind = e.currentTarget.dataset.groupind;
  //   var contents = this.data.contents;
  //   wx.request({
  //     url: app.globalData.urlhost + '/uapi/order/del',
  //     data: {
  //       user_token: wc.get('token'),
  //       id: e.currentTarget.dataset.orderid
  //     },
  //     header: {
  //       "content-type": "application/x-www-form-urlencoded"
  //     },
  //     method: 'POST',
  //     success: function(res) {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none',
  //         duration: 2000,
  //       })
  //       if (res.data.code == 200) {
  //         contents.splice(groupind, 1)
  //         that.setData({
  //           contents: contents
  //         })
  //       }
  //     },
  //   })
  // },
  // 确认收货
  receive: function(e) {
    var that = this
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/receiving',
      data: {
        token: wc.get('token'),
        order_id: e.currentTarget.dataset.orderid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000,
        })
        that.onShow()
      },
    })
  },

  // 统一支付]
  pay: function(e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/createGoodsParams',
      data: {
        token: wc.get('token'),
        order_no: e.currentTarget.dataset.order_no,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading()
        if (res.data.code == 1) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function(res) {
              if (res.errMsg == "requestPayment:ok") {
                that.onShow();
              }
            },
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000,
          })
        }
      },
    })
  },

  // 查看订单详情
  orderdetails: function(e) {
    wx.navigateTo({
      url: '/pages/my/order_details/order_details?id=' + e.currentTarget.dataset.orderid,
    })
  },

  // 申请退单
  refund: function(e) {
    wx.navigateTo({
      url: '/pages/my/refund_money/refund_money?order_num=' + e.currentTarget.dataset.order_num + "&order_id=" + e.currentTarget.dataset.order_id,
    })
  },
  onLoad: function(e) {
    if (e.status) {
      this.setData({
        status: e.status
      })
    }
    if (e.status == 1) {
      this.changenav2()
    } else if (e.status == 2) {
      this.changenav3()
    } else if (e.status == 3) {
      this.changenav4()
    } else if (e.status == 4) {
      this.changenav5()
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    //价钱统计和数量统计
    var that = this;
    // 登录
    isLogin(() => {})
    page = 1;
    // 获取全部订单
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/index',
      data: {
        token: wc.get('token'),
        status: that.data.status,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        that.setData({
          contents: res.data.data
        })
        if (res.data.data.length == 0) {
          that.setData({
            is_all: false
          })
        } else {
          that.setData({
            is_all: true
          })
        }
      },
    })
    //  获取code
    wx.login({
      success: function(res) {
        var _code = res.code;
        that.setData({
          code: _code
        })
      }
    })
  },
  // onReachBottom: function() {
  //   var that = this;
  //   // 显示加载图标
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   page++;
  //   console.log(page)
  //   wx.request({
  //     url: app.globalData.urlhost + '/uapi/order/index',
  //     data: {
  //       user_token: wc.get('token'),
  //       status: that.data.status,
  //       page_now: page
  //     },
  //     header: {
  //       "content-type": "application/x-www-form-urlencoded"
  //     },
  //     method: 'POST',
  //     success: function(res) {
  //       wx.hideLoading();
  //       if (res.data.data == null) {
  //         return
  //       } else {
  //         var contents = that.data.contents;
  //         var con_list = contents.concat(res.data.data)
  //         that.setData({
  //           contents: con_list
  //         })
  //       }
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})