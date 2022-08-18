//获取应用实例
var app = getApp()
var wc = require('../../../src/wcache.js');
const { isLogin } = require('../../../utils/handleLogin');
Page({
  data: {
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 60,
    current: 1,
    defaultbool: true,
    selectid: "",
    mobile: "",
    code: ""
  },

  usermobile: function(e) {
    this.setData({
      mobile: e.detail.value,
      disabled: false
    })
  },
  //  短信
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    // 短信接口
    if (that.data.mobile) {
      wx.request({
        url: app.globalData.urlhost + '/api/base.system/send_msg_code',
        data: {
          mobile: that.data.mobile
        },
        header: {
          "content-type": "application/json"
        },
        method: 'GET',
        success: function(res) {
          if (res.data.code == 1 || res.data.msg == "发送成功"){
            var interval = setInterval(function () {
              currentTime--;
              that.setData({
                time: currentTime + '秒'
              })
              if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                  time: '重新发送',
                  currentTime: 60,
                  disabled: false
                })
              }
            }, 1000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
      })
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getVerificationCode() {
    var that = this
    this.getCode();
    that.setData({
      disabled: true
    })
  },
  //// 获取表单信息并发送到接口  当输入为空空时，提示输入内容
  bindSave: function(e) {
    var that = this;
    console.log(e)
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;
    wx.request({
      url: app.globalData.urlhost + '/api/user.member/bind_mobile',
      data: {
        token: wc.get("token"),
        mobile: mobile,
        code: code,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          wx.showModal({
            title: '绑定成功',
            content: '是否返回上一页',
            success: function(res) {
              console.log(res)
              if(res.confirm){
                wx.navigateBack({
                  delta: 1,
                })
              }
            },
          })
        }
      },
    })
  },
  onLoad: function() {
    var that = this
  
  },
  onShow:function(){
    // 登录
    isLogin(() => { })
  }
})