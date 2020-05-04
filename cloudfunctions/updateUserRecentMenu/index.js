const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const db = cloud.database()
  const user_openid = cloud.getWXContext().OPENID
  const file_id = event.file_id
  const file_name = event.file_name
  const menu_id = `program_file_menu_` + user_openid
  const language = event.language
  
  
  try {
    // judge whether element unique
    let new_element = {
      file_id: file_id,
      file_name: file_name,
      language: language,
    }
    let unique_flag = false
    let old_recent_menu = await db.collection('user-menus').doc(menu_id).get()
    old_recent_menu = old_recent_menu.data.recent_menu
    for (let i = 0; i < old_recent_menu.length; i++) {
      if(JSON.stringify(old_recent_menu[i]) === JSON.stringify(new_element)){
        unique_flag = true
      }
    }
    // if unique element
    if (!unique_flag){
      await db.collection('user-menus').doc(menu_id)
      .update({
        data: {
          recent_menu: db.command.push(new_element)
        }
      })
    }
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
          file_name: file_name,
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