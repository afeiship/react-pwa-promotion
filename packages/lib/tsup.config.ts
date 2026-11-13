import { defineConfig } from 'tsup';
import lightningCssPlugin from '@jswork/tsup-plugin-lightningcss';

export default defineConfig({
  entry: ['src/index.tsx'],
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

  // CSS 由 tsup 插件在同一次构建里产出 dist/style.css（无需 postbuild）
  esbuildPlugins: [
    lightningCssPlugin({
      entry: 'src/style.css',
      outFile: 'style.css'
    })
  ],

  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
});
