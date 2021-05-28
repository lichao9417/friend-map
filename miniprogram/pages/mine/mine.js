// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myShoujuan: '',
    myDanmu: '',
    
  },
  onGetMyDanmu: function() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'friendMap_getDanmu',
      // 传给云函数的参数
      data: {
        code: 1,//约定1为查找当前用户弹幕
      },
    })
    .then(res => {
      console.log(res.result) // 3
      if(res.result.data.length !== 0) {
        this.setData({
          myDanmu: res.result.data[0].value
        })
      }
    })
    .catch(console.error)
  },
  onRemoveMyDanmu: function() {
    wx.showLoading({
      title: '正在删除弹幕',
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'friendMap_removeDanmu',
      // 传给云函数的参数
      data: {
      },
    })
    .then(res => {
      console.log(res.result) // 3
      this.setData({
        myDanmu: ''
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
      // handle error
      wx.hideLoading()
      wx.showToast({
        title: '删除失败',
        icon: 'none',
        duration: 2000
      })
    }) 
  },
  //手绢
  onGetMyShoujuan: function() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'friendMap_getShoujuan',
      // 传给云函数的参数
      data: {
        code: 1,//约定1为查找当前用户手绢
      },
    })
    .then(res => {
      console.log(res.result) // 3
      
      if(res.result.data.length !== 0) {
        this.setData({
          myShoujuan: res.result.data[0].msg,
          //shoujuanAddress: res.result.data[0].
        })
      }
    })
    .catch(console.error)
  },
  onRemoveMyShoujuan: function() {
    wx.showLoading({
      title: '正在删除手绢',
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'friendMap_removeShoujuan',
      // 传给云函数的参数
      data: {
      },
    })
    .then(res => {
      console.log(res.result) // 3
      this.setData({
        myShoujuan: ''
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
      // handle error
      wx.hideLoading()
      wx.showToast({
        title: '删除失败',
        icon: 'none',
        duration: 2000
      })
    }) 
  },


  onShow: function() {
    this.onGetMyDanmu();
    this.onGetMyShoujuan();
  }
})