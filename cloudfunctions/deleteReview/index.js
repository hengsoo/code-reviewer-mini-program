const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// TODO: Remove empty reviews line
exports.main = async (event, context) => {

  const file_id = event.file_id
  const review_id = event.review_id
  const line_number = review_id.split('_')[1]
  
  console.log("Delete review: ", review_id)

  const delete_target = {}
  const key = "reviews." + line_number
  // Remove review which has review_id
  delete_target[key] = db.command.pull({
    _id: review_id
  })

  try {
    await db.collection('program-files').where({
      _id:  file_id
    })
    .update({
      data: delete_target
    })
  } 
  catch (error) {
    console.log("Update reviews failed: ", error);
  }

  // Get updated review
  const program_file = await db.collection('program-files').doc(file_id).get()
  const updated_reviews = program_file.data.reviews

  return updated_reviews
}