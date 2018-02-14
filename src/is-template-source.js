import { sep } from 'path'

const isTemplateSource = (templateDir, path) => {
  const templatesPath = templateDir
  return path === templatesPath || !path.indexOf(templatesPath + sep)
}

export default isTemplateSource
