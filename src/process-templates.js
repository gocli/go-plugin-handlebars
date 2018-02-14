import {
  resolve as resolvePath,
  join as joinPath
} from 'path'
import glob from 'globby'
import processTemplate from './process-template'
import resolveTemplatePath from './resolve-template-path'
import isRelativePath from './is-relative-path'
import isTemplateSource from './is-template-source'

const processTemplates = (proto, search, contextOrResolver, contextOrNothing) => {
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
    options.cwd = resolveTemplatePath(proto.getTemplateDir(), options.cwd)
  } else if (!isRelativePath(pattern)) {
    options.cwd = proto.getTemplateDir()
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
    resolver = (fileName) => isTemplateSource(proto.getTemplateDir(), cwd) ? fileName : joinPath(cwd, fileName)
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

export default processTemplates
