const app = getApp()
const {
  isLogin
} = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
var WxParse = require("../../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check_bool:"",
    wc_details:[],
    money: "",
    zfb_bool: 0,
    yhk_bool: 1,
    wx_bool: 0,
    zfb_number: "",
    zfb_name: "",
    get_money: "",
    yhk_name: "",
    yhk_number: "",
    yhk_username: "",
    yhk_tel: "",
    yhk_addres: "",
    yhk_dot: "",
  },
  text:function(){
   wx.navigateTo({
     url: '/pages/my/article/article?id=63',
   })
  },
  checkboxChange: function(e) {
    this.setData({
      check_bool: e.detail.value
    })
  },
  zfb_wc: function() {
    this.setData({
      zfb_bool: 1,
      yhk_bool: 0,
      wx_bool: 0,
      get_money: "",
    })
  },
  yhk_wc: function() {
    this.setData({
      zfb_bool: 0,
      yhk_bool: 1,
      wx_bool: 0,
      get_money: "",
    })
  },
  wx_wc: function() {
    this.setData({
      zfb_bool: 0,
      yhk_bool: 0,
      wx_bool: 1,
      get_money: "",
    })
  },
  get_zfb_number: function(e) {
    this.setData({
      zfb_number: e.detail.value
    })
  },
  get_zfb_name: function(e) {
    this.setData({
      zfb_name: e.detail.value
    })
  },
  get_yhk_name: function(e) {
    this.setData({
      yhk_name: e.detail.value
    })
  },
  get_yhk_number: function(e) {
    this.setData({
      yhk_number: e.detail.value
    })
  },
  get_yhk_address: function (e) {
    this.setData({
      yhk_address: e.detail.value
    })
  },
  get_yhk_dot: function (e) {
    this.setData({
      yhk_dot: e.detail.value
    })
  },
  get_yhk_username: function (e) {
    this.setData({
      yhk_username: e.detail.value
    })
  },
  get_yhk_tel: function (e) {
    this.setData({
      yhk_tel: e.detail.value
    })
  },
  get_money: function(e) {
    this.setData({
      get_money: e.detail.value
    })
  },
  get_all:function(){
    this.setData({
      get_money:this.data.money
    })
  },
  submit: function() {
    var that = this
    if (that.data.wc_details.integral_exchange_ratio != 1) {
      wx.showModal({
        title: '提示',
        content: '您现在还不能提现哦',
      })
      return
    }
    if (that.data.get_money== "") {
      wx.showModal({
        title: '提示',
        content: '请输入要提现的积分',
      })
      return
    }
    if (this.data.check_bool != "1") {
      wx.showModal({
        title: '提示',
        content: '请阅读并同意《兼职协议》',
        showCancel: false
      })
      return
    }
    if (that.data.zfb_bool) {
      if (that.data.zfb_number == "") {
        wx.showModal({
          title: '提示',
          content: '请输入支付宝账户',
        })
        return
      }
      if (that.data.zfb_name == "") {
        wx.showModal({
          title: '提示',
          content: '请输入支付宝姓名',
        })
        return
      }
      wx.request({
        url: app.globalData.urlhost + '/api/user.withdraw/create',
        data: {
          token: wc.get('token'),
          integral: that.data.get_money,
          type:"alipay",
          alipay_name: that.data.zfb_name,
          alipay_code: that.data.zfb_number
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 1) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
            })
            if (res.data.msg == "success" || res.data.msg == "提现成功"){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
              },3000)
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 3000,
            })
          }
        },
      })
    }
    if (that.data.yhk_bool) {
     
      if (that.data.yhk_name == "") {
        wx.showModal({
          title: '提示',
          content: '请输入银行卡开户行',
        })
        return
      }
      if (that.data.yhk_number == "") {
        wx.showModal({
          title: '提示',
          content: '请输入银行卡账户',
        })
        return
      }
      if (that.data.yhk_address == "") {
        wx.showModal({
          title: '提示',
          content: '请输入银行卡开户地',
        })
        return
      }
      if (that.data.yhk_dot == "") {
        wx.showModal({
          title: '提示',
          content: '请输入网点',
        })
        return
      }
      if (that.data.yhk_username == "") {
        wx.showModal({
          title: '提示',
          content: '请输入持卡人姓名',
        })
        return
      } 
      if (that.data.yhk_tel == "") {
        wx.showModal({
          title: '提示',
          content: '请输入电话号码',
        })
        return
      }
    
      if (that.data.yhk_tel.length != 11) {
        wx.showModal({
          title: '提示',
          content: '请输入正确的电话号码',
        })
        return
      }
      wx.request({
        url: app.globalData.urlhost + '/api/user.withdraw/create',
        data: {
          token: wc.get('token'),
          integral: that.data.get_money,
          type: "bankcard	",
          bank_name: that.data.yhk_name,
          bank_code: that.data.yhk_number,
          bank_user_name: that.data.yhk_username,
          bank_phone: that.data.yhk_tel,
          bank_address: that.data.yhk_address,
          bank_dot: that.data.yhk_dot,
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 1) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
            })
            if (res.data.msg == "success" || res.data.msg == "提现成功") {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 3000)
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 3000,
            })
          }
        },
      })
    }
    if (that.data.wx_bool) {
      wx.request({
        url: app.globalData.urlhost + '/api/user.withdraw/create',
        data: {
          token: wc.get('token'),
          integral: that.data.get_money,
          type: "wechat	",
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 1) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
            })
            if (res.data.msg == "success" || res.data.msg == "提现成功") {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 3000)
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 3000,
            })
          }
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    // 登录
    isLogin(() => { })
    // 积分提现配置
    wx.request({
      url: app.globalData.urlhost + '/api/user.withdraw/index',
      data: {
        token: wc.get('token'),
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            wc_details: res.data.data,
            money: res.data.data.all_amount
          })
        }
      },
    })
    

    // 提现下方的提示
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/agreement',
      data: {
        id:67
      },
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          WxParse.wxParse('article', 'html', res.data.data, that, 5);
        }
      },
    })
  },

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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})