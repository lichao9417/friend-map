const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()  //注意这里不是wx.cloud.database()
// exports.main = async (event, context) => {
// 	const result = await db.collection('zhihu_daily')
// 		.get()
// 	return result
// }

exports.main = async (event, context) => {
  return await db.collection('zhihu_daily').get()
}

