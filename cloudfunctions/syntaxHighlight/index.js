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
      grammar = prism.languages.csharp
      break
    case "go":
      language = "go"
      grammar = prism.languages.go
      break
    case "css":
      language = "css"
      grammar = prism.languages.css
      break
    case "md":
      language = "markdown"
      grammar = prism.languages.markdown
      break
    case "php":
    case "php4":
    case "php5":
      language = "php"
      grammar = prism.languages.php
      break
    case "cl":
      language = "opencl"
      grammar = prism.languages.opencl
      break
    case "m":
      language = "matlab"
      grammar = prism.languages.matlab
      break
    case "tex":
    case "latex":
      language = "latex"
      grammar = prism.languages.latex
      break
    case "kt":
      language = "kotlin"
      grammar = prism.languages.kotlin
      break
    case "r":
      language = "r"
      grammar = prism.languages.r
      break
    case "jsx":
      language = "jsx"
      grammar = prism.languages.jsx
      break
    case "rb":
      language = "ruby"
      grammar = prism.languages.ruby
      break
    case "rs":
      language = "rust"
      grammar = prism.languages.rust
      break
    case "scss":
      language = "sass"
      grammar = prism.languages.sass
      break
    case "sql":
      language = "sql"
      grammar = prism.languages.sql
      break
    case "swift":
      language = "swift"
      grammar = prism.languages.swift
      break
    case "v":
      language = "verilog"
      grammar = prism.languages.verilog
      break
    case "vhd":
      language = "vhdl"
      grammar = prism.languages.vhdl
      break
    case "vb":
      language = "visual-basic"
      grammar = prism.languages.visual-basic
      break
    default:
      language = "clike"
      grammar = prism.languages.clike
  }

  return [language, grammar]
}