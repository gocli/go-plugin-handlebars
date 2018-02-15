const loadTemplate = require('./load-template')

const processTemplate = (options, path, contextOrDestPath, contextOrNothing) => {
  const destPath = typeof contextOrDestPath === 'string' ? contextOrDestPath : path
  const context = typeof contextOrDestPath === 'object' ? contextOrDestPath : contextOrNothing || {}

  return loadTemplate(options, path)
    .then((template) => template(context, destPath))
}

module.exports = processTemplate
