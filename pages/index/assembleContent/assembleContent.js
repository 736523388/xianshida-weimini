// pages/index/productContent/productContent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // banner
    banner:[
      "https://cdn.xhzsm.com/productContent-ban.png",
      "https://cdn.xhzsm.com/productContent-ban.png",
      "https://cdn.xhzsm.com/productContent-ban.png",
      "https://cdn.xhzsm.com/productContent-ban.png"
    ],
    // 正在拼团
    lPrice1:360,
    lPrice2: 460,
    rNum: 103,
    aCont:[
      { text:"1辽宁的安**优拼团成功"},
      { text: "2辽宁的安**优拼团成功" },
      { text: "4辽宁的安**优拼团成功" }
    ],
    // 倒计时
    ahour: 0,
    aminute: 0,
    asecond: 0,
    hourNum: "2018-12-24 24:00:00",
    // 文字  服务 图标
    service2:[
      {
        img:"/images/productContent-icon4.png",
        text: "海外直供"
      },
      {
        img: "/images/productContent-icon5.png",
        text: "海外清关"
      },
      {
        img: "/images/productContent-icon6.png",
        text: "品质保证"
      }
    ],
    // 相关推荐
    cont:[
      {
        img:"/images/productContent-img8.png",
        title:"法国 保湿不易掉色口红",
        text:"迪奥(Dior) 烈焰蓝金哑光唇膏口红 3.5g #999",
        price1:460,
        price3:288.00
      },
      {
        img: "/images/productContent-img8.png",
        title: "法国 保湿不易掉色口红",
        text: "迪奥(Dior) 烈焰蓝金哑光唇膏口红 3.5g #999",
        price1: 460,
        price3: 288.00
      }
    ],
    // 详情 图片
    img:[
      "/images/productContent-img1.png",
      "/images/productContent-img2.png",
      "/images/productContent-img3.png",
      "/images/productContent-img4.png",
      "/images/productContent-img5.png",
      "/images/productContent-img6.png",
      "/images/productContent-img7.png"
    ],
    // id
    id:true,
    id2: false,
    flage: true,
    // 评价 tab
    true1:true,
    true2: false,
    true3: false,
    // 评价列表
    list:[
      {
        head: "/images/productContent-nick.png",
        nickName:"大150****8528",
        date:"2018-05-22",
        text: "终于收到我需要的宝贝了，东西很好，价美物廉，谢谢掌柜的！说实在，这是我购物来                最满意的一次购物。无论是掌柜的态度",
        imgs:[
          "/images/productContent-img9.png",
          "/images/productContent-img9.png",
          "/images/productContent-img9.png",
          "/images/productContent-img9.png",
          "/images/productContent-img9.png",
          "/images/productContent-img9.png"
        ]
                
      },
      {
        head: "/images/productContent-nick.png",
        nickName: "大150****8528",
        date: "2018-05-22",
        text: "终于收到我需要的宝贝了，东西很好，价美物廉，谢谢掌柜的！说实在，这是我购物来                最满意的一次购物。无论是掌柜的态度",
        imgs: [
          "/images/productContent-img9.png",
          "/images/productContent-img9.png"
        ]

      }
    ],
    // 规格选项
    option:[
      { text: "1支装1支装1支装" },
      { text: "1支装1支装1支装" },
      { text: "1支装" },
      { text: "1支装" },
      { text: "1支装1支装" },
      { text: "1支装1支装" },
      { text: "1支装1支装1支装" },
      { text: "1支装1支装1支装" }
      
    ],
    optionFlage:true,
    optionIndex:-1,
    optionFlage:false,
    btnFlage:false,
    Num:1,
    close:false,
    // 分享弹出层
    shareFlage:false,
    // 分享图片
    imgFlage:false,
  },
  // 文字滚动
  util: function (obj) {
    var continueTime = (parseInt(obj.list / obj.container) + 1) * 1500;
    var setIntervalTime = 300 + continueTime;

    var animation = wx.createAnimation({
      duration: 1000,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });
    this.animation = animation;
    animation.translateY(obj.container).step({ duration: 300, timingFunction: 'step-start' }).translateY(-obj.list).step({ duration: continueTime });
    this.setData({
      animationData: animation.export()
    })
    setInterval(() => {
      animation.translateY(obj.container).step({ duration: 300, timingFunction: 'step-start' }).translateY(-obj.list).step({ duration: continueTime });
      this.setData({
        animationData: animation.export()
      })
    }, setIntervalTime)
  },
  getHeight() {
    var obj = new Object();
    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('.aCont-lack1').boundingClientRect()
    query.select('.lack1-move').boundingClientRect()
    query.exec((res) => {
      obj.container = res[0].height; // 框的height
      obj.list = res[1].height; // list的height
      this.util(obj);
    })
  },
  // 倒计时
  countTime: function () {
    //获取当前时间
    var date = new Date();
    var now = date.getTime();
    //设置截止时间
    var endNum = this.data.hourNum;
    var endDate = new Date(endNum);
    var end = endDate.getTime();
    //时间差
    var leftTime = end - now;
    //定义变量 h,m,s保存倒计时的时间
    var h, m, s;
    if (leftTime >= 0) {
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
    }
    //递归每秒调用countTime方法，显示动态时间效果
    setTimeout(() => {
      this.countTime();
      if (h < 10) {
        h = "0" + h;
        this.setData({
          ahour: h,
        })
      } else {
        this.setData({
          ahour: h,
        })
      }
      if (m < 10) {
        m = "0" + m
        this.setData({
          aminute: m,
        })
      } else {
        this.setData({
          aminute: m,
        })
      }
      if (s < 10) {
        s = "0" + s;
        this.setData({
          asecond: s,
        })
      } else {
        this.setData({
          asecond: s,
        })
      }

    }, 1000)
  },
  // 详情 评价点击
  id1:function(){
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
  // 评价 tab点击
  true1: function(){
    this.setData({
      true1: true,
      true2: false,
      true3: false,
    })
  },
  true2: function () {
    this.setData({
      true1: false,
      true2: true,
      true3: false,
    })
  },
  true3: function () {
    this.setData({
      true1: false,
      true2: false,
      true3: true,
    })
  },
  // 规格选项点击
  option:function(e){
    var that=this,
        index=e.currentTarget.dataset.index;
        this.setData({
          optionIndex:index,
          optionFlage:true
        })
  },
  btn:function(){
    if (this.data.optionFlage){
      console.log(this.data.optionFlage)
    }
  },
  // 数量 加 点击
  plus:function(){
    var num = (this.data.Num)+1;
    this.setData({
      Num: num 
    })
    
  },
  // 数量 减 点击
  reduce:function(){
    var reduce = this.data.Num;
    if (reduce<=1){
      this.setData({
        Num: 1
      })
    }else{
      this.setData({
        Num: this.data.Num-1
      })
    }
  },
  // 关闭按钮点击
  close:function(){
    this.setData({
      close:false
    })
  },
  // 加入购物车  立即购买 点击
  blockFn:function(){
    this.setData({
      close: true,
    })
  },
  block1:function(){
    this.blockFn();
  },
  block2: function () {
    this.blockFn();
  },
  // 分享图标点击
  shareShow:function(){
    this.setData({
      shareFlage: true
    })
  },
  // 分享弹出层关闭按钮点击
  shareHide: function () {
    this.setData({
      shareFlage: false
    })
  },
  // 分享二维码点击
  imgShare:function(){
    this.setData({
      imgFlage: true,
      shareFlage: false
    })
  },
  // 关闭分享图片
  imgHide:function(){
    this.setData({
      imgFlage: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 倒计时
    this.countTime();
    // 文字滚动
    this.getHeight();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})