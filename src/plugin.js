const loadTemplate = require('./load-template')
const processTemplate = require('./process-template')
const processTemplates = require('./process-templates')
const registerTemplatePartial = require('./register-template-partial')
const registerTemplateHelper = require('./register-template-helper')
const normalizeOptions = require('./normalize-options')

const HandlebarsPlugin = (proto, options = {}) => {
  options = normalizeOptions(HandlebarsPlugin, options)

  const plugin = {}

  plugin.getTemplatesDir = () => options.templatesDir

  plugin.loadTemplate = loadTemplate.bind(null, options)
  plugin.processTemplate = processTemplate.bind(null, options)
  plugin.processTemplates = processTemplates.bind(null, options)

  plugin.registerTemplateHelper = registerTemplateHelper
  plugin.registerTemplatePartial = registerTemplatePartial

  Object.assign(proto, plugin)
}

const install = HandlebarsPlugin
module.exports = { install, HandlebarsPlugin }
