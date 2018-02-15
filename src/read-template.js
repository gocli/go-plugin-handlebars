const fs = require('fs')
const Handlebars = require('handlebars')
const resolveSourcePath = require('./resolve-source-path')

const readTemplate = (templatesDir, templateName) => new Promise((resolve, reject) => {
  const path = resolveSourcePath(templatesDir, templateName)

  return fs.readFile(path, (err, templateContent) => {
    if (err) {
      reject(err)
    } else {
      resolve(Handlebars.compile(templateContent.toString()))
    }
  })
})

module.exports = readTemplate
