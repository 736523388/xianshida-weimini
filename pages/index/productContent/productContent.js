// pages/index/productContent/productContent.js
const app = getApp();
import { isLogin, getStorage } from '../../../utils/handleLogin'
import { wxParse } from '../../../wxParse/wxParse'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hide_price: '',
    hide_price_txt: '',
    show_price: '',
    detail: [],
    aid: 0,
    checkspec: null,
    ReadytobuyStatus: 0,
    // 详情 图片
    img2: '',
    nodes: [],
    // id
    id: true,
    id2: false,
    flage: true,
    // 评价 tab
    true1: true,
    true2: false,
    true3: false,

    // 评价列表
    list: [],
    //购买Tips确认按钮是否可点击
    tipsshowprice: 0,
    tipsshowstock: 0,
    optionIndex: -1,
    optionFlage: false,
    btnFlage: false,
    Num: 1,
    close: false,
    // 分享图片
    imgFlage: false,
    // 商品库存
    stock2: 5,
    // 商品id
    goodsId: 0,
    // 商品规格
    goodsSpec: '',
    // 商品数量
    goodsNumber: 0,
    // 评论页数
    commentPage: 1,
    // 分享海报
    qr_code: "",
    // 评论id
    commentId: 0,
    // 购物车数量
    goodsNum: 0,
    //商品评论
    goodsComment: [],
    goodsCommentCount: [],
    goodsCommentPagesize: 10,
    goodsCommentPage: 1,
    getComment: true,
    goodsCommentType: 0,
    // 评论图片暂存
    imgList: '',
    loginStatus: false,
    // 评论列表显示高度
    commentHeight: "evaluate-list2",
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
    console.log(this.data.aid)
    return {
      title: this.data.detail.goods_title,
      path: 'pages/index/productContent/productContent?id=' + this.data.aid,
      imageUrl: this.data.detail.goods_logo
    }
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (e) {
    this.setData({
      aid: e.id
    })
    // 运行 获取评论函数
    this.comment()
    // 运行 获取购物车数量
    this.goodsNum()
    // 获取商品详情
    this.getCont()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /*获取商品详情*/
  getCont: function () {
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/detail',
      method: 'GET',
      data: {
        id: this.data.aid,
        token: getStorage('token', '')
      },
      success: res => {
        if (res.statusCode !== 200 || res.data.code !== 1) {
          wx.showModal({
            title: '提示',
            content: '网络错误，请稍后再试~',
            success: function (res) {
              if (res.confirm) {//这里是点击了确定以后
                wx.navigateBack()
              }
            }
          })
          return
        }
        let { checkspec, optionFlage } = this.data
        checkspec = res.data.data.data.spec[0]
        optionFlage = (checkspec.goods_stock - checkspec.goods_sale) > 0 ? true : false
        console.log(checkspec)
        let onchecck = ';;' + checkspec.goods_spec + ';;'
        console.log(onchecck)
        res.data.data.data.spec_list.forEach(item => {
          item.value.forEach(values => {
            console.log(';;' + item.name + '::' + values.spec_title + ';;')
            if (onchecck.indexOf(';;' + item.name + '::' + values.spec_title + ';;') > -1){
              values.is_seleted = true
            }
          })
        })
        //循环规格列表
        // res.data.data.data.spec_list.forEach((item) => {
        //   //循环规格可选项
        //   item.value.forEach((values, index) => {
        //     //是否显示
        //     let is_show = false
        //     //是否可选
        //     let is_elective = false

        //     let is_seleted = false
        //     let seleted_spec = ',' + checkspec.goods_spec + ','
        //     is_seleted = seleted_spec.indexOf(',' + item.name + ':' + values + ',') > -1
        //     //循环所有商品规格
        //     res.data.data.data.spec.forEach((speitem, speindex) => {
        //       //如果商品规格中包含此选项
        //       let onchecck = ',' + speitem.goods_spec + ','
        //       if (onchecck.indexOf(',' + item.name + ':' + values + ',') > -1) {
        //         is_show = true
        //         //如果任一商品规格的库存大于销量
        //         if (speitem.goods_stock > speitem.goods_sale) {
        //           is_elective = true
        //         }
        //       }
        //     })
        //     item.value[index] = {}
        //     item.value[index].spec_title = values
        //     item.value[index].is_seleted = is_seleted
        //     item.value[index].is_show = is_show
        //     item.value[index].is_elective = is_elective
        //   })
        // })

        console.log(res.data.data.data.spec_list)
        /*处理商品规格结束*/
        //富文本转换
        wxParse('article', 'html', res.data.data.data.goods_content, this, 5);

        /*商品详情 */
        this.setData({
          checkspec, optionFlage,
          detail: res.data.data.data,
          hide_price: res.data.data.hide_price,
          hide_price_txt: res.data.data.hide_price_txt,
          show_price: res.data.data.show_price,
        })
      },
      fail: error => {

      },
      complete: () => { }
    })
  },
  //选择规格
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
    let optionFlage = true
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
          params.push(item.name + '::' + values.spec_title)
        }
      })
      //如果未全选则设置全选状态为false
      if (is_true === false) {
        optionFlage = false
      }
    })
    console.log(params)
    //处理其他规格
    this.checkspec(check)
    this.setData({
      optionFlage,
      Num: 1,
      detail: this.data.detail
    })
    //查找所选择的规格数据
    if (this.data.optionFlage === true) {
      this.data.detail.spec.forEach((specitem, specindex) => {
        let is_check = true
        params.forEach((checkitem, checkindex) => {
          let onchecck = ';;' + specitem.goods_spec + ';;'
          if (onchecck.indexOf(';;' + checkitem + ';;') == -1) {
            // if (specitem.goods_spec != checkitem) {
            is_check = false
          }
        })
        if (is_check === true) {
          this.setData({
            checkspec: specitem,
            goodsId: specitem.goods_id,
            goodsSpec: specitem.goods_spec
          })
        }
      })
    }
  },
  checkspec: function (i) {
    let { spec_list, spec } = this.data.detail
    this.data.detail.spec_list.forEach((item, index) => {
      if (index !== i) {
        let checkparams = []
        this.data.detail.spec_list.forEach((item2, index2) => {
          if (index2 !== index) {
            item2.value.forEach((childditem, childdindex) => {
              if (childditem.is_seleted === true) {
                checkparams.push(item2.name + '::' + childditem.spec_title)
              }
            })
          }
        })
        //循环可选项
        item.value.forEach((values, key) => {
          let is_elective = false
          let is_show = false
          this.data.detail.spec.forEach((specitem, specindex) => {
            if (specitem.goods_spec.indexOf(item.name + '::' + values.spec_title) > -1) {
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
  },

  // 详情 评价点击
  id1: function () {
    this.setData({
      id: true,
      id2: false
    })
  },
  id2: function () {
    this.setData({
      id: false,
      id2: true
    })
  },
  btn: function () {
    if (this.data.optionFlage) {
      // console.log(this.data.optionFlage)
    }
  },
  // 点击评论tab
  bindGetComment: function (e) {
    if (this.data.goodsCommentType == e.currentTarget.dataset.id) {
      return false
    }
    this.setData({
      goodsCommentType: e.currentTarget.dataset.id,
      goodsComment: [],
      goodsCommentPage: 1,
      getComment: true,
    })
    this.comment()
  },
  // 获取商品评论
  comment: function () {
    if (this.data.getComment === false) {
      return false
    }
    wx.request({
      url: app.globalData.urlhost + '/api/store.goods/goods_comment',
      data: {
        goods_id: this.data.aid,
        page: this.data.goodsCommentPage,
        type: this.data.goodsCommentType
      },
      method: 'GET',
      success: res => {
        console.log('comment', res)
        if (res.statusCode !== 200 || res.data.code !== 1) {
          return
        }
        this.setData({
          goodsComment: this.data.goodsComment.concat(res.data.data.data.comment),
          goodsCommentCount: res.data.data.data.count,
          commentHeight: res.data.data.data.comment.length > 3 ? 'evaluate-list' : 'evaluate-list2',
          goodsCommentPage: this.data.goodsCommentPage + 1,
          getComment: res.data.data.data.comment.length === 10
        })
      }
    })
  },
  // 评论列表里的图片点击
  showImg: function (e) {
    var src = e.currentTarget.dataset.src,
      srcList = e.currentTarget.dataset.father.image;
    wx.previewImage({
      current: src,
      urls: srcList
    })
  },
  // 获取 购物车数量
  goodsNum: function () {
    wx.request({
      url: app.globalData.urlhost + '/api/store.cart/cartnum',
      method: 'GET',
      data: {
        token: getStorage('token', '')
      },
      success: res => {
        if (res.statusCode === 200 && res.data.code === 1) {
          this.setData({
            goodsNum: res.data.data
          })
        }
      }
    })
  },
  // 数量 加 点击
  plus: function () {
    if (this.data.optionFlage === false) {
      return false
    }
    let Stock = this.data.checkspec.goods_stock - this.data.checkspec.goods_sale
    let Quota = 0
    if (this.data.detail.is_quantity === 1) {
      Quota = this.data.detail.quantity_number
    }
    if (Quota === 0) {
      Quota = Stock
    }
    if (this.data.Num === Quota) {
      return false
    }
    this.setData({
      Num: this.data.Num + 1
    })
  },
  // 数量 减 点击
  reduce: function () {
    if (this.data.optionFlage === false) {
      return false
    }
    if (this.data.Num === 1) {
      return false
    }
    this.setData({
      Num: this.data.Num - 1
    })
  },
  // 关闭按钮点击
  close: function () {

    this.setData({
      close: false
    })
  },
  //立即购买或加入购物车
  Readytobuy: function (e) {
    isLogin(() => {
      this.setData({
        ReadytobuyStatus: e.currentTarget.dataset.status,
        alone_pay: e.currentTarget.dataset.status == '2' ? false : true,
        close: true
      })
    })

  },
  //确定购买或者确定加入购物车
  ConfirmOperation: function () {
    var that = this
    isLogin(() => {
      if (this.data.optionFlage === false) {
        return false
      }
      if (this.data.ReadytobuyStatus == '1') {//加入购物车
        this.setData({
          goodsNum: this.data.goodsNum + this.data.Num
        })
        let params = {
          token: getStorage('token', ''),
          goods_id: this.data.aid,
          goods_spec: this.data.checkspec.goods_spec,
          number: this.data.Num
        }
        wx.request({
          url: app.globalData.urlhost + '/api/store.cart/add',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: params,
          dataType: 'json',
          success: res => {
            if (res.statusCode !== 200 || res.data.code !== 1) {
              this.setData({
                goodsNum: this.data.goodsNum - this.data.Num
              })
            }
          },
          fail: () => {
            // console.log(e)
            this.setData({
              goodsNum: this.data.goodsNum - this.data.Num
            })
          }

        })
        wx.showToast({
          title: '成功加入购物车',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          close: false
        })
        console.log('加入购物车' + this.data.aid + '@' + this.data.checkspec.goods_spec + '@' + this.data.Num)
      } else if (this.data.ReadytobuyStatus == '2') {//立即购买
        this.goToBuycreate()
      }
    })
  },
  /**
   * 单独购买
   */
  goToBuycreate() {
    wx.navigateTo({
      url: '/pages/my/confirm_order/confirm_order?key=' + this.data.aid + '@' + this.data.checkspec.goods_spec + '@' + this.data.Num
    })
  },
  // 下载图片
  download: function (e) {
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    var that = this;
    let src = that.data.qr_code;

    // 下载图片
    wx.downloadFile({
      url: src,
      success(res) {
        if (res.statusCode === 200) {
          wx.showLoading({
            title: '已保存图片到相册',
            mask: true,
            success: function (res) {
              wx.hideLoading()
            },
            fail: function (res) { },
            complete: function (res) { },
          })
          //  保存到本地相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath
          })

        }
      }
    })

  },
  //  底部链接跳转
  indexLink: function () {
    wx.switchTab({
      url: '/pages/index/index/index',
    })
  },
  shop: function () {
    wx.switchTab({
      url: '/pages/shop_care/shop_care/shop_care',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  //   onPullDownRefresh: function () {

  //   },

  //   /**
  //    * 页面上拉触底事件的处理函数
  //    */
  //   onReachBottom: function () {

  //   },






})