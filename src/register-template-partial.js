const Handlebars = require('handlebars')

const registerTemplatePartial = (name, template) => {
  Handlebars.registerPartial(name, template)
}

module.exports = registerTemplatePartial
