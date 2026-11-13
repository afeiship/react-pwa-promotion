# @jswork/react-pwa-promotion
> React PWA 版本升级提示组件（纯 UI，不绑定构建工具）。

## 安装

```shell
pnpm add @jswork/react-pwa-promotion
```

样式是独立文件，在入口引入一次：

```ts
import '@jswork/react-pwa-promotion/dist/style.css';
```

## 构建

```shell
pnpm build
```

- `tsup` → `dist/index.cjs.js` / `dist/index.esm.js` / `dist/index.d.ts`
- `@jswork/tsup-plugin-lightningcss`（挂在配置 `esbuildPlugins` 上）→ 构建结束时用 [Lightning CSS](https://lightningcss.dev/) 把 `src/style.css` 压缩并按 targets 降级，输出 `dist/style.css`

插件已抽成独立仓库 `/Users/afei/github/tsup-plugin-lightningcss`，本包用 `link:../../../tsup-plugin-lightningcss` 做本地联调；插件发布到 npm 后把依赖改成版本号即可。可选参数：`entry`、`outFile`、`targets`、`minify`、`silent`，输出目录自动跟随 tsup 的 `outDir`。

`src/style.css` 用**原生 CSS Nesting** 写（嵌套更好维护），构建时按 targets 展开成扁平选择器，产物不依赖浏览器对 nesting 的支持。注意写法遵循 CSS Nesting 规范（`& .xxx` / `&.xxx`），不是 Sass 的 `&__xxx` 后缀拼接。

组件本身不往 DOM 注入 `<style>`，样式完全由 CSS 文件控制。

## 配合 vite-plugin-pwa

`vite.config.ts`：

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: 'prompt', injectRegister: null })
  ]
});
```

`src/vite-env.d.ts` 加一行：

```ts
/// <reference types="vite-plugin-pwa/client" />
```

`App.tsx`：

```tsx
import { useRegisterSW } from 'virtual:pwa-register/react';
import PwaUpdatePrompt from '@jswork/react-pwa-promotion';

export default function App() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW();

  return (
    <PwaUpdatePrompt
      open={needRefresh}
      onUpdate={() => void updateServiceWorker(true)}
      onDismiss={() => setNeedRefresh(false)}
    />
  );
}
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 是否有新版本待更新，由宿主 SW 状态提供 |
| `onUpdate` | `() => void` | — | 点击「立即更新」，宿主负责让新 SW 接管并刷新 |
| `onDismiss` | `() => void` | — | 点击「稍后」 |
| `position` | `PwaUpdatePosition \| CSSProperties` | `'bottom-right'` | 四角，或传样式对象自定义坐标 |
| `className` | `string` | — | 追加根类名 |
| `texts` | `Partial<PwaUpdateTexts>` | 中文 | 覆盖标题 / 描述 / 两个按钮文案 |

`PwaUpdatePosition` = `'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`。

## 特性

- 240px 紧凑卡片、无圆角、小按钮；按钮带 hover / 按下 / 键盘焦点反馈
- 自带入场动画，并尊重 `prefers-reduced-motion`
- 不依赖 `vite-plugin-pwa`，非 Vite 项目也可以自己控制 `open` 使用
