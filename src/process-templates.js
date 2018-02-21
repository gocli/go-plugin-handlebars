const fail = require('./fail')
const createResolver = require('./create-resolver')
const save = require('./save')

const processTemplates = function (search, context = {}, resolver = '') {
  return Promise.resolve()
    .then(() => {
      resolver = createResolver(resolver)
      return this.loadTemplates(search)
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
