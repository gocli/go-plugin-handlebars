const Handlebars = require('handlebars')

const registerTemplateHelper = (name, renderFn) => {
  Handlebars.registerHelper(name, renderFn.bind(Handlebars))
}

module.exports = registerTemplateHelper
