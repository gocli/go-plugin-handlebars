const readFiles = require('./read-files')
const fail = require('./fail')
const createTemplate = require('./create-template')
const createSearch = require('./create-search')

const loadTemplates = function (search = {}, context = {}) {
  return Promise.resolve()
    .then(() => {
      return Array.isArray(search)
        ? search
        : readFiles(createSearch(search, this.getTemplatesDir()))
    })
    .then((files) => files.map(({ name, content }) => {
      const template = createTemplate(content)
      return { name, process: (ctx) => template(Object.assign({}, context, ctx)) }
    }))
    .catch((error) => { throw fail(loadTemplates, error) })
}

module.exports = loadTemplates
