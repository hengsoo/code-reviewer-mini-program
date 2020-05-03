const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {

  const user_openid = cloud.getWXContext().OPENID
  const db = cloud.database()

  let menu_id = `program_file_menu_` + user_openid
  console.log(`Get user menu: ` + menu_id)
  let menu = {}

  try {
    menu = await db.collection('user-menus').doc(menu_id).get()
    console.log(`User menu found.`)
  }
  // If menu is not found
  catch (error){
    console.log("User menu not found. Create New.")
    // Add new entry
    await db.collection('user-menus').add({
      data:{
        _id : menu_id,
        _openid : user_openid,
        created_at: new Date(),
        menu: [],
        recent_menu: [],
      }
    })
    console.log("New menu created.")
    menu = await db.collection('user-menus').doc(menu_id).get()
    console.log(menu)
  }
  
    return menu
}