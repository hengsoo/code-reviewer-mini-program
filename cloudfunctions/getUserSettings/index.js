// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const user_openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  let settings = {}

  try {
    settings = await db.collection('user-settings').doc( user_openid).get()
    console.log(`User setting found.`)
  }
  // if setting not found
  catch (error){
    console.log(`User setting not found. Create New.`)
    await db.collection('user-settings').add({
      data:{
        _id: user_openid,
        display_guide_on_launch: true,
      }
    })
    settings = await db.collection('user-settings').doc( user_openid).get()
  }

  return settings
}
