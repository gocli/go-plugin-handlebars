const { join } = require('path')

const createResolver = (resolver) => {
  if (!resolver) return (fileName) => fileName

  if (typeof resolver === 'function') return resolver

  if (typeof resolver === 'string') {
    return (fileName) => join(resolver, fileName)
  }

  throw new Error('resolver should be either function or string')
}

module.exports = createResolver
