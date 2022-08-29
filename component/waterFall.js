// component/waterFall.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    pureDataPattern: /^dataFall$/
  },
  properties: {
    dataFall: {
      type: Array,
      default: () => {
        return []
      }
    },
    page: {
      type: Number,
      value: 1,
      observer: function(newVal, oldVal){
        console.log(newVal, oldVal)
        if(newVal === 1 && oldVal !== 1){
          this.setData({
            // imgList: [],
            leftfall: [],
            rightfall: []
          })
          wx.nextTick(() => {
            // 数据改变以后首次执行瀑布流代码
            this.waterfall()
            // 更改加载瀑布流的状态
            this.setData({
              fallStatus: false
            })
          })
        }
      }
    }
  },
  observers: {
    dataFall: function(newVal, oldVal) {
      this.setData({
        imgList: newVal
      })
      if (this.data.imgList.length !== 0) {
        wx.nextTick(() => {
          // 数据改变以后首次执行瀑布流代码
          this.waterfall()
          // 更改加载瀑布流的状态
          this.setData({
            fallStatus: false
          })
        })
      }
    }
  },

  ready() {
    console.log('ready', this.data.leftfall) // 此处会发现输出 behavior 而不是 component
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgList: [],          //  从父组件获取到的瀑布流总数据
    fallStatus: false,    //  瀑布流加载的状态
    leftfall: [],         //  瀑布流左列容器的数据组
    rightfall: [],        //  瀑布流右列容器的数据组
  },

  /**
   * 组件的方法列表
   */
  methods: {
		waterfall(event) {
      let left_hei = ''
      let right_hei = ''
      let that = this
      const query = wx.createSelectorQuery().in(this);
      query.selectAll('#leftfall,#rightfall').boundingClientRect(function (res) {
        left_hei = res[0].height        // 获取左列容器的高度
        right_hei = res[1].height      // 获取右列容器的高度
        // 获取左右两列容器高度后对比两边容器高度插入数据
        inserImg();
      }).exec();
      
      function inserImg() {
        if (that.data.imgList.length != 0) {
          if (left_hei === right_hei) {
            that.data.leftfall.push(that.data.imgList[0])
            that.setData({
              leftfall: that.data.leftfall
            })
          } else if (left_hei > right_hei) {
            that.data.rightfall.push(that.data.imgList[0])
            that.setData({
              rightfall: that.data.rightfall
            })
          } else if (left_hei < right_hei) {
            that.data.leftfall.push(that.data.imgList[0])
            that.setData({
              leftfall: that.data.leftfall
            })  
          }
          // 插入数据后，从总数据里删除已插入的数据
          that.setData({
            imgList: that.data.imgList.slice(1)
          })
        } else {
          // 瀑布流加载结束向父组件传递信息，可进行上拉加载操作，获取分页数据
          that.triggerEvent('waterFallResh', { loaded: true })
          that.setData({
            fallStatus: true
          })
        }
      }
    }  
  }
})
