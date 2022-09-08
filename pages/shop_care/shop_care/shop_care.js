// page/component/new-pages/cart/cart.js
var wc = require('../../../src/wcache.js');
import { $init, $digest } from '../../../utils/common.util'
const app = getApp()
const {
  isLogin, getStorage
} = require('../../../utils/handleLogin');
var sel_all = []
Page({
  data: {
    // 下标
    selectAttrid: "",
    selectNum: "",
    selectSpec: "",
    // 控制子列表于全选的关系
    carts: [],
    hasList: 1, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认全选
    amount: "", //商品总数量
    startX: '',
    delBtnWidth: 62,
  },
  // ---------------------------当前商品选中事件----------------------------
  selectList: function(e) {
    var index = e.currentTarget.dataset.index;
    var groupind = e.currentTarget.dataset.groupind;
    if (!this.data.carts[groupind].list[index].status){
      return false
    }
    this.data.carts[groupind].list[index].selected = !this.data.carts[groupind].list[index].selected
    let shop_selected = true
    for (let k in this.data.carts[groupind].list) {
      if (this.data.carts[groupind].list[k].status != 0) {
        shop_selected = shop_selected && this.data.carts[groupind].list[k].selected
      }
    }
    this.data.carts[groupind].shop_selected = shop_selected
    let selectAllStatus = true
    for (let k in this.data.carts) {
      for (let j in this.data.carts[k].list) {
        if (this.data.carts[k].list[j].status) {
          selectAllStatus = selectAllStatus && this.data.carts[k].list[j].selected
        }
      }
    }
    this.data.selectAllStatus = selectAllStatus
    $digest(this)
    this.getTotalPrice()
  },
  // --------------------------单个店铺购物车全选-----------------------------
  select_shop_All: function(e) {
    var groupind = e.currentTarget.dataset.groupind
    var goods_status = false
    for (let k in this.data.carts[groupind].list) {
      if (this.data.carts[groupind].list[k].status != 0) {
        goods_status = true
      }
    }
    if (!goods_status){
      return false
    }
    this.data.carts[groupind].shop_selected = !this.data.carts[groupind].shop_selected
    for (let k in this.data.carts[groupind].list){
      if (this.data.carts[groupind].list[k].status != 0){
        this.data.carts[groupind].list[k].selected = this.data.carts[groupind].shop_selected
      }
    }
    
    let selectAllStatus = true
    for (let k in this.data.carts) {
      for (let j in this.data.carts[k].list){
        if (this.data.carts[k].list[j].status){
          selectAllStatus = selectAllStatus && this.data.carts[k].list[j].selected
        }
      }
    }
    this.data.selectAllStatus = selectAllStatus
    $digest(this)
    this.getTotalPrice();
  },
  // ----------------------------购物车全选事件----------------------------
  selectAll: function(e) {
    var isSet = false
    for (let k in this.data.carts) {
      for (let j in this.data.carts[k].list) {
        if (this.data.carts[k].list[j].status){
          isSet = true
        }
      }
    }
    if(!isSet){
      return false
    }
    this.data.selectAllStatus = !this.data.selectAllStatus
    for (let k in this.data.carts){
      let goods_status = false
      for (let j in this.data.carts[k].list){
        if (this.data.carts[k].list[j].status){
          goods_status = true
          this.data.carts[k].list[j].selected = this.data.selectAllStatus
        }
      }
      if (goods_status){
        this.data.carts[k].shop_selected = this.data.selectAllStatus
      }
    }
    $digest(this)
    this.getTotalPrice();
  },
  // ----------------------------删除购物车当前商品---------------------------- 
  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {
        //如果移动距离小于等于0位置不变
        left = "margin-left:0rpx";
      } else if (disX > 0) {
        //移动距离大于0，left值等于手指移动距离
        left = "margin-left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "rpx";
        }
      }
      if (index != "" || index != null) {
        var index = e.currentTarget.dataset.index;
        var groupind = e.currentTarget.dataset.groupind;
        let carts = this.data.carts[groupind].list;
        carts[index].left = left;
        var clist = "carts[" + groupind + "].list";
        this.setData({
          [clist]: carts,
        });
        console.log(carts)
      }
    }
  },
  touchE: function(e) {
    var that = this
    let carts = this.data.carts[0].list;
    var index = e.currentTarget.dataset.index;
    var groupind = e.currentTarget.dataset.groupind;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的，不显示删除按钮
      var left = disX > delBtnWidth ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0rpx";
      if (index != "" || index != null) {
        let carts = this.data.carts[groupind].list;
        carts[index].left = left;
        var clist = "carts[" + groupind + "].list";
        this.setData({
          [clist]: carts,
        });
      }
    }
  },
  // -------------------------------滑动删除结束-------------------------------
  deleteList(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    var index = e.currentTarget.dataset.index;
    var groupind = e.currentTarget.dataset.groupind;
    let carts = that.data.carts[groupind].list;
    wx.showModal({
      title: '确定删除商品',
      showCancel: true,
      cancelText: "取消",
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: function(res) {
        //  点击确定，即删除商品
        if (res.confirm) {
          wx.request({
            url: app.globalData.urlhost + '/api/store.cart/update',
            data: {
              token: wc.get('token'),
              cart_id: that.data.carts[groupind].list[index].id,
              number: 0
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function(res) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
              that.onShow()
            },
          })
        }
      },
    })
  },
  //------------------------------- 绑定加数量事件---------------------------
  addCount(e) {
    var index = e.currentTarget.dataset.index;
    var groupind = e.currentTarget.dataset.groupind;
    let carts = this.data.carts[groupind].list[index];
    let num = carts.number;
    num++;
    carts.number = num;
    let addlist = "carts[" + groupind + "].list[" + index + "]";
    this.setData({
      [addlist]: carts
    });
    wx.request({
      url: app.globalData.urlhost + '/api/store.cart/update',
      data: {
        token: wc.get('token'),
        cart_id: this.data.carts[groupind].list[index].id,
        number: this.data.carts[groupind].list[index].number
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
      },
    })
    this.getTotalPrice();
  },
  // --------------------------------绑定减数量事件----------------------------
  minusCount(e) {
    var index = e.currentTarget.dataset.index;
    var groupind = e.currentTarget.dataset.groupind;
    let carts = this.data.carts[groupind].list[index];
    let num = carts.number;
    if (num > 1) {
      num--;
      carts.number = num;
      let addlist = "carts[" + groupind + "].list[" + index + "]";
      this.setData({
        [addlist]: carts
      });
    };
    wx.request({
      url: app.globalData.urlhost + '/api/store.cart/update',
      data: {
        token: wc.get('token'),
        cart_id: this.data.carts[groupind].list[index].id,
        number: this.data.carts[groupind].list[index].number
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
      },
    })
    this.getTotalPrice();
  },
  // /**
  //  * 计算总价
  //  */
  getTotalPrice() {
    let total = 0;
    var amount = 0;
    var that = this;
    for (let i = 0; i < that.data.carts.length; i++) {
      for (let j = 0; j < that.data.carts[i].list.length; j++) {
        if (that.data.carts[i].list[j].selected) {
          amount += parseInt(that.data.carts[i].list[j].number)
          total += that.data.carts[i].list[j].number * that.data.carts[i].list[j].show_price;
        }
      }
    };
    that.setData({
      amount: amount,
      totalPrice: total.toFixed(2)
    });
  },
  /**
   * // 结算
   */
  topay: function(e) {
    var that = this
    let params = ''
    for(let k in this.data.carts){
       for(let j in this.data.carts[k].list){
         if (this.data.carts[k].list[j].selected){
           if (this.data.carts[k].list[j].number > (this.data.carts[k].list[j].goods_stock - this.data.carts[k].list[j].goods_sale)){
             wx.showToast({
               title: this.data.carts[k].list[j].goods_title + ',' + this.data.carts[k].list[j].goods_spec_alias + '仅剩' + (this.data.carts[k].list[j].goods_stock - this.data.carts[k].list[j].goods_sale) + '件，请调整购买数量！',
               icon: 'none',
               duration: 2000,
             })
             return false
           }
           params += params ? '@@' : ''
           params += this.data.carts[k].list[j].goods_id + '@' + this.data.carts[k].list[j].goods_spec + '@' + this.data.carts[k].list[j].number
         }
       }
    }
    console.log(params)
    if (!params){
      wx.showToast({
        title: '请选择要购买的商品',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/my/confirm_order/confirm_order?key=' + params,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    $init(this)
    // isLogin(() => {
    //   this.load()
    // })
  },
  //加载购物车数据
  load: function () {
    var that = this;
    wx.showLoading()
    this.setData({
      selectAllStatus: false,
    });
    wx.request({
      url: app.globalData.urlhost + '/api/store.cart/lists',
      data: {
        token: wc.get('token')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.code == 1) {
          var carts = res.data.data
          for (let k in carts){
            carts[k].shop_selected = false
            carts[k].shop_sel_list = []
            for (let y in carts[k].list){
              carts[k].list[y].selected = false
              sel_all.push('1')
            }
          }
          console.log(carts)
          that.setData({
            carts: carts,
          })
          if (res.data.data.length == 0) {
            that.setData({
              hasList: 0
            });
          } else {
            that.setData({
              hasList: 1
            });
            that.getTotalPrice();
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000,
          })
        }
      },
    })
  },
  onShow: function() {
    isLogin(() => {
      this.load()
    })
    
  }
})