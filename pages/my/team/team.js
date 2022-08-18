//index.js
//获取应用实例
const app = getApp()
const { isLogin } = require('../../../utils/handleLogin');
var wc = require('../../../src/wcache.js');
Page({
  data: {
    item:[
      { name:'联合创始人',num:"20"},
      { name: '合伙人', num: "20" },
      { name: '会员', num: "20" },
      { name: '普通用户', num: "20" },
    ],
    item_details:[
      { id: '123456', num: "20" ,money:'3215.66' ,day:"20"},
      { id: '123456', num: "20", money: '3215.66', day: "20" },
      { id: '123456', num: "20", money: '3215.66', day: "20" },
      { id: '123456', num: "20", money: '3215.66', day: "20" },
    ],
    current:'0',
    top_msg:[],
    team:[]
  },
  change_color:function(e){
   this.setData({
     current:e.currentTarget.dataset.index
   })
  },
  onLoad: function (e) {
   console.log(e)
   if(e.tm){
     console.log(e.tm)
     var tm = JSON.parse(e.tm)
     this.setData({
       top_msg:tm  
     })
   }
  },
  onShow() {
    isLogin(() => {})
    var that= this
    wx.request({
      url: app.globalData.urlhost + '/api/user.teams/index',
      data: {
        token:wc.get('token'),
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.setData({
            team: res.data.data,
          })
        }
      },
    })
  },
})
