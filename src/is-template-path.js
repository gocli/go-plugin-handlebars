const { isAbsolute } = require('path')

const isTemplatePath = (path) => {
  if (isAbsolute(path)) return false
  return !/^(\.{1,2}|~)(\/|$)/.test(path)
}

module.exports = isTemplatePath
