// pages/findFriends/findFriends.js
//import { areaList } from '@vant/area-data';
let that = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //areaList,
        region: ['全部', '全部', '全部'],
        customItem: '全部',
        empty: false
    },
    bindRegionChange: function (e) {
        that = this;
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
        wx.showLoading({
            title: '正在查找',
          })
        wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'friendMap_findFriends',
            data: {
                province: that.data.region[0],
                city: that.data.region[1],
                area: that.data.region[2]

            }
        }).then(res => {
            wx.hideLoading();
            console.log(res)
            that.setData({
                friendList: res.result.data,
                empty: false
            })
            if(res.result.data.length === 0) {
                that.setData({
                    empty: true
                })
            }

        }).catch(err => {
            // handle error
            console.log(err)
        })
        
    },
    toShowInfo: function (e) {
        console.log(e)
        wx.setStorage({
            key: "storageShowInfo",
            data: e.currentTarget.dataset.info
        })
        wx.navigateTo({
            url: '../showInfo/showInfo',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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