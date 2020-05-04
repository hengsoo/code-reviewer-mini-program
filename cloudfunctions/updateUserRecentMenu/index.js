const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const db = cloud.database()
  const user_openid = cloud.getWXContext().OPENID
  const file_id = event.file_id
  const file_name = event.file_name
  const file_openid = event.file_openid
  const menu_id = `program_file_menu_` + user_openid
  const language = event.language
  
  try {
    await db.collection('user-menus').doc(menu_id)
      .update({
        data: {
          recent_menu: db.command.addToSet({
            file_id: file_id,
            language: language,
          })
        }
      })
  } catch (error) {
    console.log("User menu not found. Create New.")
    await db.collection('user-menus').add({
      data:{
        _id : menu_id,
        _openid : user_openid,
        created_at: new Date(),
        menu: [],
        recent_menu: [{
          file_id: file_id,
          language: language
        }],
      }
    })
  }
  // limit recent_menu to 5 record
  let user = await db.collection('user-menus').doc(menu_id).get()
  if (user.data.recent_menu.length > 5){
    await db.collection('user-menus').doc(menu_id)
      .update({
        data: {
          recent_menu: db.command.shift(),
          }
        })
  }
}