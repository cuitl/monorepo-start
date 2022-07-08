import typescript from 'rollup-plugin-typescript2';

export default {
  input: ['src/index.ts'],
  output: [
    {
      dir: 'dist',
      entryFileNames: '[name].js',
      format: 'cjs',
      exports: 'named',
    },
    {
      dir: 'dist',
      entryFileNames: '[name].es.js',
      format: 'es',
      exports: 'named',
    },
  ],
  plugins: [typescript()],
};
