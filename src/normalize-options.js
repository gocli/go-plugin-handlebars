const fail = require('./fail')

const DEFAULT = { templatesDir: '.templates' }

const normalizeOptions = (caller, options = {}) => {
  if ('templatesDir' in options && typeof options.templatesDir !== 'string') {
    throw fail(caller, '`templatesDir` should be a string')
  }

  return { ...DEFAULT, ...options }
}

module.exports = normalizeOptions
