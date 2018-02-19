const readFiles = require('./read-files')
const fail = require('./fail')
const createTemplate = require('./create-template')
const createSearch = require('./create-search')

const loadTemplatesSync = function (search = {}, context = {}) {
  try {
    return (Array.isArray(search)
      ? search : readFiles.sync(createSearch(search, this.getTemplatesDir())))
      .map(({ name, content }) => {
        const template = createTemplate(content)
        return { name, process: (ctx) => template(Object.assign({}, context, ctx)) }
      })
  } catch (error) {
    throw fail(loadTemplatesSync, error)
  }
}

module.exports = loadTemplatesSync
