const app = getApp();
var wc = require('../../../src/wcache.js');

const { isLogin } = require('../../../utils/handleLogin');

Page({

    /**
     * 页面的初始数据
     */
    data: {

        //用户信息
        userInfo:{},
        identity:0,//身份

        //批发商信息
        wholesalerInfo:{},

        //预览的图片
        imglist:[],

        user_level:0,

        imagesListThree: '', //营业执照,
        imgsPath: '',//营业执照地址

        //营业执照数据
        wholesaler: ['单位名称', '地址', '成立日期', '有效期', '法人', '注册资本', '社会信用代码', '类型', '组成形式', '经营范围', '证件编号'],
        wholesalerData:[]
    },

    //验证营业执照
    uploaderThree: function() {
        var that = this;
        var imgThree = '';
        let imagesList = [];
        let maxSize = 1024 * 1024;
        let maxLength = 3;
        let flag = true;
        wx.chooseImage({
            count: 1, //最多可以选择的图片总数
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var filePaths = res.tempFilePaths[0];

                wx.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 500
                })

                if (res.tempFiles.length > maxLength) {
                    console.log('222');
                    wx.showModal({
                        content: '最多能上传' + maxLength + '张图片',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                console.log('确定');
                            }
                        }
                    })
                }
                if (flag == true && res.tempFiles.length <= maxLength) {
                    that.setData({
                        imagesListThree: res.tempFilePaths
                    })
                }


                let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"); //转为base64
                let url = encodeURIComponent(base64) //微信小程序怎么通过urlencode格式化请求体?在传递端通过encodeURIComponent(url)进行编码

                
                console.log(url)

                wx.showLoading({
                    title: '加载中',
                })

                //上传到服务器验证
                wx.uploadFile({
                    url: app.globalData.urlhost + '/api/user.authentication/yingye',
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    header: {
                        "Content-Type": "multipart/form-data",

                    },
                    formData: {
                        'image': url,
                        'token': wc.get('token'),
                    },
                    success: function(res) {

                        var res = JSON.parse(res.data)
                        console.log('res', res)

                        if (res.code == 0) {
                            wx.showModal({
                                title: '提示',
                                content: res.msg,
                            })
                        } else {
                            wx.hideLoading();

                            that.uplpad(filePaths)

                            var obj = []
                            for (var i = 0; i < that.data.wholesaler.length; i++) {
                                for (var s in res.data) {
                                    console.log()
                                    if (s == that.data.wholesaler[i]) {
                                        obj.push(res.data[s].words)
                                    }
                                }
                            }
                            console.log(obj)
                            that.setData({
                                wholesalerData: obj
                            })

                        }

                    },
                    fail: function(data) {
                        console.log(data);
                    }
                })

                console.log(res);

            },

            fail: function(res) {

                console.log(res);

            }

        })

    },

    //上传营业执照
    uplpad(path){
        var _this = this;

        //上传到服务器
        wx.uploadFile({
            url: app.globalData.urlhost+'/api/base.file/upload',
            filePath: path,
            name: 'file',
            header: {
                "Content-Type": "multipart/form-data",
                'token': wc.get('token'),
            },
            success: function (res) {
                var data = JSON.parse(res.data);
                console.log(JSON.parse(res.data))

                _this.setData({
                    imgsPath: data.data
                })
            },
            fail: function (data) {
                console.log(data);
            }
        })
    },

    //申请成为批发商
    apply(){
        let _this = this;

        if (_this.data.wholesalerData.length==0){
            wx.showModal({
                title: '提示',
                content: '请先上传营业执照',
            })

            return false;
        }

        // if (_this.data.wholesalerData[10]=='无'){
        //     wx.showModal({
        //         title: '提示',
        //         content: '请上传正确的营业执照',
        //     })

        //     return false;
        // }

        let params = {
            token: wc.get('token'),
            img: _this.data.imgsPath,
            title:_this.data.wholesalerData[0],
            name: _this.data.wholesalerData[4],
            address: _this.data.wholesalerData[1],
            validtime: _this.data.wholesalerData[3],
            id_num: _this.data.wholesalerData[10],
            credit_code: _this.data.wholesalerData[6],
        }

        console.log("params", params)

        wx.request({
            url: app.globalData.urlhost + '/api/user.authentication/app_wholesaler',
            
            method: 'POST',
            data: params,
            header: {
                'content-type': 'application/json'
            },
            dataType: 'json',
            success: function (res) {
                    if (res.data.code == 1) {
                        
                        console.log('res', res)
                        // wx.showToast({
                        //     title: res.data.msg,
                        //     duration:3000,
                        //     success:function(){
                        //         wx.navigateBack()
                        //     }
                        // })
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            success: function (res) {
                                if (res.cancel) {
                                    //点击取消,默认隐藏弹框
                                    wx.navigateBack()
                                } else {
                                    //点击确定
                                    wx.navigateBack()
                                }
                            },
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                        })
                    }
            }
        })
    },

    getUserInfo(){
        var _this = this;

        // 个人中心通用信息
        wx.request({
            url: app.globalData.urlhost + '/api/user.member/index',
            data: {
                token: wc.get('token'),
            },
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                console.log(res.data.data.user_level)
                
                if(res.data.code == 0){
                    _this.setData({
                        identity:0
                    })
                }else{

                    _this.setData({
                        userInfo: res.data.data,
                        identity: 1,
                        user_level:res.data.data.user_level
                    })

                    if (res.data.user_level != 0) {
                        _this.getWholesaler();
                    }
                }
                
                
            },
        })
    },

    //获取批发商信息
    getWholesaler(){
        var _this = this;
        var imgs = [];
        wx.request({
            url: app.globalData.urlhost + '/api/user.authentication/wholesaler_info',
            data: {
                token: wc.get('token'),
            },
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
                console.log(res)

                
                imgs.push(res.data.data.img);

                _this.setData({
                    wholesalerInfo: res.data.data,
                    imglist: imgs
                })

            },
        })
    },

    //预览图片
    previewImage: function (e) {
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: this.data.imglist // 需要预览的图片http链接列表  
        })
    }, 


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },



    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        isLogin(() => {
            this.getUserInfo();
        })
        
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