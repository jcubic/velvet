import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'build/velvet.js',
    output: {
      file: 'index.js',
      format: 'iife',
      compact: true,
      name: 'velvet'
    }
  }, {
    input: 'build/velvet.js',
    output: {
      file: 'index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  }, {
    input: 'src/velvet.ts',
    plugins: [dts()],
    output: {
      file: `index.d.ts`,
      format: 'es'
    }
  }
];
