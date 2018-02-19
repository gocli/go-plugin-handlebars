const test = require('ava')
const HandlebarsPlugin = require('../src/plugin')

const templatesDir = './.templates'
const customDir = './.custom-templates'

test('constructor exports all methods', t => {
  const apiMethods = [
    'getTemplatesDir',
    'loadTemplates',
    'loadTemplatesSync',
    'processTemplates',
    'processTemplatesSync',
    'registerTemplateHelper',
    'registerTemplatePartial'
  ]

  const go = {}
  HandlebarsPlugin.install(go)

  apiMethods.forEach(method => {
    t.is(typeof go[method], 'function', `${method} is not a function`)
  })

  t.deepEqual(Object.keys(go).sort(), apiMethods.sort())
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
