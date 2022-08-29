const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

import {getStorage, isLogin} from '../../../utils/handleLogin'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: '',
    theme: wx.getSystemInfoSync().theme
  },
  onLoad() {
    wx.onThemeChange(result => {
      this.setData({
        theme: result.theme
      })
    })
    isLogin(() => {
      wx.request({
        url: app.globalData.urlhost + '/api/user.member/index',
        method: 'GET',
        data: {
          token: getStorage('token', '')
        },
        success: res => {
          if(res.statusCode === 200 && res.data.code === 1){
            let avatarUrl = res.data.data.headimg ? res.data.data.headimg : this.data.avatarUrl
            let nickname = res.data.data.nickname
            if(res.data.data.headimg){
              this.setData({
                avatarUrl, nickname
              })
            }
          }
        }
      })
    })

  },
  onChooseAvatar(e) {
    console.log(e.detail)
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    wx.uploadFile({
      filePath: avatarUrl,
      name: 'file',
      url: app.globalData.urlhost + '/api/user.member/set_portrait',
      formData: {
        'token': getStorage('token', '')
      },
      success: res => {}
    })

    
  },
  onChangeNickname(e){
    console.log(e)
    // this.setData({
    //   nickname: e.detail.value
    // })
    // console.log(this.data.nickname)
  },
  onSubmitNickname(e){

    wx.request({
      url: app.globalData.urlhost + '/api/user.member/set_nickname',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        token: getStorage('token', ''),
        nickname: e.detail.value
      },
      success: res => {},
      fail: error => {},
      complete: () => {}
    })
  }
})
