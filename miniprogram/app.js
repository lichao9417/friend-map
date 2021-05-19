//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        //env: 'my-env-id',
        traceUser: true,
      })
    }
    console.log(11)
    try {
      //从缓存中读取用户在friend-map-data中的doc
      var value = wx.getStorageSync('userDocInfo')
      console.log(value)
      if (!value) {
        console.log(22)
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'friendMap_getUserData',
          // 传递给云函数的event参数
          data: {
            flag: 1
          }
        }).then(res=>{
          console.log(res)
          let storageData = res.result.data[0];
          try {
            wx.setStorageSync('userDocInfo', storageData)
            wx.hideLoading();
            //跳转至首页
           wx.switchTab({
            url: '../home/home',
          })
          } catch (e) { }
          console.log(res)
        })
      }

    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '获取用户缓存失败',
        duration: 2000
      })
      wx.hideToast({
        
      })
    }
  },
  globalData: {
    //userMapInfo: null //用户在数据库中保存的信息
    freshCode : 1 //表示home页面是否需要刷新，初值为0，表示默认不刷新（首次刷新通过onload），需要刷新时置为1
  },
  
  
})
