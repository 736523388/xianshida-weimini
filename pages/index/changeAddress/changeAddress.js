// pages/mine_address/mine_address.js
var app = getApp();
var wc = require('../../../src/wcache.js');
const { isLogin } = require('../../../utils/handleLogin');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bool: 1,
    address: []
  },
  skip_newaddress: function () {
    wx.navigateTo({
      url: '/pages/my/addAddress/addAddress',
    })
  },
  changedefault: function (e) {
    var num = e.target.dataset.current;
    if (this.data.default == num) {
      return 1
    } else {
      this.setData({
        default: num
      })
    }
  },
  skip: function () {
    wx.navigateTo({
      url: "/pages/new_address/new_address"
    })
  },
  // 设置为默认地址
  setdefault: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this
    wx.request({
      url: app.globalData.urlhost + '/api/user.address/todefault',
      data: {
        token: wc.get('token'),
        id: e.currentTarget.dataset.addressid,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 1) {
          that.onShow()
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 3000,
        })
      },
    })
  },
  changeSet: function (e){
    console.log(e)
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let that = this
    prevPage.setData({
      setAddress: that.data.address[e.currentTarget.dataset.index],
      setAddressFalg: true
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  // 修改收货地址
  redact: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var ar_list = JSON.stringify(that.data.address[index])
    wx.navigateTo({
      url: '/pages/my/addAddress/addAddress?ar_list=' + ar_list,
    })
  },
  // 删除收货地址
  deleteaddress: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '确定删除该收货地址？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.urlhost + '/api/user.address/delete',
            data: {
              token: wc.get('token'),
              id: e.currentTarget.dataset.addressid,
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              if (res.data.code == 1) {
                that.onShow()
              }
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000,
              })
            },
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    // 登录
    isLogin(() => { })
    wx.request({
      url: app.globalData.urlhost + '/api/user.address/index',
      data: {
        token: wc.get('token')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (that.data.address == null) {
          that.setData({
            bool: 0
          })
        } else {
          that.setData({
            bool: 1
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
      success: function (res) {
        console.log(res)
        that.setData({
          address: res.data.data
        });
        if (that.data.address == null) {
          that.setData({
            address_bool: 0
          })
        } else {
          that.setData({
            address_bool: 1
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

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

  }
})