// file of entry of cloud function
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// entry of cloud function
exports.main = async (event, context) => {
  const user_openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const file_id = event.file_id

  // remove record in program-files
  await db.collection('program-files').where({
    _id: file_id,
  }).remove()

  // remove record in menu array in particular user-menus
  await db.collection('user-menus').where({
    _openid: user_openid,
  }).update({
    data: {
      menu: db.command.pull({
        file_id: file_id
      }),
    }
  })

  const updated_menu = await db.collection('user-menus').doc(
    `program_file_menu_` + user_openid
  ).get()

  return updated_menu
}
