import babel from '@rollup/plugin-babel'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss-modules'
import del from 'rollup-plugin-delete'
import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'

import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import icons from './internals/icons'

console.log('Expected Externals', [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  './src',
])

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default {
  input: {
    index: 'src/index.tsx',
    button: 'src/components/Button/index.tsx',
    icon: 'src/components/Icon/index.tsx',
    space: 'src/components/Space/index.tsx',
    ...icons,
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    './src',
  ],
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    {
      dir: 'dist/esm',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
  ],
  plugins: [
    external(),
    typescript(),

    nodeResolve({
      ignoreGlobal: false,
      include: ['node_modules/**'],
      extensions,

    }),
    commonjs({
      ignoreGlobal: false,
      include: 'node_modules/**',
    }),
    postcss({

        plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],

      minimize: true,
      sourceMap: false,

      minimize: true,
      modules: {

        generateScopedName: '[local]',
      },
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions,
    }),
    del({ targets: ['dist/*'] }),
  ],
}
