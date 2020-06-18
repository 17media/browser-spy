import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import ts from '@wessberg/rollup-plugin-ts';
import pkg from './package.json';

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

export default {
  input: './src/index.ts',

  external: [...Object.keys(pkg.peerDependencies)],

  plugins: [resolve({ extensions }), ts({ transpiler: 'babel' }), commonjs({ extensions }), json()],

  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
};
