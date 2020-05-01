const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {

  const user_openid = cloud.getWXContext().OPENID

  const file_name = event.file_name
  const raw_file_content = event.file_content
  const file_id = file_name + "_" + Date.now() + "_" + user_openid

  console.log("Add new file: ", file_id)

  try {
    let {
      highlighted_content,
      language
    } = (await cloud.callFunction({
      name: 'syntaxHighlight',
      data: {
        file_name: file_name,
        file_content: raw_file_content
      }
    })).result

    addEntry(user_openid, file_id, language, highlighted_content)
    updateUserMenu(user_openid, file_id, file_name, language)

    const menu_id = `program_file_menu_` + user_openid
    const updated_menu = await db.collection('user-menus').doc(menu_id).get()

    return updated_menu
  }
  // If syntaxHighlight failed
  catch (error) {
    console.error('syntaxHighlight FAILED: ', error)
    return null
  }

}

async function addEntry(user_openid, file_id, language, file_highlighted_content) {
  console.log("Add entry")
  try {
    await db.collection('program-files').add({
      data: {
        _id: file_id,
        _openid: user_openid,
        created_at: new Date(),
        language: language,
        code: file_highlighted_content,
        reviews: []
      }
    })
  } catch (error) {
    console.error("Add entry failed: ", error)
  }
}

async function updateUserMenu(user_openid, file_id, file_name, language) {
  console.log("Update user menu")
  try {
    await db.collection('user-menus')
      .where({
        _openid: user_openid
      })
      .update({
        data: {
          menu: db.command.push({
            file_id: file_id,
            file_name: file_name,
            language: language
          })
        }
      })
  } catch (error) {
    console.error("Update user menu failed: ", error)
  }
}