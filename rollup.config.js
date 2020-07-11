
import resolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import commonjs from '@rollup/plugin-commonjs';
import banner from 'rollup-plugin-banner';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import '@feizheng/next-rollup-banner';

const installCfg = {
  targets: [{
    src: 'src/install.js',
    dest: 'dist',
    transform: (contents) => contents.toString().replace(/__VERSION__/g, pkg.version)
  }]
};

export default {
  input: 'src/main.js',
  output: {
    strict: false,
    file: 'dist/index.js',
    format: 'umd',
  },
  plugins: [
    resolve(),
    commonjs(),
    terser({ output: { comments: false } }),
    banner(nx.rollupBanner()),
    copy(installCfg),
    filesize()
  ]
};
