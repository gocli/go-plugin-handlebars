const test = require('ava')
const isCompletePath = require('../src/is-complete-path')

test('isCompletePath', t => {
  t.is(false, isCompletePath('d'), 'folder')
  t.is(false, isCompletePath('d/file'), 'file in folder')
  t.is(false, isCompletePath('.file'), 'file starting with dot')
  t.is(false, isCompletePath('..file'), 'file starting with two dots')
  t.is(false, isCompletePath('~file'), 'file starting with tilda')
  t.is(true, isCompletePath('.'), 'current folder')
  t.is(true, isCompletePath('./'), 'current folder with slash')
  t.is(true, isCompletePath('./file'), 'file in current folder')
  t.is(true, isCompletePath('..'), 'parent folder')
  t.is(true, isCompletePath('../'), 'parent folder with slash')
  t.is(true, isCompletePath('../file'), 'file in parent folder')
  t.is(true, isCompletePath('~'), 'users folder')
  t.is(true, isCompletePath('~/'), 'users folder with slash')
  t.is(true, isCompletePath('~/file'), 'file in users folder')
})

test('isCompletePath (OS specific)', t => {
  if (process.platform === 'win32') {
    // Windows
    t.is(true, isCompletePath('C:'), 'windows disk')
    t.is(true, isCompletePath('c:'), 'windows disk (lowercased)')
    t.is(true, isCompletePath('x:'), 'windows disk x')
    t.is(true, isCompletePath('c:\\'), 'windows disk with backslashes')
    t.is(true, isCompletePath('\\\\'), 'windows backslashes')
  } else {
    // Unix
    t.is(true, isCompletePath('/'), 'root folder')
    t.is(true, isCompletePath('/file'), 'file in root folder')
  }
})
