const { join } = require('path')
const isTemplatePath = require('./is-template-path')

const resolveSourcePath = (templateDir, templatePath) => {
  return isTemplatePath(templatePath)
    ? join(templateDir, templatePath) : templatePath
}

module.exports = resolveSourcePath
