import { defineConfig } from 'tsup';
import cssPlugin from './build/css';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  cjsInterop: true,

  // react
  minify: true,
  sourcemap: true,
  splitting: true,
  target: 'es6',
  bundle: true,
  external: ['react', 'react-dom'],

  // CSS 由本地插件在同一次构建里产出 dist/style.css（会内联 src/styles/* 的主题文件）
  esbuildPlugins: [cssPlugin({ entry: 'src/style.css', outFile: 'style.css' })],

  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
});
