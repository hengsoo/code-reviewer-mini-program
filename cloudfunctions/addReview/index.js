const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// TODO: export syntax highlighting as another cloud function
exports.main = async (event, context) => {

  const user_openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const prism = require('./utils/prism.js')

  const file_id = event.file_id
  const file_name = (file_id.match(/.+(?=_\d+_)/))[0]
  const file_extension = file_name.split(".").pop()

  const line_number = event.line
  const type = event.type
  const author_name = event.author_name
  const author_avatar_url = event.author_avatar_url

  const raw_review_content = event.content.split("\n")
  const [language, grammar] = getLanguageAndGrammar(file_extension, prism)

  console.log("Add new review:")
  console.log(type + " review" + file_name)

  let highlighted_review_content = []

  raw_review_content.forEach( review_line => {
    if (review_line === ""){
      highlighted_review_content.push(" ")
    }
    else{
      // Highlight review line
      review_line = prism.highlight(review_line, grammar, language)
      // Repalce 4 spaces and tab with nbsp
      review_line = review_line.replace(/    |	/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
      // Push line
      highlighted_review_content.push(review_line)
    }
  })

  highlighted_review_content = highlighted_review_content.join("<br>")

  console.log("Add entry")
  let review_data = {}
  const key = 'reviews.' + line_number
  review_data[key] = db.command.push(
      {
        author_name: author_name,
        author_avatar_url: author_avatar_url,
        type: type,
        content: highlighted_review_content
      }
  )

  await db.collection('program-files').where({
    _id: file_id
  })
  .update({
    data: review_data
  })
  console.log("Add successed")
  
  const program_file = await db.collection('program-files').doc(file_id).get()
  const new_reviews = program_file.data.reviews
  return new_reviews
}

function getLanguageAndGrammar(file_extension, prism){
  let language = ""
  let grammar = {}
  switch(file_extension){
    case "c":
      language = "c"
      grammar = prism.languages.c
      break
    case "cpp":
      language = "cpp"
      grammar = prism.languages.cpp
      break
    case "py":
      language = "python"
      grammar = prism.languages.python
      break
    case "js":
      language = "javascript"
      grammar = prism.languages.javascript
      break
    case "java":
      language = "java"
      grammar = prism.languages.java
      break
    case "html":
      langauage = "markup"
      grammar = prism.languages.markup
      break
    case "JSON":
    case "json":
      language = "json"
      grammar = prism.languages.json
      break
    default:
      langauge = "clike"
      grammar = prism.languages.clike
  }

  return [language, grammar]
}