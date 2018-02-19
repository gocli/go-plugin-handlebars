const { outputFile, outputFileSync } = require('fs-extra')

const save = (path, content) => outputFile(path, content)
save.sync = (path, content) => outputFileSync(path, content)

module.exports = save
