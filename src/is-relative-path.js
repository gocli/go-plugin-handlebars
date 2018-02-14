import { sep } from 'path'

const isRelativePath = (path) => {
  if (!path.indexOf('..' + sep)) return true
  if (!path.indexOf('.' + sep)) return true
  if (!path.indexOf(sep)) return true
  return false
}

export default isRelativePath
