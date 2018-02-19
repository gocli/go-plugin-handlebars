const fail = require('./fail')
const createResolver = require('./create-resolver')
const save = require('./save')

const processTemplates = function (searchOrContents, context = {}, resolver = '') {
  return Promise.resolve()
    .then(() => {
      resolver = createResolver(resolver)

      if (Array.isArray(searchOrContents)) {
        return this.loadTemplates(searchOrContents)
      } else {
        return this.loadTemplates(searchOrContents)
      }
    })
    .then((templates) => {
      const result = templates.map((template) => {
        const data = template.process(context)
        return save(resolver(template.name), data)
      })

      return Promise.all(result)
    })
    .catch((error) => { throw fail(processTemplates, error) })
}

module.exports = processTemplates
