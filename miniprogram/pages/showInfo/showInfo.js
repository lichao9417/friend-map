// pages/showInfo/showInfo.js
import Dialog from './../../miniprogram_npm/@vant/weapp/dialog/dialog';
let that = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},//mapfriend用户
        myInfo: {}//当前登陆用户信息
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        that = this
        wx.getStorage({
            key: 'storageShowInfo',
            success(res) {
                console.log(res.data)
                that.setData({
                    info: res.data
                },function() {
                    //更改当前页面标题
        wx.setNavigationBarTitle({
            title: that.data.info.name + '的主页'
        })
                })
            }
        })
        
    },
    onChatTa: function() {
        Dialog.confirm({
           // title: '标题',
            message: '希望官放支持微信私聊好友',
        })
    },
    //跨页面获取地图上下文信息失败
    // onRunAPI() {
    //     console.log("dakaimap")
    //     //const mapCtx = wx.createMapContext('friendMap');
    //     const friendMapCtx = {}
    //     //获取map上下文对象
    //     wx.getStorage({
    //         key: 'friedMapCtx',
    //         success (res) {
    //             console.log(res)
    //             friendMapCtx = res.data;
    //             friendMapCtx.openMapApp({
    //                 latitude: this.data.info.location.latitude,
    //                 longitude: this.data.info.location.longitude,
    //                 destination: this.data.info.location.name,

    //                 complete: res => {
    //                     console.log(res);
    //                 }
    //             });
    //         }
    //       })

    // },

    onRunAPI() {
        that = this;
        console.log("11111111111111")
        wx.showLoading({
            title: '拉取APP',
          })
        //获取登陆用户信息
        wx.getStorage({
            key: 'myInfo',

            success(res) {

                wx.hideLoading()
               

                console.log(res.data)
                that.setData({
                    myInfo: res.data
                })
                const friendMapCtx = wx.createMapContext('friendMap');
                friendMapCtx.openMapApp({
                    latitude: that.data.info.location.latitude,
                    longitude: that.data.info.location.longitude,
                    destination: that.data.info.location.name,

                    complete: res => {
                        console.log(res);
                    }
                });
            }
        })


    }


})