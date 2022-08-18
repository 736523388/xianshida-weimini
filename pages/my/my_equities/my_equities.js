const app = getApp()
const {
  isLogin
} = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '0',
    color: ["#ff9c4e", "#7d4690", "#151515"],
    // 文本域光标字数
    cursor: '',
    equities_msg: [],
    equ_name_list: [],
    equ_img_list: [],
    equ_name: "",
    equ_img: '',
    swiper_height: "",
    level_id: 2,
    check_id:2
  },

  change_current: function(e) {
    var that = this;
    this.setData({
      current: e.detail.current,
      equ_name: this.data.equ_name_list[e.detail.current],
      equ_img: this.data.equ_img_list[e.detail.current]
    })
    var class_n = '.view_h' + e.detail.current
    var query = wx.createSelectorQuery();
    query.select(class_n).boundingClientRect()
    query.exec((res) => {
      var listHeight = res[0].height;
      this.setData({
        swiper_height: listHeight+10,
        
      })

      if (that.data.equities_msg[that.data.current].id != 2){
        this.setData({
          level_id: that.data.equities_msg[that.data.current].id
        })
      }else{
        this.setData({
          level_id: that.data.check_id
        })
      }
    



    })

  },
  radioChange(e) {

    var that = this;
    this.setData({
      level_id: e.detail.value,
      check_id: e.detail.value
    })
  }
  ,
  word_num: function(e) {
    this.setData({
      cursor: e.detail.cursor
    })
  },
  // 购买会员
  pay_member: function() {
    var that = this
    console.log(that);
    wx.request({
      url: app.globalData.urlhost + '/api/user.level/create_order',
      data: {
        token: wc.get('token'),
        level_id: that.data.level_id,
        use_integral: 0
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1 && res.data.data.pay_status == 0) {
          wx.requestPayment({
            timeStamp: res.data.data.params.timeStamp,
            nonceStr: res.data.data.params.nonceStr,
            package: res.data.data.params.package,
            signType: res.data.data.params.signType,
            paySign: res.data.data.params.paySign,
            success: function(res) {
              console.log(res)
            },
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      },
    })
  },
  // 申请升级
  submit: function(e) {
    console.log(e)
    var that = this
    var name = e.detail.value.name
    var phone = e.detail.value.phone
    var address = e.detail.value.address
    var condition = e.detail.value.condition

    // 提交申请等级
    wx.request({
      url: app.globalData.urlhost + '/api/user.level/create_apply',
      data: {
        token: wc.get('token'),
        level_id: that.data.equities_msg[that.data.current].id,
        name: name,
        phone: phone,
        address: address,
        condition: condition,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    var that = this
    if (e.index + 1) {
      that.setData({
        current: e.index,
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
    isLogin(() => {})
    // 可用等级列表
    wx.request({
      url: app.globalData.urlhost + '/api/user.level/available',
      data: {
        token: wc.get('token'),
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        console.log(res.data.data)

        
        
        if (res.data.code == 1) {
          var equ_title = []
          var equ_img = []
          for (var i = 0; i < res.data.data.length; i++) {
            equ_title.push(res.data.data[i].level_title)
            equ_img.push(res.data.data[i].level_image)
          }
          that.setData({
            equities_msg: res.data.data,
            equ_name_list: equ_title,
            equ_name: res.data.data[0].level_title,
            equ_img_list: equ_img,
            equ_img: res.data.data[0].level_image,
            level_id: res.data.data[that.data.current].id
          })
          that.setData({
            equ_name: that.data.equ_name_list[that.data.current],
            equ_img: that.data.equ_img_list[that.data.current]
          })
          setTimeout(function(){
            var class_n = '.view_h' + that.data.current
            var query = wx.createSelectorQuery();
            query.select(class_n).boundingClientRect()
            query.exec((res) => {
              console.log(res)
              var listHeight = res[0].height;
              that.setData({
                swiper_height: listHeight + 10
              })
            })
          },120)
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
    wx.stopPullDownRefresh()
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