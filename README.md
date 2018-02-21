# go-plugin-handlebars [![npm](https://img.shields.io/npm/v/go-plugin-handlebars.svg?style=flat-square)](https://www.npmjs.com/package/go-plugin-handlebars) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square)](https://github.com/gocli/go-plugin-handlebars) [![Travis](https://img.shields.io/travis/gocli/go-plugin-cli.svg?style=flat-square)](https://travis-ci.org/gocli/go-plugin-handlebars)

[Go](https://www.npmjs.com/package/go) plugin to apply [Handlebars](http://handlebarsjs.com/) to files

## Table of Contents

- [Usage](#usage)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
- [Constructor Options](#constructor-options)
- [API Reference](#api-reference)
  - [go.getTemplatesDir](#gogettemplatesdir)
  - [go.loadTemplates](#goloadtemplates)
  - [go.processTemplates](#goprocesstemplates)
  - [go.registerTemplateHelper](#goregistertemplatehelper)
  - [go.registerTemplatePartial](#goregistertemplatepartial)
  - [template](#template)
- [Entities](#entities)
  - [search](#search)
  - [context](#context)
  - [resolver](#resolver)
- [Path Resolution](#path-resolution)
- [Examples](#examples)
- [License](#license)

## Usage

### Installation

```bash
$ npm install go go-plugin-handlebars
```

```js
const go = require('go')
go.use(require('go-plugin-handlebars'))

// or

import go from 'go'
import { HandlebarsPlugin } from 'go-plugin-handlebars'
go.use(HandlebarsPlugin)
```

### Quick Start

Handlebars Plugin can apply [Handlebars](http://handlebarsjs.com/) to files or to given arguments. The simplest example is to process a file:

```html
<!-- ./src/index.html -->
<!doctype html>
<meta charset="utf8">
<title>{{ pageTitle }}</title>

<h1>{{ pageTitle }}</h1>
<h2>{{ shortDescription }}</h2>
```

```js
go.processTemplates('./src/index.html', {
  pageTitle: 'Test Page',
  shortDescription: 'meaningless text to be inserted'
})
```

> Make sure to use dot (`./`) at the beginning of the template path in this example. You can read more about [path resolving here](#search).

As a result of execution file `./src/index.html` will be replaced by file processed by Handlebars with the given context:

```html
<!-- src/index.html -->
<!doctype html>
<meta charset="utf8">
<title>Test Page</title>

<h1>Test Page</h1>
<h2>meaningless text to be inserted</h2>
```

## Constructor Options

You can configure templates directory when registering plugin:

```js
go.use(HandlebarsPlugin, {
  templatesDir: 'custom/templates/dir'
})
```

By default, `templatesDir` is assigned to `'.templates'`.

## API Reference

### go.getTemplatesDir

```
go.getTemplatesDir(): <string>
```

Return templates directory.

### go.loadTemplates

```js
go.loadTemplates( search [ , context ] ): Promise<templates>
// and
go.loadTemplatesSync( search [ , context ] ): templates
```

Wrap content that matches [search](#search) with Handlebars [template functions](#template) and set default [context](#context).

### go.processTemplates

```js
go.processTemplates( search [ , context, resolver ] ): Promise<void>
// and
go.processTemplatesSync( search [ , context, resolver ] ): void
```

Process the content that matches [search](#search) using Handlebars with the given [context](#context) and write it to files that are specified by [resolver](#resolver).

### go.registerTemplateHelper

```js
go.registerTemplateHelper( name, renderFunction ): void
```

Register [Handlebars helper](http://handlebarsjs.com/#helpers).

### go.registerTemplatePartial

```js
go.registerTemplatePartial( name, template ): void
```

Register [Handlebars partial](http://handlebarsjs.com/#partials).

### template

```js
template( [ context ] ): string
```

Render inherited content with the given [context](#context).

## Entities

### search

An `object`, a `string`, or an `array` used by [go.loadTemplates](#goloadtemplates) and [go.processTemplates](#goprocesstemplates) to find templates in file system or to specify them with an array.

If `array` is given, it should contain a list of objects with 2 properties: `name<string>` and `content<string>`. Where the `content` is a Handlebars template string and the `name` is a string that will be used by [resolver](#resolver) figure out the path to save the processed content.

If search is given as an `object` it can have a list of properties to match files:

- `pattern` (default: `'**'`) — a [minimatch](https://www.npmjs.com/package/minimatch) string expression
- `cwd` — root path to apply `pattern`
- and there are some more options provided by [fast-glob](https://github.com/mrmlnc/fast-glob#options)

> When using **cwd** option the part matched by it is not used in [resolver](#resolver) to generate destination file path.

When search is given as a `string` it is assigned to an empty object within property `pattern`.

> Make sure to read about [path resolution](#path-resolution) of **pattern** and **cwd** options.

### context

`context` is an object that specifies variables to be used in processing templates.

### resolver

`resolver` is either a `string` or a `function` that specifies where to save processed file.

> Make sure to read about [path resolution](#path-resolution) to understand how it affects the argument of resolver.

When resolver is not specified the file name is simply not changed.

If resolver is given as a `string`, this string will be used as a folder path to save files.

If resolver is of type `function` then for each file this function will be called with the relative path to the file as an argument, and the result of the function will be used as a destination path to save processed templates.

## Path Resolution

The `pattern` and `cwd` in [search](#search) option are interpreted by plugin in a special way similar to how nodejs resolves npm modules.

`cwd` and `pattern` will use a normal path resolve algorithm if they start with `./`, `../`, `~/` or root folder (`/` for posix OS and disk name (like `C:\\`) for Windows). Otherwise, they will be resolved in [tempaltes directory](#gogettemplatesdir) that is `'.templates'` by [default](#constructor-options).

## Examples

For every example the next file structure is expected:

```bash

├── .templates/
|   ├── LICENSE
│   ├── README.md
│   └── component/
│       ├── docs/
│       │   └── component.md
│       ├── component.css
│       └── component.js
├── src/
│   ├── components/
│   └── main.js
├── README.md
└── script.js
```

### Process files at the place

```js
const context = { /* variables */ }

// Process ./README.md and replace it with resulted content
go.processTemplatesSync('./README.md', context)

// Process ./README.md and save resulted content to ./docs/README.md
go.processTemplatesSync('./README.md', context, 'docs')
```

### Process files from templates directory

```js
const context = { /* variables */ }

// Process ./.templates/README.md and save it to ./README.md
go.processTemplatesSync('README.md', context)
```

### Process multiple files from templates directory

```js
const context = { /* variables */ }

// Process all files from ./.templates/component/ and save it to ./src/components/new-component/
go.processTemplatesSync(
  { cwd: 'component' },
  context,
  'src/components/new-component'
)
```

### More

For more examples on template syntax read [Handlebars documentation](http://handlebarsjs.com/)

## License

MIT © [Stanislav Termosa](https://github.com/termosa)

