// 云函数入口文件
//数据库查询danmu并返回
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
 
  try {
    return await db.collection('friend-map-danmu').where({
      "userInfo.openId": event.userInfo.openId
    }).remove()  
  } catch(e) {
    console.error(e)
  }

}