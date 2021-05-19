// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数

  
  exports.main = async (event, context) => {
    let data = event;
    console.log("data",data)
    const wxContext = cloud.getWXContext();
    let danmuCollection = await db.collection('friend-map-danmu').where({
      'userInfo.openId': wxContext.OPENID
     }).get();
    
     //每人只能发送一条弹幕
     if (danmuCollection.data.length != 0) {
      try {
          danmuDoc = danmuCollection.data[0]
          return await db.collection('friend-map-danmu').doc(danmuDoc._id)
              .set({
                  data: data
              })
            
      } catch (e) {
          console.error(e)
      }
  } else {
      try {
          return await db.collection("friend-map-danmu").add({
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
  




