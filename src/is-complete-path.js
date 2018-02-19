const { isAbsolute } = require('path')

const isCompletePath = (path) => {
  if (!path) return false
  if (isAbsolute(path)) return true
  return /^(\.{1,2}|~)(\/|$)/.test(path)
}

module.exports = isCompletePath
