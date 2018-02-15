const { resolve: resolvePath, join: joinPath } = require('path')
const glob = require('globby')
const processTemplate = require('./process-template')
const resolveSourcePath = require('./resolve-source-path')
const isTemplatePath = require('./is-template-path')
const isTemplateSource = require('./is-template-source')

const processTemplates = (plugin, search, contextOrResolver, contextOrNothing) => {
  let pattern
  const options = {
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
    options.cwd = resolveSourcePath(plugin.templatesDir, options.cwd)
  } else if (isTemplatePath(pattern)) {
    options.cwd = plugin.templatesDir
  } else {
    options.cwd = '.'
  }

  let resolver
  const { cwd } = options
  if (typeof contextOrResolver === 'function') {
    resolver = contextOrResolver
  } else if (typeof contextOrResolver === 'string') {
    resolver = (fileName) => joinPath(contextOrResolver, fileName)
  } else {
    resolver = (fileName) => isTemplateSource(plugin.templatesDir, cwd) ? fileName : joinPath(cwd, fileName)
  }

  const context = typeof contextOrResolver === 'object' ? contextOrResolver : contextOrNothing || {}

  return glob(pattern, options)
    .then((files) => {
      const wait = []
      for (let i = 0; i < files.length; i++) {
        wait.push(processTemplate(resolvePath(cwd, files[i]), resolver(files[i], options), context))
      }

      return Promise.all(wait)
    })
}

module.exports = processTemplates
