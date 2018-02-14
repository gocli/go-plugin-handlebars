import isRelativePath from './is-relative-path'
import { join as joinPath } from 'path'

const resolveTemplatePath = (templateDir, templatePath) => {
  return isRelativePath(templatePath)
    ? templatePath : joinPath(templateDir, templatePath)
}

export default resolveTemplatePath
