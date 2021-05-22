
var that = null;
import Toast from './../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data:{
		//danmuDialogShow
	},
	onInputDanmu: function(e) {
    console.log(e)
    this.setData({
      danmuValue: e.detail
    })
	},
	onDanmuInputConfirm: function () {
		this.setData({
			danmuValue:'7'
		})
	},
	send_danmuBtn: function() {
    this.setData({
      danmuDialogShow: true
    })
	},
	onDanmuClose: function() {
		this.setData({
			danmuDialogShow: false
		})
	}
})