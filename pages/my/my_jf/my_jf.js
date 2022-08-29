const app = getApp()
const {
  isLogin, getStorage
} = require('../../../utils/handleLogin');

Page({


  data: {
    jf_list: [],
    my_jf: 0,
    integral_total: 0,
    loading: 'more',// more noMore loading
    // loadend
    loadEnd: "我是有底线的~",
    loadError: false,
    loadErrorTxt: '加载失败，点击重试',
  },
  page: 1,
  get_integral_log(ref) {
    console.log('get_integral_log', ref)
    if(this._freshing || ref === 'ref'){
      this.page = 1
      this.setData({
        jf_list: [],
        loadError: false,
        loading: this.data.loading === 'loading' ? 'loading' : 'more'
      })
    } else if(ref !== undefined){
      this.setData({
        loadError: false
      })
    }
    if (this.data.loading !== 'more') {
      return
    }
    this.setData({
      loading: 'loading'
    })
    wx.request({
      url: app.globalData.urlhost + '/api/user.integral_log/index',
      method: 'GET',
      data: {
        token: getStorage('token', ''),
        page: this.page
      },
      success: res => {
        if(res.statusCode !== 200 || res.data.code !== 1){
          return
        }
        this.setData({
          jf_list: res.data.data.data,
          loading: res.data.data.data.length < 20 ? 'noMore' : 'more'
        })
        this.page++
        this._freshing = false
      },
      fail: () => {
        this.setData({
          loading: 'more',
          loadError: true
        })
      },
      complete: () => {
        console.log('complate')
        wx.stopPullDownRefresh()
      }
    })
  },
  onLoad: function(options){
    isLogin(() => {
      this.get_integral_log()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    isLogin(() => {
      console.log('登陆成功')
      this._freshing = true
      this.get_integral_log()
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
    this.get_integral_log()
  },
  onReady: function(){
    wx.request({
      url: app.globalData.urlhost + '/api/user.integral_log/balance',
      method: 'GET',
      data: {token: getStorage('token', '')},
      success: res => {
        if(res.statusCode === 200 && res.data.code === 1){
          this.setData({
            my_jf: res.data.data.integral,
            integral_total: res.data.data.integral_total
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})