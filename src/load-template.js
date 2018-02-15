const fs = require('fs')
const readTemplate = require('./read-template')

const loadTemplate = (options, templateName) => {
  const createRenderFunction = (template) => {
    return (contextOrPath, path) => new Promise((resolve, reject) => {
      let context

      if (typeof contextOrPath === 'string') {
        path = contextOrPath
      } else if (contextOrPath) {
        context = contextOrPath
      }

      const content = template(context)

      if (!path) return resolve(content)
      return fs.writeFile(path, content, (err) => {
        if (err) reject(err)
        else resolve(content)
      })
    })
  }

  return readTemplate(options.templatesDir, templateName)
    .then(createRenderFunction)
}

module.exports = loadTemplate
