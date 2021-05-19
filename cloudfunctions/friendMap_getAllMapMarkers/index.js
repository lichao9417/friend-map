// 云函数入口文件
//数据库查询markers并返回
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
 
  //获取所有的用户marker
  let userMarkers = [];
  try {
    //async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。阮一峰 async函数
    let res = await db.collection('friend-map-data').where({
      invisibleMode: false,//用户没有隐身
      isMarkedOnMap: true//用户选择在地图上精确显示位置
    }).get();
    let friendMapData = res.data
    for (let i = 0; i < friendMapData.length; i++) {
      userMarkers.push(friendMapData[i].oneUserMarker)
    }
    console.log(userMarkers)
  } catch(e) {
    console.log(e);
  }

  //获取所有的手绢marker
  let shoujuanMarkers = [];
  try {
    //async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。阮一峰 async函数
    let res = await db.collection('friend-map-shoujuan').where({
      display: true
    }).get();
    console.log(res)
    let shoujuanData = res.data
    for (let i = 0; i < shoujuanData.length; i++) {
      shoujuanMarkers.push(shoujuanData[i].marker)
    }
    console.log(shoujuanMarkers)
  } catch(e) {
    console.log(e);
  }

  let allMarkers = userMarkers.concat(shoujuanMarkers)
  return allMarkers;

    
}