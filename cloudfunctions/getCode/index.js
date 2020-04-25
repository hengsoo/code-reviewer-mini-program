// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const user_openid = cloud.getWXContext()
  const db = cloud.database()
  const code = await db.collection('program-files')
  .where({
    _id: event.file_id
  }).code

  return code
}