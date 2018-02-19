const fail = require('./fail')
const createResolver = require('./create-resolver')
const save = require('./save')

const processTemplatesSync = function (searchOrContents = {}, context = {}, resolver = '') {
  try {
    resolver = createResolver(resolver)

    const templates = this.loadTemplatesSync(searchOrContents)

    templates.forEach((template) => {
      const data = template.process(context)
      save.sync(resolver(template.name), data)
    })
  } catch (error) {
    throw fail(processTemplatesSync, error)
  }
}

module.exports = processTemplatesSync
