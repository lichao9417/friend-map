// 云函数入口文件
//搜索未在地图上显示的用户   字段名showMark
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
let findObj = {
  isMarkedOnMap: false,
  invisibleMode: false
}

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let province = event.province;
  let city = event.city;
  let area = event.area;
  let region = {};

  if (area !== '全部')
    region.area = area;
  if (city !== '全部')
    region.city = city;
  if (province !== '全部') {
    region.province = province;
    findObj.region = region;//避免出现region为空对象，查询出错
  } else {
    delete findObj.region;
  }
    
  

  
  console.log('findObj', findObj)
  try {
    return await db.collection('friend-map-data').where(findObj).get();
  } catch (e) {

  }

}