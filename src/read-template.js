import Handlebars from 'handlebars'
import resolveTemplatePath from './resolve-template-path'

const readTemplate = (proto, templateName) => {
  const path = resolveTemplatePath(proto.getTemplateDir(), templateName)

  return proto.readFile(path)
    .then((templateContent) => Handlebars.compile(templateContent.toString()))
}

export default readTemplate
