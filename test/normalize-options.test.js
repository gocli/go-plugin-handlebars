const test = require('ava')
const normalizeOptions = require('../src/normalize-options')

const templatesDir = './.templates'
const customDir = './.custom-templates'

test('normalizeOptions', t => {
  t.deepEqual(normalizeOptions(), { templatesDir })
  t.deepEqual(normalizeOptions(null, {}), { templatesDir })
  t.deepEqual(normalizeOptions(null, { templatesDir: customDir }), { templatesDir: customDir })
  t.throws(() => normalizeOptions(null, { templatesDir: null }), '`templatesDir` should be a string')
})
