
var that = null;
import Toast from './../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data:{
		danmuSwitchStatus: true,
		danmuSwitchIcon_on: "https://786c-xly-2gc3is3wd07cf03e-1303899389.tcb.qcloud.la/friend-map-images/danmu_on.png?sign=bfd057db306adda5d460c76f8af3c74e&t=1621069142",
		danmuSwitchIcon_off:"https://786c-xly-2gc3is3wd07cf03e-1303899389.tcb.qcloud.la/friend-map-images/danmu_off%20.png?sign=ddd3fbc2d95f54fa0a4054f375d93c79&t=1621069115"
		
  },
  onDanmuSwitch: function() {
		console.log(this.data.danmuSwitchStatus)
		this.setData({
			danmuSwitchStatus: !this.data.danmuSwitchStatus
		})
	}
})