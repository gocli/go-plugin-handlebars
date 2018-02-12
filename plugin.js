var resolvePath = require('path').resolve
var joinPath = require('path').join
var normalizePath = require('path').normalize
var sep = require('path').sep
var glob = require('globby')
var Handlebars = require('handlebars')
var fsPlugin = require('go-plugin-fs')

var DEFAULT_TEMPLATE_DIR = '.templates'

function installHandlebarsPlugin (proto) {
  var templateDir = DEFAULT_TEMPLATE_DIR

  function loadTemplate (templateName) {
    function createRenderFunction (template) {
      return function renderTemplate (contextOrPath, path) {
        var context

        if (typeof contextOrPath === 'string') {
          path = contextOrPath
        } else if (contextOrPath) {
          context = contextOrPath
        }

        var content = template(context)

        if (!path) return Promise.resolve(content)
        return proto.writeFile(path, content)
          .then(function () { return content })
      }
    }

    return readTemplate(templateName)
      .then(createRenderFunction)
  }

  function setTemplateDir (path) {
    path = path.trim()
    if (!path) throw new Error('specify path for template directory')

    path = normalizePath(path)
    if (path[path.length - 1] === sep) {
      path = path.slice(0, 0 - sep.length)
    }

    return templateDir = path
  }

  function getTemplateDir () {
    return templateDir
  }

  function processTemplate (path, contextOrDestPath, contextOrNothing) {
    var destPath = typeof contextOrDestPath === 'string' ? contextOrDestPath : path
    var context = typeof contextOrDestPath === 'object' ? contextOrDestPath : contextOrNothing || {}

    return loadTemplate(path)
      .then(function (template) {
        return template(context, destPath)
      })
  }

  function processTemplates (search, contextOrResolver, contextOrNothing) {
    var pattern, options = {
      gitignore: true,
      ignore: [
        '.git/**',
        '**/.git/**',
        './**/.git/**',
        'node_modules/**',
        '**/node_modules/**',
        './**/node_modules/**'
      ]
    }

    if (typeof search === 'string') {
      pattern = search
    } else {
      pattern = search.pattern || '**'
      Object.assign(options, search)
    }

    if (options.cwd) {
      options.cwd = resolveTemplatePath(options.cwd)
    } else if (!isRelativePath(pattern)) {
      options.cwd = getTemplateDir()
    } else {
      options.cwd = '.'
    }

    var resolver, cwd = options.cwd
    if (typeof contextOrResolver === 'function') {
      resolver = contextOrResolver
    } else if (typeof contextOrResolver === 'string') {
      resolver = function (fileName) { return joinPath(contextOrResolver, fileName) }
    } else {
      resolver = function (fileName) { return isTemplateSource(cwd) ? fileName : joinPath(cwd, fileName) }
    }

    var context = typeof contextOrResolver === 'object' ? contextOrResolver : contextOrNothing || {}

    return glob(pattern, options)
      .then(function (files) {
        for (var wait = [], i = 0; i < files.length; i++) {
          wait.push(processTemplate(resolvePath(cwd, files[i]), resolver(files[i], options), context))
        }

        return Promise.all(wait)
      })
  }

  function registerTemplatePartial (name, template) {
    Handlebars.registerPartial(name, template)
  }

  function registerTemplateHelper (name, renderFn) {
    Handlebars.registerHelper(name, renderFn.bind(Handlebars))
  }

  function readTemplate (templateName) {
    var path = resolveTemplatePath(templateName)

    return proto.readFile(path)
      .then(function (templateContent) {
        return Handlebars.compile(templateContent.toString())
      })
  }

  function isTemplateSource (path) {
    var templatesPath = getTemplateDir()
    return path === templatesPath || !path.indexOf(templatesPath + sep)
  }

  function resolveTemplatePath (templatePath) {
    return isRelativePath(templatePath)
      ? templatePath : joinPath(getTemplateDir(), templatePath)
  }

  function isRelativePath (path) {
    if (!path.indexOf('..' + sep)) return true
    if (!path.indexOf('.' + sep)) return true
    if (!path.indexOf(sep)) return true
    return false
  }

  proto.use(fsPlugin)

  proto.setTemplateDir = setTemplateDir
  proto.getTemplateDir = getTemplateDir
  proto.loadTemplate = loadTemplate
  proto.processTemplate = processTemplate
  proto.processTemplates = processTemplates
  proto.registerTemplatePartial = registerTemplatePartial
  proto.registerTemplateHelper = registerTemplateHelper
}

module.exports = { install: installHandlebarsPlugin }
