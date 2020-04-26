// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const user_openid = cloud.getWXContext()
  const db = cloud.database()
  const file_id = event.file_id

  let program_file = {}
  console.log("Get file: ", file_id)
  try{
    program_file = await db.collection('program-files').doc(file_id).get()
  }
  catch( error ){
    console.error("Get file failed: ", error)
  }

  return program_file
}
