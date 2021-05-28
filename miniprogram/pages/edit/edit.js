import Toast from './../../miniprogram_npm/@vant/weapp/toast/toast';
let lock = 0;//
let that = null
let addUserData = {}
let oneUserMarker = {}
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo: {},   
      name: '',
      address: '',
      markers: [],
      invisibleMode: false,
      isMarkedOnMap: true,
      region: ''
    },
    //that = this,
    onLoad: function() {
      
    },
    onShow: function() {
      that = this;
      //读取缓存初始化用户信息
      if(lock===0) {
        try {
          var value = wx.getStorageSync('userDocInfo')
          if (value) {
            that.setData({
              name: value.name,
              address: value.address,
              invisibleMode: value.invisibleMode,
              isMarkedOnMap: value.isMarkedOnMap,
              location: value.location
            })
          }
          lock = 0;
        } catch (e) {
          // Do something when catch error
        }
     }
      
    },
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res.userInfo)
          this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        }
      })
    },
  
    
    toChooseLocation: function() {
      console.log(111)
      lock = 1;
        that = this
        wx.chooseLocation({
            success:function(res) {
              console.log("选择位置回调",res)
            
                that.setData({
                  "location.latitude" : res.latitude,
                  "location.longitude" : res.longitude,
                  "location.name": res.name,
                  address: res.address
                })
             //console.log(that.data.address)
                
            }
        })
    },
    toGetName: function(e) {
      this.setData({
        name: e.detail
      })
    },
    toChangeAddress: function(e) {
      this.setData({
        address: e.detail.value
      })
    },
    toSaveInfo: function() {
      that = this;
      console.log(that.data.location)
      if(that.data.location === undefined) {
        Toast("请您先选择位置再提交哦！");
        return;
      }
      if(that.data.name === '') {
        Toast("请您先输入姓名再提交哦！");
        return;
      }
      
      let markerId = Math.round(new Date() / 1000)//时间戳  以0结尾表示手绢
      markerId = markerId * 10+1;//以0结尾表示手绢 以1结尾表示用户marker
      oneUserMarker = {
        id: markerId,  
        latitude: that.data.location.latitude,
        longitude: that.data.location.longitude,
        iconPath: that.data.avatarUrl || '/images/location.png',
        width: "50px",
        height: '50px',
        callout: {
          content: that.data.name,
          color: '#000000',
          fontSize: 14,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: '#000000',
          bgColor: '#fff',
          padding: 5,
          display: 'ALWAYS',
          textAlign: 'center'
        }
      }
      console.log(that.data.address)
      //数据库中需要保存的用户数据
      addUserData.name = that.data.name;
      addUserData.location = that.data.location;
      addUserData.oneUserMarker = oneUserMarker;
      addUserData.address = that.data.address;
      addUserData.invisibleMode = that.data.invisibleMode;
      addUserData.isMarkedOnMap = that.data.isMarkedOnMap;
      addUserData.logged = true;
      //addUserData.requestFromPage = "edit";
      console.log("addUserData",addUserData)
     
      wx.showLoading({
        title: '保存用户信息',
      })
      //缓存登陆用户信息
      wx.setStorage({
        key: "myInfo",
        data: addUserData
      })
       //将信息录入数据库
       wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'friendMap_addUser',
        // 传递给云函数的event参数
        data: addUserData
      }).then(res => {
        //console.log(res)
        let storageData = res.result.data;
       
        try {
          wx.setStorageSync('userDocInfo', storageData)

          wx.hideLoading();
          //跳转至首页
         wx.switchTab({
          url: '../home/home',
        })
        } catch (e) { }
        


        
      }).catch(err => {
        console.log(err)
        // handle error
        wx.hideLoading()
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
        
        
      })
      
    },
    //是否在地图上显示mark
    toCreateMarkOnMap: function(e) {
      that = this
      this.setData({
        isMarkedOnMap: !this.data.isMarkedOnMap
      },function(){
        //更新隐身模式switch
        if(that.data.isMarkedOnMap)
          that.setData({
            invisibleMode: false
          })
      })
    },

    //是否隐身
    toChangeVisible: function(e) {
      //console.log(e)
      that = this;
      this.setData({
        invisibleMode: !this.data.invisibleMode
       
      },function(){
        console.log(this.data.invisibleMode)
        if(that.data.invisibleMode) {
          //开启隐身模式，则不在地图上显示用户marker，自动更新switch为false
          that.setData({
            isMarkedOnMap: false
          })
        }
      })
      
    }

    
})