const resolveSourcePath = require('./resolve-source-path')
const isCompletePath = require('./is-complete-path')

const createSearch = (search, templatesDir) => {
  const options = {
    pattern: '**',
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

  Object.assign(options, typeof search === 'object' ? search : { pattern: search })

  options.cwd = options.cwd
    ? resolveSourcePath(templatesDir, options.cwd)
    : isCompletePath(options.pattern) ? '.' : resolveSourcePath(templatesDir)

  return options
}

module.exports = createSearch
