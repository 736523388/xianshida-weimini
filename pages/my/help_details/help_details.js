const app = getApp()
var wc = require('../../../src/wcache.js');
var WxParse = require("../../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    content:[],
    help_title:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    if(e.id){
      this.setData({
        id:e.id,
        help_title: e.help_title
      })
    }
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
    var that = this
    wx.request({
      url: app.globalData.urlhost + '/api/base.system/help_view',
      data: {
        id:that.data.id
      },
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          if (res.data.data == null) {
            console.log(1111111111)
            return
          } else {
            that.setData({
              content:res.data.data
            })
            let result = res.data.data
            var arr1 = []
            for (var i = 0; i < result.length; i++) {
              arr1.push(result[i].content)
            }
            for (let i = 0; i < arr1.length; i++) {
              WxParse.wxParse('reply' + i, 'html', arr1[i], that);
              if (i === arr1.length - 1) {
                WxParse.wxParseTemArray("replyTemArray", 'reply', arr1.length, that)
              }
            }
          }
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