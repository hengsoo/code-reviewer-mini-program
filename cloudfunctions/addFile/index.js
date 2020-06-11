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
     // Filter file extension
     const file_extension = file_name.split(".").pop()
     const forbidden_file_extensions =  ["aid","cda","mid","midi","mp3","mpa","ogg","wav","wma","wpl","7z",
     "arj","deb","pkg","rar","rpm","gz","z","zip","tar","bin","dmg","iso","toast","vcd","mdb","email",
     "eml","emlx","apk","exe","msi","ttf","fnt","fon","otf","ai","bmp","gif","ico","jpeg","jpg","png",
     "ps","psd","svg","tif","tiff","key","odp","pps","ppt","pptx","ods","xls","xlsm","xlsx","avi","mp4",
     "mov","mpg","wmv","mkv","flx","doc","docx","odt","pdf","rtf","wpd"]

     if (forbidden_file_extensions.includes(file_extension)){
       console.log("Invalid input file extension: ", file_name)
       throw Error('Invalid input file extension.')
     }

    // Syntax Highlight
    let { highlighted_content, language } = 
      (await cloud.callFunction({
          name: 'syntaxHighlight',
          data: {
            file_name: file_name,
            file_content: raw_file_content
          }
        })
      ).result

    await addProgramFileEntry(user_openid, file_id, language, highlighted_content)

    const menu_id = `program_file_menu_` + user_openid
    await updateUserMenu(menu_id, file_id, file_name, language)
    const updated_menu = await db.collection('user-menus').doc(menu_id).get()
    console.log(updated_menu)

    return updated_menu
  }
  // If syntaxHighlight failed
  catch (error) {
    console.error('syntaxHighlight FAILED: ', error)
    return null
  }

}

async function addProgramFileEntry(user_openid, file_id, language, highlighted_file_content) {
  console.log("Add ProgramFile entry")
  try {
    await db.collection('program-files').add({
      data: {
        _id: file_id,
        _openid: user_openid,
        created_at: new Date(),
        language: language,
        code: highlighted_file_content,
        reviews: {}
      }
    })
  } catch (error) {
    console.error("Add ProgramFile entry failed: ", error)
  }
}

async function updateUserMenu(menu_id, file_id, file_name, language) {
  console.log("Update user menu")
  try {
    await db.collection('user-menus').doc(menu_id)
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
