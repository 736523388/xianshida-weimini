//index.js
//获取应用实例
const app = getApp()
import {getStorage} from '../../../utils/handleLogin'

Page({
  data: {
    userInfo: null
  },
  formSubmit(e){
    let formData = e.detail.value
    if(formData.store_name == ''){
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'error',
        duration: 1500
      })
      return false
    }
    if(formData.contact_name == ''){
      wx.showToast({
        title: '请输入联系人',
        icon: 'error',
        duration: 1500
      })
      return false
    }
    if(formData.phone == ''){
      wx.showToast({
        title: '请输入联系电话',
        icon: 'error',
        duration: 1500
      })
      return false
    }
    let userInfo = this.data.userInfo
          userInfo.store_name = formData.store_name
          userInfo.contact_name = formData.contact_name
          userInfo.phone = formData.phone
    wx.request({
      url: app.globalData.urlhost + '/api/user.member/set_store_info',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        token: getStorage('token', ''),
        ...formData
      },
      success: res => {
        console.log(res)
        if(res.statusCode === 200 && res.data.code === 1){
          this.setData({
            userInfo
          })
          wx.setStorageSync('userInfo', userInfo)
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      },
      fail: error => {},
      complete: () => {}
    })
    console.log(formData)
  },
  onLoad: function () {
    console.log('登陆授权页')
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
    })
  }
})
