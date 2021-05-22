// pages/diushoujuan/diushoujuan.js
import Toast from './../../miniprogram_npm/@vant/weapp/toast/toast';
let that = null;
let marker = null; //用于记录shoujuan的marker信息
let shoujuanData = {};//传给云函数diushoujuan的参数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '',
    longitude: '',
    latitude: '',
    address: ''
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '丢手绢啦'
    })
  },
  toInputShouJuanMsg: function (e) {
    //console.log(e)
    this.setData({
      msg: e.detail
    })
  },
  diuWhere: function () {
    that = this;
    wx.chooseLocation({
      success: function (res) {
        // console.log(res)
        that.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude

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
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      iconPath: '/images/shoujuan.png',
      width: "30px",
      height: '30px'
      //rotate: 180
    }

    try {
      //从缓存中读取用户在friend-map-data中的doc
      var value = wx.getStorageSync('userDocInfo')
      if (value) {
        console.log(value)
        // Do something with return value
        shoujuanData.from = {};
        shoujuanData.from._id = value._id;
        shoujuanData.from.name = value.name;

        shoujuanData.marker = marker;
        shoujuanData.msg = that.data.msg;
        shoujuanData.display = true;
      }

    } catch (e) {
      // Do something when catch error
    }
    console.log(shoujuanData)
    // Toast.loading({
    //   message: '正在努力丢手绢...',
    //   forbidClick: true,
    // });
    //判断输入信息是否完整
    let f1 = 0,f2 = 0;
    if(that.data.msg==='') {
      Toast('您还没有输入留言哦');
    } else {
      f1 = 1;
    }
    if(that.data.address==='') {
      Toast('你还没有选择位置哦');
    } else {
      f2 = 1;
    }
    if(f1===0 || f2===0)
      return;

    //调用diushoujuan云函数
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'friendMap_diushoujuan',
      // 传递给云函数的event参数
      data: shoujuanData
    }).then(res => {
      // output: res.result === 3
       //跳转至首页
       wx.switchTab({
        url: '../home/home',
        success: function() {
       
        }
      })

    }).catch(err => {
      // handle error
    })

  }



})