const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {

  const user_openid = cloud.getWXContext().OPENID
  const file_id = event.file_id
  const file_name = (file_id.match(/.+(?=_\d+_)/))[0]

  const line_number = event.line
  const type = event.type
  const author_name = event.author_name
  const author_avatar_url = event.author_avatar_url

  const raw_review_content = event.content

  console.log("Add new review:")
  console.log(type + " review" + file_name)

  try {
    let { highlighted_content } = 
      (await cloud.callFunction({
          name: 'syntaxHighlight',
          data: {
            file_name: file_name,
            file_content: raw_review_content
          }
        })
      ).result

    // Join the review content with <br>
    highlighted_content = highlighted_content.join("<br>")

    addReviewEntry(user_openid, file_id, line_number, author_name, 
      author_avatar_url, type, highlighted_content)

    // Get updated review
    const program_file = await db.collection('program-files').doc(file_id).get()
    const updated_reviews = program_file.data.reviews

    return updated_reviews
  }
  // If syntaxHighlight failed
  catch (error) {
    console.error('syntaxHighlight FAILED: ', error)
    return null
  }
}

async function addReviewEntry(user_openid, file_id, line_number, 
  author_name, author_avatar_url, type, highlighted_review_content){
  console.log("Add Review entry")
  let review_data = {}
  // Create line number key
  const key = 'reviews.' + line_number
  review_data[key] = db.command.push(
      {
        author_openid: user_openid,
        author_name: author_name,
        author_avatar_url: author_avatar_url,
        created_at: new Date(),
        type: type,
        content: highlighted_review_content
      }
  )
  try {
    await db.collection('program-files').doc(file_id)
    .update({
     data: review_data
   })
  } catch (error) {
    console.error("Add Review entry failed: ", error)
  }
}
