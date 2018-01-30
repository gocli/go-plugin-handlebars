# go-plugin-handlebars [![npm](https://img.shields.io/npm/v/go-plugin-handlebars.svg?style=flat-square)](https://www.npmjs.com/package/go-plugin-handlebars)

[Go](https://www.npmjs.com/package/go) plugin to apply [Handlebars](http://handlebarsjs.com/) to files

## Usage

```bash
$ npm install go go-plugin-handlebars
```

```js
const go = require('go')
go.use(require('go-plugin-handlebars'))
```

## API

### Get root directory for templates

```js
var /* string */ templatesDirectory = go.getTemplateDir() // default: "./templates"
```

### Set root directory for templates

```js
var /* string */ normalizedTemplatesDirectory = go.setTemplateDir( /* string */ templatesPath )
```

### Load template to use it multiple times

```js
// If `templateName` is a relative path it will be resolved from project root directory
var templateName = './relative/path' // resolve as: <project_dir>/relative/path

// Or otherwise it will be loaded from templates directory (by default, from `./.templates`)
var templateName = 'not/relative/path' // resolve as: <project_dir>/<templates_dir>/relative/path

var /* function */ renderTemplate = await go.loadTemplate( /* string */ templateName )

// renders template with context object and resolves with the resulting string
var /* string */ content = await renderTemplate( /* object */ context )

// renders template with empty context and write the result to `path`
var /* string */ content = await renderTemplate( /* string */ path )

// renders template with context object and write the result to `path`
var /* string */ content = await renderTemplate( /* object */ context, /* string */ path )
```

### Process file with Handlebars and write it

```js
// loads the file, renders it as a template with the context object and writes it to the same path
await go.processTemplate(
  /* string */ filePath,
  /* optional string */ destinationPath,
  /* optional object */ context
)
```

### Apply Handlebars to multiple files

```js
await go.processTemplates(
  /* string|object */ filesPattern,
  /* optional string|function */ destinationPath,
  /* optional object */ context
)
```

This will need a little longer description…

#### Process files from the templates directory and write them to the project directory

We can process all files in the templates directory and write it to project directory

```js
await go.processTemplates('**', '.', context)
```

Or we can process all files in the project directory and rewrite it with resulted files

```js
await go.processTemplates('./**', context)
```

Just like with `require()` function in NodeJS it is very important if pattern starts with `/`, `./`, `../` or not. In case if it starts with one of listed partials, files will be searched starting from root project directory (where `gofile.js` is located), otherwise search will start from [templates directory](#get-root-directory-for-templates).

In case if `cwd` option is passed the behavior will change a [little](#optionscwd-and-templates-directory).

#### Passing search options

To use more out of searching object can be passed as first argument. In this case pattern can be specified as the `options.pattern` property (will be set to `**` if not given):

```js
await go.processTemplates({
  pattern: '**',
  cwd: './fixtures', // search in fixtures directory
  dot: true, // search through dot-prefixed files and folders
  ignore: [ 'node_modules/**' ] // ignore node_modules directory
}, context)
```

To learn more about search options read [globby docs](https://www.npmjs.com/package/globby#options) and [glob docs](https://www.npmjs.com/package/glob#options).

Default options are extended in `go-plugin-handlebars` with next object:

```js
{
  gitignore: true, // to ignore files mentioned in .gitignore during the search
  ignore: [
    '.git/**', '**/.git/**', './**/.git/**', // to ignore any .git folder
    'node_modules/**', '**/node_modules/**', './**/node_modules/**' // to ignore any node_modules folder
  ]
}
```

#### `options.cwd` and templates direcory

The same rules about relative paths are applied to `cwd` as for [search pattern](#process-files-from-the-templates-directory-and-write-them-to-the-project-directory). At the same time, when `options.cwd` is used, `options.pattern` will be always relative to the value of `cwd` option.

```js
// this will look inside of templates directory for fixtures/ folder
await go.processTemplates({
  cwd: 'fixtures',
  pattern: '**',
}, destinationPath, context)

// but this will look for fixtures/ folder in the root of the project because of './' in `options.cwd`
await go.processTemplates({
  cwd: './fixtures',
  pattern: '**',
}, destinationPath, context)
```

`cwd` option plays another important role: it is ignored in filenames when saving them:

```js
// ./fixtures/inner/file will be saved to ./src/fixtures/file
await go.processTemplates('./fixtures/inner/**', 'src', { /* context */ })

// ./fixtures/inner/file will be saved to ./src/inner/file
await go.processTemplates({ pattern: '**', cwd: './fixtures' }, 'src', { /* context */ })
```

#### Saving files

There are several options how to save files:

```js
// process files in app/ folder and rewrite them with resulted files
await go.processTemplates('./app', { /* context */ })

// process files from components/ folder and save resulted files to app/ folder
await go.processTemplates('./components', 'app', { /* context */ })

// process files from template/ folder and save them to the path generated by function called for each of the file
await go.processTemplates('./template', (filePath, options) => `app/${filePath.toLowerCase()}`, { /* context */ })

// process files from <getTemplatsDir()> and save them to app folder
await go.processTemplates('components', 'app', { /* context */ })

// when destination path is not specified, and the source is from templates directory, files will be saved to project folder
await go.processTemplates('components', { /* context */ })

// the same behavior as for an example line above: the content of <getTemplatsDir()>/fixtures will be saved to project folder
await go.processTemplates({ cwd: 'fixtures' }, { /* context */ })
```

---

To see kind of patterns that can be used for searching files follow [globbing patterns](https://www.npmjs.com/package/globby#globbing-patterns) and make sure to read about [expandDirectory](https://www.npmjs.com/package/globby#expanddirectories) feature.

### Register [Handlebars partials](http://handlebarsjs.com/partials.html)

```js
go.registerTemplatePartial( /* string */ name, /* string */ template )
```

### Register [Handlebars helpers](http://handlebarsjs.com/block_helpers.html)

```js
go.registerTemplateHelper( /* string */ name, /* function */ renderFn )
```

## Examples

### README.md template

#### .templates/README.md

```md
# {{ name }}

{{ description }}

MIT © {{ year }}
```

#### gofile.js

```js
var go = require('go')
go.use(require('go-plugin-handlebars'))

var context = {
  name: 'new repository',
  description: 'here will be more text soon',
  year: (new Date).getFullYear()
}

go.loadTemplate('README.md')
  .then(function (renderReadme) {
    renderReadme(context, 'README.md')
  })
```

#### Execute

```bash
$ node gofile.js
```

### Process files from project directory

#### .templates/config/dev.json

```json
{
  "port": "{{ port }}",
  "host": "{{ host }}"
}
```

#### gofile.js

```js
var go = require('go')
go.use(require('go-plugin-handlebars'))

go.setTemplateDir('.templates')

var context = {
  port: process.env.PORT || 8080,
  host: process.env.HOST || 'localhost'
}

go.processTemplate('config/dev.json', 'app', context)
```

#### Execute

```bash
$ node gofile.js
```

#### app/config/dev.json

```json
{
  "port": "8080",
  "host": "localhost"
}
```

### Process multiple files at the same time

Read ["Apply Handlebars to multiple files"](#apply-handlebars-to-multiple-files) section for the information on `go.processTemplates()`

### More

For more examples on template syntax read [Handlebars documentation](http://handlebarsjs.com/)

## License

MIT © [Stanislav Termosa](https://github.com/termosa)

