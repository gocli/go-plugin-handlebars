const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const fs = require('fs-extra')
const { resolve, join, sep } = require('path')

const uid = () => (uid.id = (uid.id || Math.round(Math.random() * 1e9)) + 1)

const HandlebarsPlugin = require('../src/plugin')

const root = process.cwd()
const testsDir = resolve('./tests')
const templatesDir = './.templates'

const go = {}
HandlebarsPlugin.install(go)

const context = { name: 'Go' }
const M = '{{ name }}'
const nestedFolder = 'n'
const [ fileA, fileB, fileNA, fileNB ] = [ 'a.tmp', 'b.tmp', join(nestedFolder, 'na.tmp'), join(nestedFolder, 'nb.tmp') ]
const fixtures = {
  [fileA]: `a file ${M}`,
  [fileB]: `b file ${M}`,
  [fileNA]: `na file ${M}`,
  [fileNB]: `nb file ${M}`
}

const saveFixtures = (dir) => {
  fs.ensureDirSync(dir)
  for (let file in fixtures) {
    fs.outputFileSync(join(dir, file), fixtures[file])
  }
}

const ptsPath = '../src/process-templates-sync'
const ptPath = '../src/process-templates'

const importPts = () => {
  const save = { sync: sinon.spy() }
  const pts = proxyquire(ptsPath, { './save': save })
  return { save, pts }
}

const importPt = () => {
  const save = sinon.spy(() => Promise.resolve())
  const pt = proxyquire(ptPath, { './save': save })
  return { save, pt }
}

test.before(() => {
  fs.ensureDirSync(testsDir)
  process.chdir(testsDir)

  saveFixtures(templatesDir)
})

test.after(() => {
  process.chdir(root)
  fs.removeSync(testsDir)
})

test('processTemplatesSync: literal', t => {
  const { save, pts } = importPts()

  const contents = [
    { name: `${uid()}.tmp`, content: `content-${M}-${uid()}` },
    { name: `d-${uid()}/${uid()}.tmp`, content: `content-${M}-${uid()}` }
  ]

  pts.call(go, contents, context)

  t.truthy(save.sync.calledTwice, `called ${save.sync.callCount} times`)
  t.is(save.sync.firstCall.args[0], contents[0].name)
  t.is(save.sync.firstCall.args[1], contents[0].content.replace(M, context.name))
  t.is(save.sync.secondCall.args[0], contents[1].name)
  t.is(save.sync.secondCall.args[1], contents[1].content.replace(M, context.name))
})

test('processTemplates: literal', async t => {
  const { save, pt } = importPt()

  const contents = [
    { name: `${uid()}.tmp`, content: `content-${M}-${uid()}` },
    { name: `d-${uid()}/${uid()}.tmp`, content: `content-${M}-${uid()}` }
  ]

  await pt.call(go, contents, context)

  t.truthy(save.calledTwice, `called ${save.callCount} times`)
  t.is(save.firstCall.args[0], contents[0].name)
  t.is(save.firstCall.args[1], contents[0].content.replace(M, context.name))
  t.is(save.secondCall.args[0], contents[1].name)
  t.is(save.secondCall.args[1], contents[1].content.replace(M, context.name))
})

test('processTemplatesSync: **', t => {
  const { save, pts } = importPts()

  pts.call(go, '**', context)

  const files = Object.keys(fixtures)
  t.is(save.sync.callCount, files.length)
  save.sync.args.forEach(([file, content]) => {
    t.is(fixtures[file].replace(M, context.name), content)
  })
})

test('processTemplates: **', async t => {
  const { save, pt } = importPt()

  await pt.call(go, '**', context)

  const files = Object.keys(fixtures)
  t.is(save.callCount, files.length)
  save.args.forEach(([file, content]) => {
    t.is(fixtures[file].replace(M, context.name), content)
  })
})

test('processTemplatesSync: {}', t => {
  const { save, pts } = importPts()

  pts.call(go, {}, context)

  const files = Object.keys(fixtures)
  t.is(save.sync.callCount, files.length)
  save.sync.args.forEach(([file, content]) => {
    t.is(fixtures[file].replace(M, context.name), content)
  })
})

test('processTemplates: {}', async t => {
  const { save, pt } = importPt()

  await pt.call(go, {}, context)

  const files = Object.keys(fixtures)
  t.is(save.callCount, files.length)
  save.args.forEach(([file, content]) => {
    t.is(fixtures[file].replace(M, context.name), content)
  })
})

test('processTemplatesSync: {cwd}', t => {
  const { save, pts } = importPts()

  pts.call(go, { cwd: nestedFolder }, context)

  const files = Object.keys(fixtures).filter(file => file.startsWith(nestedFolder + sep))
  t.is(save.sync.callCount, files.length)
  save.sync.args.forEach(([file, content]) => {
    t.is(fixtures[join(nestedFolder, file)].replace(M, context.name), content)
  })
})

test('processTemplates: {cwd}', async t => {
  const { save, pt } = importPt()

  await pt.call(go, { cwd: nestedFolder }, context)

  const files = Object.keys(fixtures).filter(file => file.startsWith(nestedFolder + sep))
  t.is(save.callCount, files.length)
  save.args.forEach(([file, content]) => {
    t.is(fixtures[join(nestedFolder, file)].replace(M, context.name), content)
  })
})

