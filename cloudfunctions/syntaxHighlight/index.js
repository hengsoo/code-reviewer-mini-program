const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {

  const prism = require('./utils/prism.js')
  const file_name = event.file_name
  const raw_file_content = event.file_content.split("\n")
  const file_extension = file_name.split(".").pop()
  const [language, grammar] = getLanguageAndGrammar(file_extension, prism)

  console.log("Syntax Highlight: ", file_name)

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

  return {
    highlighted_content: file_highlighted_content,
    language: language
  }
}

function getLanguageAndGrammar(file_extension, prism){
  let language = "clike"
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
      language = "markup"
      grammar = prism.languages.markup
      break
    case "JSON":
    case "json":
      language = "json"
      grammar = prism.languages.json
      break
    case "ino":
      language = "arduino"
      grammar = prism.languages.arduino
      break
    case "sh":
      language = "bash"
      grammar = prism.languages.bash
      break
    case "cs":
      language = "csharp"
      grammar = prism.langauages.csharp
      break
    case "go":
      language = "go"
      grammar = prism.langauages.go
      break
    case "css":
      language = "css"
      grammar = prism.langauages.css
      break
    case "md":
      language = "markdown"
      grammar = prism.langauages.markdown
      break
    case "dtl":
      language = "django"
      grammar = prism.langauages.django
      break
    case "php":
    case "php4":
    case "php5":
      language = "php"
      grammar = prism.langauages.php
      break
    case "cl":
      language = "opencl"
      grammar = prism.langauages.opencl
      break
    case "m":
      language = "matlab"
      grammar = prism.langauages.matlab
      break
    case "tex":
    case "latex":
      language = "latex"
      grammar = prism.langauages.latex
      break
    case "kt":
      language = "kotlin"
      grammar = prism.langauages.kotlin
      break
    case "r":
      language = "r"
      grammar = prism.langauages.r
      break
    case "jsx":
      language = "jsx"
      grammar = prism.langauages.jsx
      break
    case "rb":
      language = "ruby"
      grammar = prism.langauages.ruby
      break
    case "rs":
      language = "rust"
      grammar = prism.langauages.rust
      break
    case "scss":
      language = "sass"
      grammar = prism.langauages.sass
      break
    case "sql":
      language = "sql"
      grammar = prism.langauages.sql
      break
    case "swift":
      language = "swift"
      grammar = prism.langauages.swift
      break
    case "v":
      language = "verilog"
      grammar = prism.langauages.verilog
      break
    case "vhd":
      language = "vhdl"
      grammar = prism.langauages.vhdl
      break
    case "vb":
      language = "visual-basic"
      grammar = prism.langauages.visual-basic
      break
    default:
      language = "clike"
      grammar = prism.languages.clike
  }

  return [language, grammar]
}