var app = getApp();
import {
  getStorage,
  isLogin
} from '../../../utils/handleLogin'
import {
  $init,
  $digest
} from '../../../utils/common.util'

Page({
  data: {
    current: 1,
    active:1,
    // 左侧菜单
    tabList: [],
    // 右侧内容
    contList: [],
    tabList2:{},
    contList2:{},
    brandList:[]
  },

  // 循环切换
  forTab(index) {
    let _id = 't' + index;
    for (let k in this.data.brandList) {
      this.data.tabList[k].checked = false;
    } 
    this.data.tabList[index].checked = true;
    this.setData({
      toView: _id,
      current: index,
      active: index
    });
  },

  // 点击
  intoTab(e) {
    let _index = e.currentTarget.dataset.index;
    // console.log(_index)
    this.forTab(_index);
    let _id = 't' + _index;
    this.setData({
      toViewRt: _id,
      active: _index
    });
  },

  // 滚动
  scrollRight(e) {
    return false
    let _top = e.detail.scrollTop;
    let progress = parseInt(_top / this.data.ht) + 1; // 计算出 当前的下标
    // console.log(progress)
    if (progress > this.data.current) { // 向上拉动屏幕

      this.setData({ current: progress });
      this.forTab(this.data.current);
      console.log(progress)
    } else if (progress == this.data.current) {
      return false;
    } else { // 向下拉动屏幕

      this.setData({
        current: progress == 0 ? 0 : progress--
      });
      this.forTab(progress);
    }
  },

  onLoad: function (options) {
    // 框架尺寸设置
    wx.getSystemInfo({
      success: (options) => {
        var wd = options.screenWidth; // 页面宽度
        var ht = options.windowHeight; // 页面高度
        this.setData({ wd: wd, ht: ht })
      }
    });
  },

  onShow: function () {
    $init(this)
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    var that=this
    // 初始化状态
    this.setData({
      toView: 't' + this.data.current,
      toViewRt: 't' + this.data.current
    })
    // 获取品牌列表数据
    wx.request({
      url: app.globalData.urlhost +'/api/store.goods_brand/lists',
      success:function(res){
        if(res.statusCode == 200){
          if(res.data.code == 1){
            wx.hideLoading()
            that.data.tabList = []
            that.data.contList = []
            for (let k in res.data.data) {
                that.data.tabList.push({
                  title: k ? k : '#',
                  checked: false
                })
              that.data.contList.push({
                title: k ? k : '#',
                list: res.data.data[k]
              })
            } 
            // console.log(that.data.tabList)
            // console.log(that.data.contList)
            $digest(that)
          }
        }
      }
    })
    
  },
  // 点击 链接
  brandListLink:function(e){
    var id=e.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: 'pages/classify/brandCont/brandCont?id='+id,
    })
  }

})
