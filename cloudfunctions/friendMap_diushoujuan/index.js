// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数

  
  exports.main = async (event, context) => {
    let data = event;
    const wxContext = cloud.getWXContext();
    let shoujuanData = await db.collection('friend-map-shoujuan').where({
      'userInfo.openId': wxContext.OPENID
     }).get();
    
     //每人只能丢一个手绢
     if (shoujuanData.data.length != 0) {
      try {
          shoujuanDoc = shoujuanData.data[0]
          return await db.collection('friend-map-shoujuan').doc(shoujuanDoc._id)
              .set({
                  data: data
              })
            
      } catch (e) {
          console.error(e)
      }
  } else {
      try {
          return await db.collection("friend-map-shoujuan").add({
              data: data
          })
          
      } catch (e) {
          console.error(e);
      }
  }




    try {
      return await db.collection('friend-map-shoujuan')
    .set({
      data: data
    })
    } catch(e) {
      console.log(e)
    }
  }
  




//const _id = event.from._id;
//let data = event;
//当小程序端调用云函数时，云函数的传入参数中会被注入小程序端用户的 openid
//与 openid 一起同时注入云函数的还有小程序的 appid。
//delete data.userInfo
// try {
//   return await db.collection("friend-map-data").doc(_id)
//   .update({
//     data: {
//       shoujuan: data
//     },
//   })
// } catch(e) {
//   console.error(e)
// } 