// 云函数入口文件
//获取用户数据
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
let findObj = {
}

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)

  if(event.flag===0) {
    let markerId = event.markerId;
    findObj = {
      oneUserMarker: {
        id: markerId
      }
    }
  } else if(event.flag===1) {
    //event.userInfo.openId
    findObj = {
      userInfo: {
        openId: event.userInfo.openId
      }
    }
  }


  
  console.log('findObj', findObj)
  try {
    return await db.collection('friend-map-data').where(findObj).get();
  } catch (e) {

  }

}