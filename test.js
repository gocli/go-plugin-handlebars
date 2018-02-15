import test from 'ava'
import fs from 'fs-extra'
import { sep } from 'path'
import HandlebarsPlugin from './src/plugin'
import normalizeOptions from './src/normalize-options'
import isTemplatePath from './src/is-template-path'
import resolveSourcePath from './src/resolve-source-path'
import isTemplateSource from './src/is-template-source'
import readTemplate from './src/read-template'
import loadTemplate from './src/load-template'

// Prepare environment

const root = process.cwd()
const testsDir = 'tests'
const templatesDir = '.templates'
const customDir = '.custom-templates'

const M = '{{ name }}'
const [ fileA, fileB, fileNA, fileNB ] = [ 'a.tmp', 'b.tmp', 'n/na.tmp', 'n/nb.tmp' ]
const fixtures = {
  [fileA]: `a file ${M}`,
  [fileB]: `b file ${M}`,
  [fileNA]: `na file ${M}`,
  [fileNB]: `nb file ${M}`
}

const context = { name: 'Go' }

test.before(() => {
  fs.ensureDirSync(testsDir)
  process.chdir(testsDir)

  fs.ensureDirSync(templatesDir)
  fs.ensureDirSync(customDir)

  for (let file in fixtures) {
    fs.outputFileSync(templatesDir + sep + file, fixtures[file])
  }
})

test.after(() => {
  process.chdir(root)
  fs.removeSync(testsDir)
})

// Helpers

test('normalizeOptions', t => {
  t.deepEqual(normalizeOptions(), { templatesDir })
  t.deepEqual(normalizeOptions(null, {}), { templatesDir })
  t.deepEqual(normalizeOptions(null, { templatesDir: customDir }), { templatesDir: customDir })
  t.throws(() => normalizeOptions(null, { templatesDir: null }), '`templatesDir` should be a string')
})

test('isTemplatePath', t => {
  t.is(true, isTemplatePath('d'), 'folder')
  t.is(true, isTemplatePath('d/file'), 'file in folder')
  t.is(true, isTemplatePath('.file'), 'file starting with dot')
  t.is(true, isTemplatePath('..file'), 'file starting with two dots')
  t.is(true, isTemplatePath('~file'), 'file starting with tilda')
  t.is(false, isTemplatePath('.'), 'current folder')
  t.is(false, isTemplatePath('./'), 'current folder with slash')
  t.is(false, isTemplatePath('./file'), 'file in current folder')
  t.is(false, isTemplatePath('..'), 'parent folder')
  t.is(false, isTemplatePath('../'), 'parent folder with slash')
  t.is(false, isTemplatePath('../file'), 'file in parent folder')
  t.is(false, isTemplatePath('~'), 'users folder')
  t.is(false, isTemplatePath('~/'), 'users folder with slash')
  t.is(false, isTemplatePath('~/file'), 'file in users folder')
})

test('isTemplatePath (OS specific)', t => {
  if (process.platform === 'win32') {
    // Windows
    t.is(false, isTemplatePath('C:'), 'windows disk')
    t.is(false, isTemplatePath('c:'), 'windows disk (lowercased)')
    t.is(false, isTemplatePath('x:'), 'windows disk x')
    t.is(false, isTemplatePath('c:\\'), 'windows disk with backslashes')
    t.is(false, isTemplatePath('\\\\'), 'windows backslashes')
  } else {
    // Unix
    t.is(false, isTemplatePath('/'), 'root folder')
    t.is(false, isTemplatePath('/file'), 'file in root folder')
  }
})

test('resolveSourcePath', t => {
  t.is(resolveSourcePath(templatesDir, 'file'), templatesDir + sep + 'file')
  t.is(resolveSourcePath(templatesDir, 'd/file'), templatesDir + sep + 'd/file')
  t.is(resolveSourcePath(templatesDir, './file'), './file')
})

test('isTemplateSource', t => {
  t.is(true, isTemplateSource(templatesDir, templatesDir))
  t.is(true, isTemplateSource(templatesDir, templatesDir + '/file'))
  t.is(false, isTemplateSource(templatesDir, customDir))
  t.is(false, isTemplateSource(templatesDir, templatesDir + '-suffix'))
})

test('readTemplate', async t => {
  const template = await readTemplate(templatesDir, fileA)
  t.is(typeof template, 'function')
  t.is(template(context), fixtures[fileA].replace(M, context.name))

  const templateFile = './file-for-readTemplate-test'
  const content = fixtures[fileB]
  fs.outputFileSync(templateFile, content)
  const template2 = await readTemplate(templatesDir, templateFile)
  t.is(template2(context), content.replace(M, context.name))
})

// Constructor

test('constructor exports all methods', t => {
  const apiMethods = [
    'getTemplatesDir',
    'loadTemplate',
    'processTemplate',
    'processTemplates',
    'registerTemplateHelper',
    'registerTemplatePartial'
  ]

  const go = {}
  HandlebarsPlugin.install(go)

  apiMethods.forEach(method => {
    t.is(typeof go[method], 'function', `method ${method} is not exported`)
  })

  t.deepEqual(Object.keys(go).sort(), apiMethods)
})

test('constructor options', t => {
  const [ go1, go2, go3 ] = [ {}, {}, {} ]
  HandlebarsPlugin.install(go1)
  HandlebarsPlugin.install(go2, {})
  HandlebarsPlugin.install(go3, { templatesDir: customDir })

  t.is(go1.getTemplatesDir(), templatesDir)
  t.is(go2.getTemplatesDir(), templatesDir)
  t.is(go3.getTemplatesDir(), customDir)
})

// Load Tempaltes

test('load template', async t => {
  const template = await loadTemplate({ templatesDir }, fileA)
  t.is(typeof template, 'function')

  t.is(await template({}), fixtures[fileA].replace(M, ''))
  t.is(await template(context), fixtures[fileA].replace(M, context.name))
  t.fail('far not everything is tested')
})

test.todo('processTemplate')
test.todo('processTemplates')
test.todo('registerTemplateHelper')
test.todo('registerTemplatePartial')
