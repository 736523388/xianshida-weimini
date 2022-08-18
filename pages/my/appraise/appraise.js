// pages/evaluation/evaluation.js
var app = getApp();
var wc = require('../../../src/wcache.js');
const {
  isLogin
} = require('../../../utils/handleLogin');
var photos = [];
var photo_item = {}
var evalute = []
var score = []
var score_arr = []
var images = []
var images_item = []

// 全局中间变量
var img_item = {}
var score_item = {}
var evallution_item = {}
var score_item = {}
Page({
  data: {
    pj_list: [],
    pj_list_length: "",
    goodslist: [],
    orderid: "",
    supplier_id: "",
    tempFilePaths: [], //图片路径
    groupindex: '',
    evalute: [], //评论内容
    goods_score: [], //按顺序产品评分一维数组
    logistics_score: 5,
    service_score: 5,
    noteMaxLen: 300, // 最多放多少字
    info: "",
    noteNowLen: 0, //备注当前字数
    score_arr: [1, 2, 3, 4, 5]
  },
  //  添加照片
  chooseimage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    var goods_id = e.currentTarget.dataset.goods_id
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#121314",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album', goods_id, index)
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera', goods_id, index)
          }
        }
      }
    })
  },
  chooseWxImage: function(type, goods_id, index) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        if (!photo_item[index]) {
          photo_item[index] = []
        }
        if (!images_item[index]) {
          images_item[index] = []
        }
        photo_item[index].push(res.tempFilePaths[0])
        photos[index] = photo_item[index]
        console.log(photo_item)
        console.log(photos)
        that.setData({
          tempFilePaths: photos,
        })
        wx.uploadFile({
          url: app.globalData.urlhost + '/api/base.file/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            token: wx.getStorageSync('token'),
          },
          success: function(res) {
            res = JSON.parse(res.data)
            console.log(res)

            // img_item['goods_id'] = goods_id
            images_item[index].push(res.data)
            img_item[goods_id] = images_item[index]
            images = img_item
            console.log(images)
          },
        })
      }
    })
  },

  // 改变产品评分
  change_goods_score: function(e) {
    var goods_id = e.currentTarget.dataset.goods_id
    var index = e.currentTarget.dataset.index;
    score[index] = e.currentTarget.dataset.score
    this.setData({
      goods_score: score
    })

    //这里可以不定义中间变量 因为onload已经初始化了
    // score_item['goods_id'] = goods_id
    score_item[goods_id] = score[index]
    score_arr = score_item
  },
  //改变商品评论内容
  change_goods_evalution: function(e) {
    var goods_id = e.currentTarget.dataset.goods_id;
    var index = e.currentTarget.dataset.index;
    var text = e.detail.value

    // evallution_item['goods_id'] = goods_id
    evallution_item[goods_id] = text
    evalute = evallution_item
  },
  //改变物流评分
  change_logistics_score: function(e) {
    this.setData({
      logistics_score: e.currentTarget.dataset.score
    })
  },
  //改变服务态度评分
  change_service_score: function(e) {
    this.setData({
      service_score: e.currentTarget.dataset.score
    })
  },
  // 确定按钮提交数据
  publish: function() {
    var that = this
    console.log(JSON.stringify(score_arr))
    console.log(JSON.stringify(evalute))
    console.log(JSON.stringify(images))
    console.log(JSON.stringify(that.data.supplier_id))
    wx.request({
      url: app.globalData.urlhost + '/api/store.order/evalute',
      data: {
        token: wc.get("token"),
        goods_score: JSON.stringify(score_arr),
        evalute: JSON.stringify(evalute),
        goods_pic: JSON.stringify(images),
        logistics_score: that.data.logistics_score,
        service_score: that.data.service_score,
        order_id: that.data.pj_list.id,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this;
    console.log(e)
    if (e.pj_list) {
      var pj_list = JSON.parse(e.pj_list)
      console.log(pj_list)
      that.setData({
        pj_list: pj_list,
        goodslist: pj_list.goods,
        pj_list_length: pj_list.goods.length
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    var that = this;
    // 登录
    isLogin(() => {})
    // 自动默认五星好评
    var goods_num = that.data.goodslist.length
    var _goods_list = that.data.goodslist
    for (var i = 0; i < goods_num; ++i) {

      score[i] = 5
      // score_item['goods_id'] = _goods_list[i].goods_id
      score_item[_goods_list[i].goods_id] = score[i]
      score_arr = score_item
    }
    that.setData({
      goods_score: score,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
})