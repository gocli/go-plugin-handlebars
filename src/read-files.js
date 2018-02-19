const globby = require('globby')
const { join } = require('path')
const { readFile, readFileSync } = require('fs-extra')

const readFiles = (search) =>
  globby(search.pattern, search)
    .then((files) => {
      return files.map((file) => {
        return readFile(join(search.cwd, file))
          .then((content) => ({ name: file, content }))
      })
    })
    .then((reading) => Promise.all(reading))

readFiles.sync = (search) =>
  globby.sync(search.pattern, search)
    .map((name) => ({ name, content: readFileSync(join(search.cwd, name)) }))

module.exports = readFiles
