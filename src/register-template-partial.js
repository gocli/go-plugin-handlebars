import Handlebars from 'handlebars'

const registerTemplatePartial = (name, template) => {
  Handlebars.registerPartial(name, template)
}

export default registerTemplatePartial
