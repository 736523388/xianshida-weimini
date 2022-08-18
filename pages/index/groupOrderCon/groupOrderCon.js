const app = getApp()
var wc = require('../../../src/wcache.js');
import { $init, $digest } from '../../../utils/common.util'
import { promisify } from '../../../utils/promise.util'
import { isLogin, getStorage } from '../../../utils/handleLogin'
import { wxParse } from '../../../wxParse/wxParse'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_data: '0',
    pid: 0,
    // 接受平台规则
    rule_bool1: false,
    rule_bool2: false,
    //付款按钮点击状态
    disabled: true,
    // 订单备注
    order_tips: "",
    //活动信息
    activity_info: {},
    //商品信息
    goods: {},
    //当前选择的收货地址
    setAddress: {},
    setAddressFalg: false,
    //当前选择的实名认证
    setIDcard: {},
    setIDcardFalg: false,
    total_price: '0.00'
  },
  //订单备注
  order_tips: function (e) {
    this.data.order_tips = e.detail.value
    $digest(this)
  },
  setDisabled: function () {
    this.data.disabled =  this.data.setAddressFalg
    if (this.data.goods.is_auth) {
      this.data.disabled = this.data.disabled & this.data.setIDcardFalg
    }
    this.data.disabled = !this.data.disabled
    $digest(this)
  },
  //接受退换货规则
  rule_bool1: function () {
    this.data.rule_bool1 = !this.data.rule_bool1
    $digest(this)
    this.setDisabled()
  },
  //接受用户协议
  rule_bool2: function () {
    this.data.rule_bool2 = !this.data.rule_bool2
    $digest(this)
    this.setDisabled()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    $init(this)
    console.log(e)
    if (!e.hasOwnProperty('key') || !e.hasOwnProperty('pid')){
      wx.navigateBack()
    }
    this.data.goods_data = e.key
    this.data.pid = e.pid
    $digest(this)
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
    isLogin(() => {
      this.load()
    })
  },
  load: function () {
    let that = this
    let params = {
      data: that.data.goods_data,
      token: getStorage('token','')
    }
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/confirm_group_order',
      data: params,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            that.data.activity_info = res.data.data.activity_info
            that.data.goods = res.data.data.goods
            that.data.total_price = res.data.data.total_price
            $digest(that)
            that.setDisabled()
          }  
          else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '确认',
              success(ee) {
                if(ee.confirm){
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '网络错误，请稍后重试！',
            showCancel: false,
            confirmText: '确认',
            success (ee) {
              if (ee.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
    })
  },
  // 创建订单+支付接口
  pay: function () {
    var that = this
    that.data.disabled = true
    $digest(that)
    wx.showLoading({
      title: '',
    })
    let params = {
      token: getStorage('token', ''),
      data: that.data.goods_data,
      parent_id: that.data.pid,
      address_id: that.data.setAddress.id,
      order_desc: that.data.order_tips
    }
    if (that.data.goods.is_auth) {
      params.authentication_id = that.data.setIDcard.id
    }
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/create_group_order',
      data: params,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.code === 1) {
            let payparams = {
              token: getStorage('token', ''),
              order_no: res.data.data.order_no
            }
            wx.request({
              url: app.globalData.urlhost + '/api/store.order/createGoodsParams',
              data: payparams,
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function (res) {
                if (res.data.code == 1) {
                  wx.requestPayment({
                    timeStamp: res.data.data.timeStamp,
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.package,
                    signType: res.data.data.signType,
                    paySign: res.data.data.paySign,
                    success: function (res) {
                      console.log(res)
                      if (res.errMsg == "requestPayment:ok") {
                        wx.redirectTo({
                          url: '/pages/my/my_order/my_order',
                        })
                      }
                    },
                    fail: function (res) {
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showModal({
                          title: '提示',
                          content: '您已取消支付',
                          showCancel: false,
                          confirmText: '确认',
                          success: function (res) {
                            if (res.confirm) {
                              wx.redirectTo({
                                url: '/pages/my/my_order/my_order',
                              })
                            }
                          }
                        })
                      } else {
                        console.log(res)
                        wx.showModal({
                          title: '提示',
                          content: res.errMsg,
                          showCancel: false,
                          confirmText: '确认',
                          success: function (res) {
                            if (res.confirm) {
                              wx.redirectTo({
                                url: '/pages/my/my_order/my_order',
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    confirmText: '确认',
                    success: function (res) {
                      if (res.confirm) {
                        wx.redirectTo({
                          url: '/pages/my/my_order/my_order',
                        })
                      }
                    }
                  })
                }
              },
            })  
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '确认',
              success: function (res) {
                if (res.confirm) {
                  that.setDisabled()
                }
              }
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '网络错误，请稍后重试！',
            showCancel: false,
            confirmText: '确认',
            success: function (res) {
              if (res.confirm) {
                that.setDisabled()
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})