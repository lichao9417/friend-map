let that = undefined;
let danmuList = [];

class Danmu {
  constructor(text,color) {
    this.top = parseInt(Math.random() * 100);
    this.text = that.data.danmuValue;   
    this.color = color;
    this.id = Math.round(new Date() / 1000);//用做唯一的wx:key
    this.display = true;
  }
}
function getRandomColor() {
  var color1 = parseInt(Math.random() * 256);
	var color2 = parseInt(Math.random() * 256);
  var color3 = parseInt(Math.random() * 256);
  var color = "rgb(" + color1 + "," + color2 + "," + color3 + ")";
  return color;
}
Page({
  data: {
    text: '',
    danmuValue:'',
    danmuList: []
  },
  onDanmuValue: function(e) {
    console.log(e)
    this.setData({
      danmuValue: e.detail.value
    })
  },
  send_danmu:function() {
    that = this;
    let newDanmu = new Danmu(that.data.text,getRandomColor());
    danmuList.push(newDanmu);
    
    that.setData({
      danmuList: danmuList,
      danmuValue: ''
    })
    console.log(that.data.danmuList)

  },
  onDanmuClick: function(e) {
    console.log(e)
  }
  
})