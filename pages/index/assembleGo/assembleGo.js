// pages/index/assembleSuccess/assembleSuccess.js
const app = getApp();
import { $init, $digest } from '../../../utils/common.util'
import { promisify } from '../../../utils/promise.util'
import { isLogin, getStorage } from '../../../utils/handleLogin'
import { wxParse } from '../../../wxParse/wxParse'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    // 倒计时
    timer: false,
    ahour: '00',
    aminute: '00',
    asecond: '00',
    // 猜你喜欢
    list:[],
    groupInfo: {},
    // 当前所选规格
    checkspec: {},
    //规格列表
    detail: [],
    //选择规格确定按钮是否可点击
    optionFlage: false,
    // 规格显示/隐藏
    setClose: false,
    Num: 1,
  },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(res) {
        console.log("this.data.sceneUserId", this.data.sceneUserId)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            console.log('pages/index/productContent/productContent?id=' + this.data.aid + '&sceneUserId=' + this.data.sceneUserId)
        }
        let share_title = this.data.detail.goods_title
        if (this.data.activityKey == 'spike') {
            share_title = '秒杀价' + this.data.detail.activity_info.activity.activity_price + '元，' + share_title
        } else if (this.data.activityKey == 'group') {
            share_title = this.data.detail.activity_info.activity.complete_num + '人拼只需' + this.data.detail.activity_info.activity.activity_price + '元，' + share_title
        }
        return {
            title: share_title,
            path: '',
            imageUrl: this.data.detail.goods_logo
            //pages/index/assembleGo/assembleGo?id=' + this.data.aid + '&sceneUserId=' + this.data.sceneUserId
        }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
    this.getList()
    if (!options.hasOwnProperty('id')) {
      wx.navigateBack({
        delta: 1
      })
    }
    this.data.id = options.id
    $digest(this)
  },
  getList: function () {
    let that = this
    let params = {
      page_size: 6,
      page_now: 1,
      cate_id: 0
    }
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.group/lists',
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            console.log(res)
            that.data.list = res.data.data
            $digest(that)
          }
        }
      }
    })
  },
  load: function (){
    let that = this
    let params = {
      token: getStorage('token',''),
      id: that.data.id
    }
    wx.request({
      // url: 'http://www.xhz.com/api/store.order/group_detail',
      url: app.globalData.urlhost + '/api/store.order/group_detail',
      data: params,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            
            that.data.groupInfo = res.data.data
            $digest(that)
            that.countDown(res.data.data.after_time)
            // if (!res.data.data.is_pay) {
            //   wx.showModal({
            //     title: '提示',
            //     content: '订单尚未付款，是否立即去支付',
            //     showCancel: true,
            //     confirmText: '确认',
            //     success(ee) {
            //       if(res.confirm){
            //         wx.navigateTo({
            //           url: '/pages/my/my_order/my_order',
            //         })
            //       }
            //     }
            //   })
            // }
          }
          else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '确认',
              success(ee) {
                wx.navigateBack()
              }
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '网络错误，请稍后再试！',
            showCancel: false,
            confirmText: '确认',
            success(ee) {
              wx.navigateBack()
            }
          })
        }
      }
    })
  },
  /**
   * 倒计时
   */
  countDown: function (times) {
    let that = this
    let day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值
    day = Math.floor(times / (60 * 60 * 24));
    hour = Math.floor(times / (60 * 60)) - (day * 24);
    minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
    second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    if (day <= 9) day = '0' + day;
    if (hour <= 9) hour = '0' + hour;
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    that.data.aday = day
    that.data.ahour = hour
    that.data.aminute = minute
    that.data.asecond = second
    $digest(that)
    that.data.timer = setInterval(function () {
      times--
      let day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值
      if (times > 0) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        that.data.aday = day
        that.data.ahour = hour
        that.data.aminute = minute
        that.data.asecond = second
        $digest(that)
      } else {
        clearInterval(that.data.timer)
        that.onShow()
      }

    }, 1000)
  },
  /**
   * 关闭按钮点击
   */
  close: function () {
    this.data.setClose = false
    $digest(this)
  }, 
  /**
   * 商品列表点击
   */
  addShow: function (e) {
    isLogin(() => {
      this.getSpec(e)
    })
  },
  /**
   * 获取商品规格
   */
  getSpec: function (e) {
    console.log(e)

    let that = this
    that.data.checkspec = {}
    that.data.optionFlage = false
    that.data.setClose = true
    $digest(that)
    wx.request({
      url: app.globalData.urlhost + '/api/promotion.bargain/goods_sku',
      data: {
        goods_id: that.data.groupInfo.goods_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code === 1) {
            console.log(res.data)
            if (res.data.data.spec_list.length === 0) {
              res.data.data.spec_list = [
                {
                  name: '规格', value: [{
                    spec_title: '默认规格',
                    is_show: true,
                    is_seleted: (res.data.data.spec[0].goods_stock - res.data.data.spec[0].goods_sale) > 0 ? true : false,
                    is_elective: (res.data.data.spec[0].goods_stock - res.data.data.spec[0].goods_sale) > 0 ? true : false,
                  }]
                }
              ]
              that.data.checkspec = res.data.data.spec[0]
              that.data.optionFlage = (res.data.data.spec[0].goods_stock - res.data.data.spec[0].goods_sale) > 0 ? true : false
            } else {
              //循环规格列表
              res.data.data.spec_list.forEach((item) => {
                //循环规格可选项
                item.value.forEach((values, index) => {
                  //是否显示
                  let is_show = false
                  //是否可选
                  let is_elective = false
                  //循环所有商品规格
                  res.data.data.spec.forEach((speitem, speindex) => {
                    //如果商品规格中包含此选项
                    let onchecck = ',' + speitem.goods_spec + ','
                    if (onchecck.indexOf(',' + item.name + ':' + values + ',') > -1) {
                      is_show = true
                      //如果任一商品规格的库存大于销量
                      if (speitem.goods_stock > speitem.goods_sale) {
                        is_elective = true
                      }
                    }
                  })
                  item.value[index] = {}
                  item.value[index].spec_title = values
                  item.value[index].is_seleted = false
                  item.value[index].is_show = is_show
                  item.value[index].is_elective = is_elective
                })
              })
            }
            that.data.detail = res.data.data
            console.log(that.data.detail)
            $digest(that)
          }
          else {
            console.log('获取商品规格失败')
          }
        }
      }
    })
  },

  /**
   * 选择规格
   */
  setSpecSeleted: function (e) {
    //如果点击项已选中 则打断不往下执行
    if (this.data.detail.spec_list[e.currentTarget.dataset.key1].value[e.currentTarget.dataset.key2].is_seleted === true) {
      return false
    }
    //如果点击项不可点击 则打断不往下执行
    if (this.data.detail.spec_list[e.currentTarget.dataset.key1].value[e.currentTarget.dataset.key2].is_elective === false) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    //确认框暂时设为可选
    this.data.optionFlage = true
    //已选规格数组
    let params = []
    //当前点击规格下标
    let check
    //循环规格列表
    this.data.detail.spec_list.forEach((item, index) => {
      //设置规格全选状态
      let is_true = false
      //循环规格可选属性
      item.value.forEach((values, key) => {
        //如果点击属性规格为当前循环规格
        if (e.currentTarget.dataset.key1 === index) {
          //设置所有属性未选中
          values.is_seleted = false
          //如果当前点击属性为当前属性
          if (e.currentTarget.dataset.key2 === key) {
            //设置点击属性选中
            values.is_seleted = true
            //设置当前点击规格下标
            check = index

          }
        }
        if (values.is_seleted === true) {
          is_true = true
          params.push(item.name + ':' + values.spec_title)
        }
      })
      //如果未全选则设置全选状态为false
      if (is_true === false) {
        this.data.optionFlage = false
      }
    })
    $digest(this)

    //处理其他规格
    this.checkspec(check)
    //查找所选择的规格数据
    if (this.data.optionFlage === true) {
      this.data.detail.spec.forEach((specitem, specindex) => {
        let is_check = true
        params.forEach((checkitem, checkindex) => {
          let onchecck = ',' + specitem.goods_spec + ','
          if (onchecck.indexOf(',' + checkitem + ',') == -1) {
            // if (specitem.goods_spec != checkitem) {
            is_check = false
          }
        })
        if (is_check === true) {
          this.data.checkspec = specitem
        }
      })
    }
    $digest(this)
  },
  /**
   * 处理其它规格
   */
  checkspec: function (i) {
    let spec_list = this.data.detail.spec_list
    spec_list.forEach((item, index) => {
      if (index !== i) {
        let checkparams = []
        spec_list.forEach((item2, index2) => {
          if (index2 !== index) {
            item2.value.forEach((childditem, childdindex) => {
              if (childditem.is_seleted === true) {
                checkparams.push(item2.name + ':' + childditem.spec_title)
              }
            })
          }
        })
        //循环可选项
        item.value.forEach((values, key) => {
          let is_elective = false
          let is_show = false
          this.data.detail.spec.forEach((specitem, specindex) => {
            if (specitem.goods_spec.indexOf(item.name + ':' + values.spec_title) > -1) {
              let is_check = true
              checkparams.forEach((checkitem, checkindex) => {
                if (specitem.goods_spec.indexOf(checkitem) > -1) {
                  is_check = false
                }
              })
              if (is_check === true) {
                is_show = true
                if (specitem.goods_stock > specitem.goods_sale) {
                  is_elective = true
                }
              }
            }
            values.is_elective = is_elective
            values.is_show = is_show
          })
        })
      }
    })

    $digest(this)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 规格确定点击
  confirm: function () {
    var that = this
    if (that.data.optionFlage === false) {
      return false
    }
    wx.redirectTo({
      url: '/pages/index/groupOrderCon/groupOrderCon?key=' + this.data.groupInfo.goods_id + '@' + this.data.checkspec.goods_spec + '@' + this.data.Num + '&pid=' + this.data.groupInfo.id,
    })

  },
  // 数量 加 点击
  plus: function () {
    if (this.data.optionFlage === false) {
      return false
    }
    this.data.Num++
    $digest(this)
  },
  // 数量 减 点击
  reduce: function () {
    if (this.data.optionFlage === false) {
      return false
    }
    if (this.data.Num === 1) {
      return false
    }
    this.data.Num--
    $digest(this)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     isLogin(() => {
       this.load()
     })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.timer){
      clearInterval(this.data.timer)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //停止当前页面下拉刷新
    wx.stopPullDownRefresh()
    //onShow
    this.onShow()
  },
})