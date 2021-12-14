import cleaner from 'rollup-plugin-cleaner'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

export default {
  external: ['axios'],

  input: './src/index.ts',

  output: [
    {
      dir: './dist',
      format: 'cjs',
      preserveModules: false,
      sourcemap: true,
    },
  ],

  plugins: [
    // Clean /dist directory:
    cleaner({ targets: ['./dist'] }),
    nodeResolve({
      extensions: ['.js', 'json', '.ts', '.tson'],
    }),
    // Convert CommonJS to ES6:
    commonjs(),
    // Transpile TS & TSX to JS:
    typescript({
      tsconfig: './tsconfig.dist.json',
    }),
  ],
}
