const Handlebars = require('handlebars')

const createTemplate = content =>
  Handlebars.compile(content.toString())

module.exports = createTemplate
