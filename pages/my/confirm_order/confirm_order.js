const app = getApp()
const {
  isLogin
} = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
var pay_amount = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 购物车传过来的数据
    ans_list: '',
    // 结算的产品
    goods_list: [],
    all_pay_msg: [],
    // 接受平台规则
    rule_bool1: false,
    rule_bool2: false,
    // 订单备注
    order_tips: "",
    // 地址和实名认证
    address_id: "",
    address_bool: "",
    address: [],
    id_card_id: "",
    id_card_bool: "",
    id_card: [],
    is_idcard: false,
    coupon: [],
    coupon_len: 0,
    coupon_name: [],
    coupon_id:"",
    sel_coupon: '请选择优惠券',
    use_integral: 0,
    use_integral_data: 0,
    real_price: "",
    available_integral: "",
    total_integral: "",
    discount_amount: "",
    disabled: 0,
    pay_amount: ""
  },
  change_coupon: function(e) {
    this.setData({
      sel_coupon: this.data.coupon_name[e.detail.value],
      coupon_id: this.data.coupon[e.detail.value].id
    })
    this.coupon_data()
  },
  order_tips: function(e) {
    this.setData({
      order_tips: e.detail.value
    })
  },
  rule_bool1: function() {
    this.setData({
      rule_bool1: !this.data.rule_bool1,
      disabled: 0
    })
  },
  rule_bool2: function() {
    this.setData({
      rule_bool2: !this.data.rule_bool2,
      disabled: 0
    })
  },
  use_integral: function() {
    this.setData({
      use_integral: !this.data.use_integral
    })
    if (this.data.use_integral) {
      this.setData({
        use_integral_data: 1
      })
    } else {
      this.setData({
        use_integral_data: 0
      })
    }
    this.coupon_data()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    var that = this
    if (e.selectAttrid) {
      var selectAttrid = e.selectAttrid.split(",")
      var selectNum = e.selectNum.split(",")
      var selectSpec = e.selectSpec.split(",")
      var ans_list = []
      for (var i = 0; i < selectAttrid.length; i++) {
        var ans = selectAttrid[i] + "@" + selectSpec[i] + "@" + selectNum[i]
        ans_list.push(ans)
      }
      that.setData({
        ans_list: ans_list.join(";")
      })

    } else {
      that.setData({
        ans_list: e.key
      })
    }
    console.log(that.data.ans_list)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  coupon_data: function() {
    var that = this
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/confirm',
      data: {
        token: wc.get('token'),
        data: that.data.ans_list,
        use_integral: that.data.use_integral_data,
        coupon_id:"",
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            real_price: res.data.data.real_price,
            available_integral: res.data.data.user_integral.available_integral,
            total_integral: res.data.data.user_integral.total_integral,
            discount_amount: res.data.data.user_integral.discount_amount,
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    pay_amount = 0
    // 登录
    isLogin(() => {})
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/confirm',
      data: {
        token: wc.get('token'),
        data: that.data.ans_list,
        use_integral: that.data.use_integral_data,
        coupon_id:"",
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          var coupon_name = []
          for (var i = 0; i < res.data.data.goodslist.length; i++) {
            if (res.data.data.goodslist[i].is_auth == 1) {
              that.setData({
                is_idcard: true,
              })
              wx.request({
                url: app.globalData.urlhost + '/api/user.authentication/index',
                data: {
                  token: wc.get('token')
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                  console.log(res)
                  if (res.data.data.length == 0) {
                    that.setData({
                      id_card_bool: 0
                    })
                  } else {
                    that.setData({
                      id_card_bool: 1
                    })
                  }
                  for (var i = 0; i < res.data.data.length; i++) {
                    that.setData({
                      id_card: res.data.data[0],
                      id_card_id: res.data.data[0].id
                    });
                  }
                },
              })
            }
            pay_amount += parseInt(res.data.data.goodslist[i].number)
          }
          if (res.data.data.couponlist.length != 0) {
            for (var i = 0; i < res.data.data.couponlist.length; i++) {
              coupon_name.push(res.data.data.couponlist[i].coupon_name)
            }
            that.setData({
              coupon: res.data.data.couponlist,
              coupon_len: res.data.data.couponlist.length,
              coupon_name: coupon_name,
              // coupon_id: res.data.data.couponlist[0].id,
            })
          }
          that.setData({
            all_pay_msg: res.data.data,
            real_price: res.data.data.real_price,
            goods_list: res.data.data.goodslist,
            available_integral: res.data.data.user_integral.available_integral,
            total_integral: res.data.data.user_integral.total_integral,
            discount_amount: res.data.data.user_integral.discount_amount,
            disabled: 0,
            pay_amount: pay_amount
          })
        }
      },
    })
    wx.request({
      url: app.globalData.urlhost + '/api/user.address/index',
      data: {
        token: wc.get('token')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        if (res.data.data.length == 0) {
          that.setData({
            address_bool: 0
          })
        } else {
          that.setData({
            address_bool: 1
          })
        }
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].is_default) {
            that.setData({
              address_id: res.data.data[i].id,
              address: res.data.data[i]
            });
          } else {
            that.setData({
              address_id: res.data.data[0].id,
              address: res.data.data[0]
            });
          }
        }
      },
    })
  },
  // 创建订单+支付接口
  pay: function() {
    var that = this
    that.setData({
      disabled: 1
    })
    if (that.data.address_id == '') {
      wx.showModal({
        title: '提示',
        content: '请填写收货地址',
      })
      return
    }

    wx.request({
      url: app.globalData.urlhost + '/api/store.order/create',
      data: {
        token: wc.get('token'),
        data: that.data.ans_list,
        use_integral: that.data.use_integral_data,
        coupon_id: that.data.coupon_id,
        address_id: that.data.address_id,
        authentication_id: that.data.id_card_id,
        order_desc: that.data.order_tips,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          disabled: 0
        })
        if (res.data.code == 1) {
          if (res.data.is_pay == 1) {
            wx.showToast({
              title: "支付成功",
              icon: "success",
              duration: 3000,
              success: function(res) {
                setTimeout(function() {
                  wx.navigateTo({
                    url: '/pages/my/my_order/my_order',
                  })
                }, 3000)
              },
            })
          } else {
            wx.request({
              url: app.globalData.urlhost + '/api/store.order/createGoodsParams',
              data: {
                token: wc.get('token'),
                order_no: res.data.order_no
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function(res) {
                if (res.data.code == 1) {
                  wx.requestPayment({
                    timeStamp: res.data.data.timeStamp,
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.package,
                    signType: res.data.data.signType,
                    paySign: res.data.data.paySign,
                    success: function(res) {
                      console.log(res)
                      if (res.errMsg == "requestPayment:ok") {
                        wx.navigateTo({
                          url: '/pages/my/my_order/my_order',
                        })
                      }
                    },
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000,
                  })
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/my/my_order/my_order',
                    })
                  }, 3000)
                }
              },
            })

          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000,
          })
        }
      },
      complete: function(res) {
        that.setData({
          disabled: 0
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})