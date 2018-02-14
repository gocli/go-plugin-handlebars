import Handlebars from 'handlebars'

const registerTemplateHelper = (name, renderFn) => {
  Handlebars.registerHelper(name, renderFn.bind(Handlebars))
}

export default registerTemplateHelper
