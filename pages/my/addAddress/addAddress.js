var app = getApp();
var wc = require('../../../src/wcache.js');
const {
  isLogin
} = require('../../../utils/handleLogin');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['重庆市', '重庆市', '渝中区'],
    id: "",
    amend_list: [],
    edit_bool: "0"
  },
  submit: function(e) {
    // 登录
    isLogin(() => { })
    var that = this
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var address = e.detail.value.address;
    var store_name = e.detail.value.store_name
    if (that.data.edit_bool == 1) {
      wx.request({
        url: app.globalData.urlhost + '/api/user.address/edit',
        data: {
          token: wc.get('token'),
          id: that.data.amend_list.id,
          store_name,
          username: name,
          phone: phone,
          province: that.data.region[0],
          city: that.data.region[1],
          area: that.data.region[2],
          address: address,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              address: res.data.data
            });
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000,
            })
            if (res.data.msg == "添加收货地址成功") {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 3000)
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000,
            })
          }
        },
      })
    } else {
      wx.request({
        url: app.globalData.urlhost + '/api/user.address/create',
        data: {
          token: wc.get('token'),
          store_name,
          username: name,
          phone: phone,
          province: that.data.region[0],
          city: that.data.region[1],
          area: that.data.region[2],
          address: address,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(res)
          if (res.data.code == 1) {
            that.setData({
              address: res.data.data
            });
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000,
            })
            if (res.data.msg == "添加收货地址成功") {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 3000)
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000,
            })
          }
        },
      })
      console.log("添加")
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this
    if (e.ar_list) {
      var ar_list = JSON.parse(e.ar_list)
      var city_list = [ar_list.province, ar_list.city, ar_list.area]
      that.setData({
        amend_list: ar_list,
        region: city_list,
        edit_bool: 1
      })
    }
  },
  onShow: function() {
    // 登录
    isLogin(() => {})
  },
  // 地区选择
  bindRegionChange: function(e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },

})