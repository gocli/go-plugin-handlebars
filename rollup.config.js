import buble from 'rollup-plugin-buble'
import standard from 'rollup-plugin-standard'

export default {
  input: 'src/plugin.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
    sourcemap: true
  },
  external: [
    'path',
    'globby',
    'handlebars',
    'go-plugin-fs'
  ],
  plugins: [
    standard(),
    buble({ objectAssign: 'Object.assign' })
  ]
}
