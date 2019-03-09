import path from 'path'

import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/packages/cli/commands/index.js', 
  output: {
    file: 'dist/index.js',
    banner: (
      'require(\'source-map-support\').install({\n'
      + '  environment: \'node\'\n'
      + '});\n'
    ), 
    format: 'cjs',
    sourceMap: true
  },

  onwarn: ({ code, message }) => {
    if (code === 'UNUSED_EXTERNAL_IMPORT') {
      return
    }
    // eslint-disable-next-line no-console
    console.warn(message)
  },
  plugins: [
    json(),
    babel({
      externalHelpers: true
    }),
    resolve()
  ],
  external: id => !(
    id.startsWith('.')
    || id.startsWith('/') // Absolute path on Unix
    || /^[A-Z]:[\\/]/.test(id) // Absolute path on Windows
    || id.startsWith('src')
    || id.startsWith(path.join(__dirname, 'src'))
    || id === 'babelHelpers'
    || id === '\u0000babelHelpers'
    || id.startsWith('rollupPluginBabelHelpers')
  )
}
