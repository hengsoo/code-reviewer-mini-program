const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {

  const file_id = event.file_id
  const review_id = event.review_id
  const line_number = event.line_number
  const review_index = event.index

  let new_reviews = {}
  try {
    const program_file = await db.collection('program-files').doc(file_id).get()
    new_reviews = program_file.data.reviews
  } 
  catch (error) {
    console.error("Get program file failed: ", error)
  }

  console.log("Splice line,index", line_number, review_index)
  // Remove the element of index of review_index
  new_reviews[line_number].splice(review_index, 1)

  console.log("Remove empty")
  // Remove lines that have empty review
  for (let line in new_reviews) {
    if (new_reviews[line].length === 0) {
      delete new_reviews[line]
    }
  }


  try {
    console.log("update")
    console.log(new_reviews)
    const ta = {}
    const key = "reviews." + line_number
    ta[key] = db.command.pull({
      _id: review_id
    })

    await db.collection('program-files').where({
      _id:  file_id
    })
    .update({
      data: ta
    })
    console.log("update done")
  } 

  catch (error) {
    console.log("Update reviews failed: ", error);
  }

  console.log(new_reviews)

  return new_reviews
}