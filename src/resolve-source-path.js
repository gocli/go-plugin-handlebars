const { join } = require('path')
const isCompletePath = require('./is-complete-path')

const resolveSourcePath = (templatesDir, ...sources) => {
  return isCompletePath(sources[0])
    ? join(...sources) : join(templatesDir, ...sources)
}

module.exports = resolveSourcePath
