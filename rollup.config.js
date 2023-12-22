import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'build/velvet.js',
    output: {
      file: 'index.js',
      format: 'umd',
      compact: true,
      name: 'velvet'
    }
  },
  {
    input: 'build/velvet.js',
    output: {
      file: 'index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  },
  {
    input: 'build/velvet.js',
    output: {
      file: 'index.mjs',
      format: 'es',
      sourcemap: true,
      exports: 'named'
    }
  },
  {
    input: 'src/velvet.ts',
    plugins: [dts()],
    output: {
      file: `index.d.ts`,
      format: 'es'
    }
  }
];
