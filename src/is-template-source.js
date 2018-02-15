const { sep } = require('path')

const isTemplateSource = (templatesDir, path) =>
  path === templatesDir || !path.indexOf(templatesDir + sep)

module.exports = isTemplateSource
