
import '@feizheng/next-rollup-banner';
import commonjs from '@rollup/plugin-commonjs';
import multi from '@rollup/plugin-multi-entry';
import resolve from '@rollup/plugin-node-resolve';
import banner from 'rollup-plugin-banner';
import copy from 'rollup-plugin-copy';
import filesize from 'rollup-plugin-filesize';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';


const installCfg = {
  targets: [{
    src: 'src/install.js',
    dest: 'dist',
    transform: (contents) => contents.toString().replace(/__VERSION__/g, pkg.version)
  }]
};

export default {
  input: 'src/plugins/*.js',
  output: {
    strict: false,
    file: 'dist/index.js',
    format: 'umd'
  },
  plugins: [
    resolve(),
    commonjs(),
    multi(),
    terser({ output: { comments: false } }),
    banner(nx.rollupBanner()),
    copy(installCfg),
    filesize()
  ]
};
