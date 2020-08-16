const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// cloud function entry
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user_openid = wxContext.OPENID
  const db = cloud.database()

  let display_guide_on_launch = event.display_guide_on_launch
  let settings = {}
  try {
    await db.collection('user-settings').doc(user_openid).update({
      data: {
        display_guide_on_launch: display_guide_on_launch
      }
    })
  }
  catch(error){
    console.log('user-setting not found. Create new.')
    await db.collection('user-settings').add({
      data:{
        _id: user_openid,
        display_guide_on_launch: display_guide_on_launch
      }
    })
  }
}
