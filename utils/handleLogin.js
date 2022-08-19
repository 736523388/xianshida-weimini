module.exports = {
    isLogin: isLogin,
    login: login,
    getStorage: getStorage
}
const app = getApp()
// const baseUrl = "http://xianshida.test.net/api/user.login/";
// const baseUrl = "https://xianshida.test.cqclxsc.com/api/user.login/wx_login";
const successcode = 1;
/**
 * [login 微信登陆]
 * @author Forska 736523388@qq.com
 * @DateTime 2018-11-09T14:21:37+0800
 * @param    {Function}               callback [回调函数]
 * @return   {[type]}                          [description]
 */
function login (callback) {
  wx.showLoading()
  wx.login({
    success: res => {
      console.log(res)
      if (res.code) {
        // 登录成功，获取用户信息
        let parent_id = 0
        if (wx.getStorageSync('sceneUserId')){
          parent_id = wx.getStorageSync('sceneUserId')
        }
        let data = {
          code: res.code,
          parent_id: parent_id
        }
        wx.request({
            url: app.globalData.urlhost + '/api/user.login/save',
            data: data,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
              wx.hideLoading()
              if(res.statusCode === 200 && res.data.code === successcode){
                  setStorage('token',res.data.data.token,res.data.data.exp)
                  setStorage('is_insider',res.data.data.token,res.data.data.exp)
                  callback && callback()
              }else{
                  showToast()
              }
            },
            fail () {
              wx.hideLoading()
              showToast()
            }
          })
      } else {
        wx.hideLoading()
        showToast()
      }
    },
    fail () {
      wx.hideLoading()
      showToast()
    }
  })
}
/**
 * [getUserInfo 获取用户信息]
 * @author Forska 736523388@qq.com
 * @DateTime 2018-11-09T14:22:04+0800
 * @param    {[type]}                 code     [description]
 * @param    {Function}               callback [description]
 * @return   {[type]}                          [description]
 */
function getUserInfo (code, callback) {
  wx.getUserInfo({
    // 获取成功，全局存储用户信息，开发者服务器登录
    success (res) {
      postLogin(code, res.iv, res.encryptedData, callback)
    },
    // 获取失败，弹窗提示一键登录
    fail () {
      wx.hideLoading()
      // 获取用户信息失败，清楚全局存储的登录状态，弹窗提示一键登录
      // 使用token管理登录态的，清楚存储全局的token
      // 使用cookie管理登录态的，可以清楚全局登录状态管理的变量
      //wx.setStorageSync('token','')
      // 获取不到用户信息，说明用户没有授权或者取消授权。弹窗提示一键登录，后续会讲
      showLoginModal()
    }
  })
}

/**
 * [postLogin 开发者服务端登录]
 * @author Forska 736523388@qq.com
 * @DateTime 2018-11-09T14:28:28+0800
 * @param    {[type]}                 code          [description]
 * @param    {[type]}                 iv            [description]
 * @param    {[type]}                 encryptedData [description]
 * @param    {Function}               callback      [description]
 * @return   {[type]}                               [description]
 */
function postLogin (code, iv, encryptedData, callback) {
  var parent_id = 0
  if (wx.getStorageSync('sceneUserId')){
    parent_id = wx.getStorageSync('sceneUserId')
  }
  let params = {
    code: code,
    iv: iv,
    encryptedData: encryptedData,
    parent_id:parent_id
  }
  wx.request({
      url: baseUrl,
      data: params,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.statusCode === 200 && res.data.code === successcode){
            wx.hideLoading()
            setStorage('token',res.data.data.token,res.data.data.exp)
            setStorage('is_insider',res.data.data.token,res.data.data.exp)
            callback && callback()
        }else{
            showToast()
        }
      },
      fail () {
        showToast()
      }
    })
}

// 显示toast弹窗
function showToast (content = '登录失败，请稍后再试') {
  wx.showToast({
    title: content,
    icon: 'none'
  })
}
/**
 * [isLogin 判断是否登录]
 * @author Forska 736523388@qq.com
 * @DateTime 2018-11-09T14:28:14+0800
 * @param    {Function}               callback [description]
 * @return   {Boolean}                         [description]
 */
function isLogin (callback) {
    let token = getStorage('token','');
    if (token) {
        // 如果有全局存储的登录态，暂时认为他是登录状态
        callback && callback()
    } else {
        // 如果没有登录态，弹窗提示一键登录
        login(callback)
    }
}
/**
 * [showLoginModal 显示一键登录的弹窗]
 * @author Forska 736523388@qq.com
 * @DateTime 2018-11-09T14:27:48+0800
 * @return   {[type]} [description]
 */
function showLoginModal () {
  wx.showModal({
    title: '提示',
    content: '你还未登录，登录后可获得完整体验 ',
    confirmText: '一键登录',
    success (res) {
      // 点击一键登录，去授权页面
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/my/login/index',
        })
      }
    }
  })
}
/**
 * [put 设置缓存]
 * @author Forska 736523388@qq.com
 * @DateTime 2018-11-09T10:59:56+0800
 * @param    {[type]}                 key  [缓存名称]
 * @param    {[type]}                 val  [缓存值]
 * @param    {[type]}                 time [有效期 单位：秒]
 * @return   {[type]}                      [description]
 */
function setStorage(key, val, time) {

    wx.setStorageSync(key, val)

    var seconds = parseInt(time);

    if (seconds > 0) {

        var timestamp = Date.parse(new Date());

        timestamp = timestamp / 1000 + seconds;

        wx.setStorageSync(key + 'dtime', timestamp + "")

    } else {

        wx.removeStorageSync(key + 'dtime')

    }

}
/**
 * [get 读取缓存]
 * @author Forska 736523388@qq.com
 * @DateTime 2018-11-09T11:00:53+0800
 * @param    {[type]}                 key [缓存名称]
 * @param    {[type]}                 def [默认值]
 * @return   {[type]}                     [description]
 */
function getStorage(key, def) {

    var deadtime = parseInt(wx.getStorageSync(key+ 'dtime'))

    if (deadtime) {

      if (parseInt(deadtime) < Date.parse(new Date()) /1000) {

          if (def) { 
              return def;
          }else { 
              return; 
          }

      }

    }

    var res = wx.getStorageSync(key);

    if (res) {

        return res;

    } else {

        return def;

    }

}