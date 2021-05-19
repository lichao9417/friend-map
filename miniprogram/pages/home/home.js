import Toast from './../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from './../../miniprogram_npm/@vant/weapp/notify/notify';
let flag_getAllMapMarkers = false;//是否获取所有的marker的标记
let that = null
let userData = []
let shoujuanData = {}////传给云函数diushoujuan的参数
//let app = getApp();
let marker = null; //shoujuan的marker信息
let getshoujuanCondition = {};
let shoujuanMarkers = [];//用于展示的所有手绢marker
let userMarkers = [];//用于展示的所有用户marker
let desLatitude;//用户marker位置
let desLongitude;
let e_detail_markerId;//点击marker获取到的markerId
let friendMapCtx;

Page({
  
  data: {
    latitude:'',
    longitude: '',
    autosize: { maxHeight: 100, minHeight: 50 },
    userMarkers: [],
    DSJDShow: false,
    shoujuan: {
      msg: '',
      longitude: '',
      latitude: '',
      address: ''
    },
    userMarkerShow: false,//bindmarkertap dialog
    shoujuanMarkerShow: false,
    //弹幕相关
    danmuDialogShow: false,  //默认不显示发送弹幕模态框
    danmuValue: '',
    danmuShow: true,  //是否显示弹幕
    danmuList: [], //弹幕数组
    danmuSwitchStatus: true,
		danmuSwitchIcon_on: "https://786c-xly-2gc3is3wd07cf03e-1303899389.tcb.qcloud.la/friend-map-images/danmu_on.png?sign=bfd057db306adda5d460c76f8af3c74e&t=1621069142",
		danmuSwitchIcon_off:"https://786c-xly-2gc3is3wd07cf03e-1303899389.tcb.qcloud.la/friend-map-images/danmu_off%20.png?sign=ddd3fbc2d95f54fa0a4054f375d93c79&t=1621069115"
  },
  //获取用户marker和手绢marker
  getAllMapMarkers: function() {
    that = this;
      //调用getMapMarkers获取数据库中所有marker
      wx.cloud.callFunction({
        name: 'friendMap_getAllMapMarkers'
      }).then(res => {
        console.log("res", res)
        
        that.setData({
         markers: res.result
        })  
      })
  },
 /*
 生命周期回调—监听页面初次渲染完成
 */
  onReady: function() {
    that = this;
    //friendMapCtx = wx.createMapContext('friendMap')
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
     })
 
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    friendMapCtx  = wx.createMapContext('friendMap', that);
    this.getAllMapMarkers()
  },
  onShow: function () {
    console.log("home show")
    this.getAllMapMarkers()
    this.getDanmu()
  },
  toShowInfo(e) {
    
    //点击标记点时触发，e.detail = {markerId}
    console.log(e)
    
    that = this;
   
    //markerId可以从e中获取
    e_detail_markerId = e.detail.markerId
    let flag = e_detail_markerId%10//0:shoujuanmarker 1:用户marker
    //
    if(flag === 1) {
      that.setData({
        userMarkerShow: true
      })
    }
    if(flag === 0) {
      that.setData({
        shoujuanMarkerShow: true
      })
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'friendMap_getOneshoujuanDoc',
        // 传递给云函数的event参数
        data: {
          markerId: e_detail_markerId
        }
      }).then(res => {
        // output: res.result === 3
        console.log(res);
        let oneshoujuan = res.result.data[0];
        that.setData({
          shoujuanFrom: oneshoujuan.from.name,
          shoujuanMsg: oneshoujuan.msg
        })
        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();
        // handle error
      })
    }
   
  },
  //拉起地图APP选择导航
  onOpenMapApp: function() {

    //getMapUserData
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'friendMap_getUserData',
      // 传递给云函数的event参数
      data: {
        markerId: e_detail_markerId,
        flag: 0
      }
    }).then(res => {
      // output: res.result === 3
      console.log(res);
      const location = res.result.data[0].location;
      friendMapCtx.openMapApp({
        latitude: location.latitude,
        longitude: location.longitude,
        destination: location.name//目的地名称 必填
      })
    }).catch(err => {
      // handle error
    })
  },
  onChatTa: function() {
    Notify({ type: 'primary', message: '期待官方API支持微信聊天' });
  },

  //丢手绢事件处理函数
  diushoujuanBtn: function (e) {
    //页面跳转 如果使用模态框的话 调用chooseLocation 点击确定后是会触发home.js onshow导致重新查询，选择一次位置多一次接口调用  所以更换成页面跳转，之后如果有过呢个好的方法展示主页，可以换回dialog 

    //this.setData({ DSJDShow: true });
    wx.navigateTo({
      url: '../diushoujuan/diushoujuan'
    })
  },
  onDSJClose: function (e) {
    this.setData({
      DSJDShow: false
    });
  },
  toInputShouJuanMsg: function (e) {
    //console.log(e)
    this.setData({
      "shoujuan.msg": e.detail
    })
  },
  diuWhere: function () {
    that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        console.log()
        that.setData({
          "shoujuan.address": res.address,
          "shoujuan.latitude": res.latitude,
          "shoujuan.longitude": res.longitude

        })
      }
    });
  },

  diushoujuanConfirm: function (e) {
    that = this;
    let markerId = Math.round(new Date() / 1000)//时间戳  以0结尾表示手绢
    markerId = markerId * 10;//以0结尾表示手绢 以1结尾表示用户marker
    marker = {
      id: markerId,
      latitude: that.data.shoujuan.latitude,
      longitude: that.data.shoujuan.longitude,
      iconPath: '/images/shoujuan.png',
      width: "50px",
      height: '50px'
    }
    try {
      var value = wx.getStorageSync('userDocInfo')
      if (value) {
        // Do something with return value
        shoujuanData.from = {};
        shoujuanData.from._id = value._id;
        shoujuanData.from.name = value.name;
        shoujuanData.marker = marker;
        shoujuanData.msg = that.data.shoujuan.msg;
      }
    } catch (e) {
      // Do something when catch error

    }



    //判断输入信息是否完整
    //新加的手绢marker直接push到markers里


  },
  //发弹幕相关函数
  send_danmuBtn: function() {
    this.setData({
      danmuDialogShow: true
    })
  },//onInputDanmu
  onInputDanmu: function(e) {
    console.log(e)
    this.setData({
      danmuValue: e.detail
    })
  },
  send_danmu: function(e) { 
    that = this;
    if(that.data.danmuValue === '') {
      Notify("您还没有输入弹幕内容哦！");  
      return;
    }
    
    let danmuData = {};
    try {
      //从缓存中读取用户在friend-map-data中的doc
      var value = wx.getStorageSync('userDocInfo')
      console.log(value)
      if (value) {
        // Do something with return value
        danmuData.id = Math.round(new Date() / 1000);
        danmuData.from = {};
        danmuData.from._id = value._id;
        danmuData.from.name = value.name;
        danmuData.display = true;
        danmuData.color = getRandomColor();
        danmuData.top = parseInt(Math.random() * 100);
        danmuData.right = parseInt(Math.random() * 20);
        //danmuData.top = Math.floor(Math.random()*10+1)
        danmuData.value = that.data.danmuValue;
        danmuData.latitude = value.location.latitude;
        danmuData.longitude = value.location.longitude;
      }
      //只有关闭隐身模式并且开启在地图上显示marker的用户才可以发弹幕
      if(value.invisibleMode || !value.isMarkedOnMap) {
        Notify("关闭隐身模式并且开启在地图上显示才可以发送弹幕！");
        
        return;
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
    console.log(danmuData)
    wx.showLoading({
      title: '正在发送',
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'friendMap_addDanmu',
      // 传递给云函数的参数
      data:  danmuData,
      success: res => {
       console.log(res)
       that.setData({
        danmuValue: ''
       })
       wx.hideLoading();
       //更新view中的弹幕
       that.getDanmu();
      },
      fail: err => {
        // handle error
      },
      complete: () => {
        // ...
      }
    })
  },
  
  onDanmuSwitch: function() {
		this.setData({
			danmuSwitchStatus: !this.data.danmuSwitchStatus
		})
	},
  //点击弹幕事件
  onDanmuClick: function(e) {
    console.log(e)
    this.setData({
      latitude: e.currentTarget.dataset.latitude,
      longitude: e.currentTarget.dataset.longitude
    })
  },
  //获取所有弹幕
getDanmu: function() {
  that = this;
  wx.cloud.callFunction({
    // 要调用的云函数名称
    name: 'friendMap_getDanmu',
    // 传递给云函数的参数
    data: {
     
    },
    success: res => {
     console.log(res)
     that.setData({
      danmuList: res.result.data
     })
    },
    fail: err => {
      // handle error
    },
    
  })
}



})
//随机获取弹幕颜色
function getRandomColor() {
  var color1 = parseInt(Math.random() * 256);
	var color2 = parseInt(Math.random() * 256);
  var color3 = parseInt(Math.random() * 256);
  var color = "rgb(" + color1 + "," + color2 + "," + color3 + ")";
  return color;
}