const normalizeOptions = require('./normalize-options')
const loadTemplates = require('./load-templates')
const loadTemplatesSync = require('./load-templates-sync')
const processTemplates = require('./process-templates')
const processTemplatesSync = require('./process-templates-sync')
const registerTemplatePartial = require('./register-template-partial')
const registerTemplateHelper = require('./register-template-helper')

const HandlebarsPlugin = (proto, options = {}) => {
  options = normalizeOptions(HandlebarsPlugin, options)

  proto.getTemplatesDir = () => options.templatesDir

  proto.loadTemplates = loadTemplates.bind(proto)
  proto.loadTemplatesSync = loadTemplatesSync.bind(proto)

  proto.processTemplates = processTemplates.bind(proto)
  proto.processTemplatesSync = processTemplatesSync.bind(proto)

  proto.registerTemplateHelper = registerTemplateHelper
  proto.registerTemplatePartial = registerTemplatePartial
}

const install = HandlebarsPlugin
module.exports = { install, HandlebarsPlugin }
