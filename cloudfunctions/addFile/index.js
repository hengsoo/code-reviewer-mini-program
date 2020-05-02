const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {

  const user_openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const prism = require('./utils/prism.js')
  const file_name = event.file_name
  const raw_file_content = event.file_content.split("\n")
  const file_extension = file_name.split(".").pop()
  const [language, grammar] = getLanguageAndGrammar(file_extension, prism)
  const file_id = file_name + "_" + Date.now() +"_"+ user_openid

  console.log("Add new file:")
  console.log(file_id + " " + language)

  let file_highlighted_content = []

  raw_file_content.forEach( line => {
    if (line === ""){
      file_highlighted_content.push(" ")
    }
    else{
      // Highlight line
      line = prism.highlight(line, grammar, language)
      // Repalce 4 spaces and tab with nbsp
      line = line.replace(/    |	/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
      // Push line
      file_highlighted_content.push(line)
    }
  })

  console.log("Add entry")
  await db.collection('program-files').add({
    data:{
      _id : file_id,
      _openid : user_openid,
      created_at: new Date(),
      language: language,
      code: file_highlighted_content,
      reviews: []
    }
  })

  console.log("Update user menu")
  await db.collection('user-menus')
  .where({
    _openid: user_openid
  })
  .update({
    data: {
      menu: db.command.push(
        {
        file_id: file_id,
        file_name: file_name,
        language: language
      })
    }
  })

  const menu_id = `program_file_menu_` + user_openid
  const updated_menu = await db.collection('user-menus').doc(menu_id).get()

  return updated_menu
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
