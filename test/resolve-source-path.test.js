const test = require('ava')
const { join } = require('path')
const resolveSourcePath = require('../src/resolve-source-path')

const templatesDir = './.templates'

test('resolveSourcePath', t => {
  t.is(resolveSourcePath(templatesDir), join('.', templatesDir))
  t.is(resolveSourcePath(templatesDir, 'f'), join(templatesDir, 'f'))
  t.is(resolveSourcePath(templatesDir, 'd/f'), join(templatesDir, 'd/f'))
  t.is(resolveSourcePath(templatesDir, 'd', 'f'), join(templatesDir, 'd', 'f'))
  t.is(resolveSourcePath(templatesDir, 'd', './f'), join(templatesDir, 'd', 'f'))
  t.is(resolveSourcePath(templatesDir, './f'), join('./f'))
  t.is(resolveSourcePath(templatesDir, '../f'), join('../f'))
  t.is(resolveSourcePath(templatesDir, '~/f'), join('~/f'))
  t.is(resolveSourcePath(templatesDir, './d'), join('./d'))
  t.is(resolveSourcePath(templatesDir, './d', 'f'), join('./d', 'f'))
})
