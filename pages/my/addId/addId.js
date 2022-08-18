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
    idImg1: 'https://cdn.xhzsm.com/addId-img3.png',
    idImg2: 'https://cdn.xhzsm.com/addId-img3.png',
    id_list: [],
    amend_bool: "0",
    username:"",
    id_card_num:""
  },
  // 上传身份证照片
  chooseimage1: function(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#121314",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage1('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage1('camera')
          }
        }
      }
    })
  },
  chooseWxImage1: function(type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        wx.showLoading({
          title: '加载中',
        })
        var path = res.tempFilePaths[0];
        var base64 = wx.getFileSystemManager().readFileSync(path, "base64")
        wx.request({
          url: app.globalData.urlhost + '/api/user.authentication/imgOcr',
          data: {
            token: wc.get("token"),
            image: 'data:image/jpeg;base64,' + base64,
            idCardSide: "front"
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            if (res.data.code == 1) {
              that.setData({
                username: res.data.data.name,
                id_card_num: res.data.data.code
              })
              if (!res.data.data.code || !res.data.data.name) {
                wx.showModal({
                  title: '提示',
                  content: '未识别到可用信息，请重新上传',
                })
              } else {
                wx.uploadFile({
                  url: app.globalData.urlhost + '/api/base.file/upload',
                  filePath: path,
                  name: 'file',
                  formData: {
                    token: wx.getStorageSync('token'),
                  },
                  success: function (res) {
                    res = JSON.parse(res.data)
                    console.log(res)
                    that.setData({
                      idImg1: res.data,
                    })
                  },
                })
              }
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration:3000,
              })
            }
          },
          complete: function (res) {
            wx.hideLoading()
          },
        })
      },
    })
  },
  chooseimage2: function(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#121314",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage2('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage2('camera')
          }
        }
      }
    })
  },
  chooseWxImage2: function(type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        wx.showLoading({
          title: '加载中',
        })
        var path = res.tempFilePaths[0];
        var base64 = wx.getFileSystemManager().readFileSync(path, "base64")
        wx.request({
          url: app.globalData.urlhost + '/api/user.authentication/imgOcr',
          data: {
            token: wc.get("token"),
            image: 'data:image/jpeg;base64,' + base64,
            idCardSide: "back"
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            if(res.data.code == 1){
              wx.uploadFile({
                url: app.globalData.urlhost + '/api/base.file/upload',
                filePath: path,
                name: 'file',
                formData: {
                  token: wx.getStorageSync('token'),
                },
                success: function (res) {
                  res = JSON.parse(res.data)
                  that.setData({
                    idImg2: res.data,
                  })
                },
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000,
              })
            }
          },
          complete: function (res) {
            wx.hideLoading()
          },
        })
      },
    })
  },
  submit: function(e) {
    var that = this
    console.log(e)
    that.setData({
      username:e.detail.value.username,
      id_card_num: e.detail.value.id_card,
    })
    if (that.data.idImg1 =="https://cdn.xhzsm.com/addId-img3.png"){
      that.setData({
        idImg1:"",
      })
    }
    if (that.data.idImg2 == "https://cdn.xhzsm.com/addId-img3.png") {
      that.setData({
        idImg2:""
      })
    }
    if (that.data.amend_bool == 1) {
      wx.request({
        url: app.globalData.urlhost + '/api/user.authentication/edit',
        data: {
          token: wc.get('token'),
          id: that.data.id_list.id,
          username: that.data.username,
          id_card: that.data.id_card_num,
          image_front: that.data.idImg1,
          image_other: that.data.idImg2
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 3000,
          })
          that.setData({
            idImg1: 'https://cdn.xhzsm.com/addId-img3.png',
            idImg2: 'https://cdn.xhzsm.com/addId-img3.png',
          })
          if (res.data.msg == "修改实名认证成功") {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 3000)
          }
        },
      })
    } else {
      wx.request({
        url: app.globalData.urlhost + '/api/user.authentication/create',
        data: {
          token: wc.get('token'),
          username: that.data.username,
          id_card: that.data.id_card_num,
          image_front: that.data.idImg1,
          image_other: that.data.idImg2
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 3000,
          })
          that.setData({
            idImg1: 'https://cdn.xhzsm.com/addId-img3.png',
            idImg2: 'https://cdn.xhzsm.com/addId-img3.png',
          })
          if (res.data.msg == "添加实名认证成功") {
            setTimeout(function() {
              wx.navigateBack({
                delta: 1,
              })
            }, 3000)
          }
        },
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this
    if (e.id_list) {
      var id_list = JSON.parse(e.id_list)
      console.log(id_list)
      that.setData({
        username: id_list.username,
        id_card_num: id_list.id_card,
        idImg1: id_list.image_front,
        idImg2: id_list.image_other,
        id_list:id_list,
        amend_bool: 1,
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
    // 验证登录
    isLogin(() => {})
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