const app = getApp()
const {
  isLogin
} = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
var photos = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sr_msg: [],
    cause_list: [],
    cause: "",
    order_num: "",
    is_back_goods: "",
    address: [],
    tempFilePaths: [], //图片路径
    explain:"",
    order_id: "",
    money_return: "",
    jf_return: ""
  },
  change_cause: function(e) {
    this.setData({
      cause: this.data.cause_list[e.detail.value]
    })
  },
  //  添加照片,最多只能添加5张
  chooseimage: function(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#121314",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function(type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        var path = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.globalData.urlhost + '/api/base.file/upload',
          filePath: path,
          name: 'file',
          formData: {
            token: wx.getStorageSync('token'),
          },
          success: function(res) {
            res = JSON.parse(res.data)
            photos.push(res.data)
            that.setData({
              tempFilePaths: photos,
            })
          },
        })
      }
    })
  },

  get_explain:function(e){
  this.setData({
    explain:e.detail.value
  })
  },

  submit:function(){
    var that = this
    var images = that.data.tempFilePaths.join("|")
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/back_order',
      data: {
        token: wc.get('token'),
        order_no: that.data.order_num,
        is_back_goods:0,
        remark: that.data.explain,
        reason: that.data.cause,
        images: images
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title:res.data.msg,
          icon: 'none',
          duration:3000,
          success:function(){
              wx.navigateTo({
                  url: '../refund_money_list/refund_money_list',
              })
          }
        })

      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    if (e.order_num) {
      this.setData({
        order_num: e.order_num,
        is_back_goods: e.is_back_goods,
        order_id: e.order_id
      })
    }
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
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/back_order_info',
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
            sr_msg: res.data.data,
            cause_list: res.data.data.back_order_reason,
            address: res.data.data.back_order_info,
          })
        }
      },
    })
    // 获取退款金额
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/detail',
      data: {
        token: wc.get('token'),
        order_id: that.data.order_id
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            money_return: res.data.data.pay_price,
            jf_return: res.data.data.use_integral
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
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