test('processTemplatesSync: {cwd} (relative)', t => {
  const { save, pts } = importPts()

  const cwd = `./d-${uid()}`
  saveFixtures(cwd)

  pts.call(go, { cwd }, context)

  const files = Object.keys(fixtures)
  t.is(save.sync.callCount, files.length)
  save.sync.args.forEach(([file, content]) => {
    t.truthy(fixtures[file], `${file} not match`)
    t.is(fixtures[file].replace(M, context.name), content)
  })
})

test('processTemplates: {cwd} (relative)', async t => {
  const { save, pt } = importPt()

  const cwd = `./d-${uid()}`
  saveFixtures(cwd)

  await pt.call(go, { cwd }, context)

  const files = Object.keys(fixtures)
  t.is(save.callCount, files.length)
  save.args.forEach(([file, content]) => {
    t.truthy(fixtures[file], `${file} not match`)
    t.is(fixtures[file].replace(M, context.name), content)
  })
})

test('processTemplatesSync: relative match', t => {
  const { save, pts } = importPts()

  const cwd = '.' + sep + `d-${uid()}`
  saveFixtures(cwd)

  pts.call(go, cwd + sep + '**', context)

  const files = Object.keys(fixtures)
  t.is(save.sync.callCount, files.length)
  save.sync.args.forEach(([file, content]) => {
    t.truthy(file.startsWith(cwd))
    t.truthy(fixtures[file.slice(cwd.length + 1)], `${file} not match`)
    t.is(fixtures[file.slice(cwd.length + 1)].replace(M, context.name), content)
  })
})

test('processTemplates: relative match', async t => {
  const { save, pt } = importPt()

  const cwd = '.' + sep + `d-${uid()}`
  saveFixtures(cwd)

  await pt.call(go, cwd + sep + '**', context)

  const files = Object.keys(fixtures)
  t.is(save.callCount, files.length)
  save.args.forEach(([file, content]) => {
    t.truthy(file.startsWith(cwd))
    t.truthy(fixtures[file.slice(cwd.length + 1)], `${file} not match`)
    t.is(fixtures[file.slice(cwd.length + 1)].replace(M, context.name), content)
  })
})

test('processTemplatesSync: files match', t => {
  const { save, pts } = importPts()

  pts.call(go, '*.tmp', context)

  const files = Object.keys(fixtures).filter(file => !file.startsWith(nestedFolder + sep))
  t.is(save.sync.callCount, files.length)
  save.sync.args.forEach(([file, content]) => {
    t.truthy(fixtures[file], `${file} not match`)
    t.is(fixtures[file].replace(M, context.name), content)
  })
})

test('processTemplates: files match', async t => {
  const { save, pt } = importPt()

  await pt.call(go, '*.tmp', context)

  const files = Object.keys(fixtures).filter(file => !file.startsWith(nestedFolder + sep))
  t.is(save.callCount, files.length)
  save.args.forEach(([file, content]) => {
    t.truthy(fixtures[file], `${file} not match`)
    t.is(fixtures[file].replace(M, context.name), content)
  })
})

test('processTemplatesSync: resolvers', t => {
  const { save, pts } = importPts()

  pts.call(go, 'a.tmp', context)
  t.truthy(save.sync.lastCall.calledWith('a.tmp'))

  pts.call(go, 'n/na.tmp', context)
  t.truthy(save.sync.lastCall.calledWith('n/na.tmp'))

  const cwd = `./d-${uid()}`
  saveFixtures(cwd)

  pts.call(go, `${cwd}${sep}a.tmp`, context)
  t.truthy(save.sync.lastCall.calledWith(`${cwd}${sep}a.tmp`))

  pts.call(go, { pattern: 'a.tmp', cwd }, context)
  t.truthy(save.sync.lastCall.calledWith('a.tmp'))

  pts.call(go, 'a.tmp', context, () => 'test')
  t.truthy(save.sync.lastCall.calledWith('test'))

  pts.call(go, { pattern: 'a.tmp', cwd }, context, () => 'test')
  t.truthy(save.sync.lastCall.calledWith('test'))

  pts.call(go, 'a.tmp', context, 'folder')
  t.truthy(save.sync.lastCall.calledWith('folder/a.tmp'))

  pts.call(go, { pattern: 'a.tmp', cwd }, context, 'folder')
  t.truthy(save.sync.lastCall.calledWith('folder/a.tmp'))
})

test('processTemplates: resolvers', async t => {
  const { save, pt } = importPt()

  await pt.call(go, 'a.tmp', context)
  t.truthy(save.lastCall.calledWith('a.tmp'))

  await pt.call(go, 'n/na.tmp', context)
  t.truthy(save.lastCall.calledWith('n/na.tmp'))

  const cwd = `./d-${uid()}`
  saveFixtures(cwd)

  await pt.call(go, `${cwd}${sep}a.tmp`, context)
  t.truthy(save.lastCall.calledWith(`${cwd}${sep}a.tmp`))

  await pt.call(go, { pattern: 'a.tmp', cwd }, context)
  t.truthy(save.lastCall.calledWith('a.tmp'))

  await pt.call(go, 'a.tmp', context, () => 'test')
  t.truthy(save.lastCall.calledWith('test'))

  await pt.call(go, { pattern: 'a.tmp', cwd }, context, () => 'test')
  t.truthy(save.lastCall.calledWith('test'))

  await pt.call(go, 'a.tmp', context, 'folder')
  t.truthy(save.lastCall.calledWith('folder/a.tmp'))

  await pt.call(go, { pattern: 'a.tmp', cwd }, context, 'folder')
  t.truthy(save.lastCall.calledWith('folder/a.tmp'))
})
