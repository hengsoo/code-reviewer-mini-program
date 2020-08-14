// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user_openid = wxContext.OPENID
  const db = cloud.database()

  let is_guide = event.is_guide
  let setting = {}
  try {
    await db.collection('user-settings').doc(user_openid).update({
      data: {
        is_guide: is_guide
      }
    })
  }
  catch(error){
    console.log('user-setting not found. Create new.')
    await db.collection('user-settings').add({
      data:{
        _id: user_openid,
        is_guide: is_guide
      }
    })
  }

}