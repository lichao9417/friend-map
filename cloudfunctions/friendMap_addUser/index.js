let userdata = {}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {


    userdata = event;
    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
    const wxContext = cloud.getWXContext()
    let d,_id;//_id用于接收add 或者 set成功后返回的promise对象的 记录 _id
    let reg = /.+?(省|市|自治区|自治州|县|区)/g;
    let region = {
      province: event.address.match(reg)[0],
      city: event.address.match(reg)[1] || '',
      area: event.address.match(reg)[2] || '',
    };
    userdata.region = region;

    let userData = await db.collection('friend-map-data').where({
        'userInfo.openId': wxContext.OPENID
    }).get()
    console.log("userData", userData)
    //查询用户是否已经在数据库中 不在就添加，否则更新
    if (userData.data.length != 0) {
        try {  
            //更新       
            userDoc = userData.data[0]
            d =  await db.collection('friend-map-data').doc(userDoc._id)
                .set({
                    data: userdata
                })
            _id = d._id; 
            //更新弹幕
            try {
                await db.collection('friend-map-danmu').where({
                    'userInfo.openId': wxContext.OPENID
                }).update({
                  // data 传入需要局部更新的数据
                  data: {
                    "from.name": event.name,
                    latitude: event.location.latitude,
                    longitude: event.location.longitude,
                    display: !event.invisibleMode && event.isMarkedOnMap
                  }
                })
              } catch(e) {
                console.error(e)
              }
            //更新手绢信息
            try {
                await db.collection('friend-map-shoujuan').where({
                    'userInfo.openId': wxContext.OPENID
                }).update({
                  // data 传入需要局部更新的数据
                  data: {
                    "from.name": event.name,
                    //display: !event.invisibleMode && event.isMarkedOnMap
                    display: !event.invisibleMode
                  }
                })
              } catch(e) {
                console.error(e)
              }


            return await db.collection('friend-map-data').doc(_id).get()   
        } catch (e) {
            console.error(e)
        }
    } else {
        try {
            d =  await db.collection("friend-map-data").add({
                data: userdata
            })
            _id = d._id;
            return await db.collection('friend-map-data').doc(_id).get()
        } catch (e) {
            console.error(e);
        }
    }
}



