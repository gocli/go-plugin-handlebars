// TODO: remove setTemplateDir and use plugin options instead

import { sep, normalize as normalizePath } from 'path'
import FsPlugin from 'go-plugin-fs'
import loadTemplate from './load-template'
import processTemplate from './process-template'
import processTemplates from './process-templates'
import registerTemplatePartial from './register-template-partial'
import registerTemplateHelper from './register-template-helper'

const DEFAULT_TEMPLATE_DIR = '.templates'

const HandlebarsPlugin = (proto) => {
  let templateDir = DEFAULT_TEMPLATE_DIR

  const getTemplateDir = () => templateDir

  const setTemplateDir = (path) => {
    path = path.trim()
    if (!path) throw new Error('specify path for template directory')

    path = normalizePath(path)
    if (path[path.length - 1] === sep) {
      path = path.slice(0, 0 - sep.length)
    }

    templateDir = path

    return templateDir
  }

  proto.use(FsPlugin)

  proto.setTemplateDir = setTemplateDir
  proto.getTemplateDir = getTemplateDir
  proto.processTemplate = processTemplate.bind(0, proto)
  proto.processTemplates = processTemplates.bind(0, proto)
  proto.loadTemplate = loadTemplate.bind(0, proto)
  proto.registerTemplatePartial = registerTemplatePartial
  proto.registerTemplateHelper = registerTemplateHelper
}

const install = HandlebarsPlugin
export { install, HandlebarsPlugin }
