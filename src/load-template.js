import readTemplate from './read-template'

const loadTemplate = (proto, templateName) => {
  const createRenderFunction = (template) => {
    return (contextOrPath, path) => {
      let context

      if (typeof contextOrPath === 'string') {
        path = contextOrPath
      } else if (contextOrPath) {
        context = contextOrPath
      }

      const content = template(context)

      if (!path) return Promise.resolve(content)
      return proto.writeFile(path, content)
        .then(() => content)
    }
  }

  return readTemplate(proto, templateName)
    .then(createRenderFunction)
}

export default loadTemplate
