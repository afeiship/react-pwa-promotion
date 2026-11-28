import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import type { PluginBuild } from 'esbuild';
import { bundle } from 'lightningcss';

/** 浏览器目标：这些版本都不支持 CSS Nesting，嵌套会被展开成扁平选择器 */
const TARGETS = { chrome: 90 << 16, firefox: 90 << 16, safari: 15 << 16 };

/**
 * 用 Lightning CSS 的 bundle 编译 src/style.css：解析并内联其中所有 @import
 * （主题样式各自成文件），再按 targets 展开 CSS Nesting、压缩后写入 dist。
 */
export default function cssPlugin(options: { entry?: string; outFile?: string } = {}) {
  const { entry = 'src/style.css', outFile = 'style.css' } = options;

  return {
    name: 'react-pwa-promotion:css',
    setup(build: PluginBuild) {
      // tsup 每个 format 各跑一次构建，onEnd 会触发多次；CSS 很小，直接重建即可
      build.onEnd((result) => {
        if (result.errors.length) return undefined;

        const cwd = build.initialOptions.absWorkingDir || process.cwd();
        const sourcePath = isAbsolute(entry) ? entry : resolve(cwd, entry);
        const outDir = resolve(cwd, build.initialOptions.outdir || 'dist');
        const outPath = isAbsolute(outFile) ? outFile : resolve(outDir, outFile);

        try {
          const { code } = bundle({ filename: sourcePath, minify: true, targets: TARGETS });
          mkdirSync(dirname(outPath), { recursive: true });
          writeFileSync(outPath, code);
          console.log(`[lightningcss] ${relative(cwd, sourcePath)} -> ${relative(cwd, outPath)}`);
          return undefined;
        } catch (error) {
          const text = error instanceof Error ? error.message : String(error);
          return { errors: [{ text: `[lightningcss] ${text}` }] };
        }
      });
    }
  };
}
