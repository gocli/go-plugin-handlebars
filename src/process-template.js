import loadTemplate from './load-template'

const processTemplate = (proto, path, contextOrDestPath, contextOrNothing) => {
  const destPath = typeof contextOrDestPath === 'string' ? contextOrDestPath : path
  const context = typeof contextOrDestPath === 'object' ? contextOrDestPath : contextOrNothing || {}

  return loadTemplate(proto, path)
    .then((template) => template(context, destPath))
}

export default processTemplate
