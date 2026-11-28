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
- `sass` → 把 `src/styles/style.scss` 编译为 `dist/style.css`（`@use` 内联各模块 + 嵌套展开 + compressed）

`src/styles/` 下的 SCSS 用 **Sass BEM 嵌套**（`$p` 变量 + `&__element`）写，编译产物是扁平选择器，不依赖浏览器对 CSS Nesting 的支持。

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
| `onUpdate` | `() => void` | — | 点击「重启完成更新」，宿主负责让新 SW 接管并刷新 |
| `onDismiss` | `() => void` | — | 点击关闭 / × |
| `position` | `PwaUpdatePosition \| CSSProperties` | `'top-right'` | 六个预设位置（四角 + bottom/top-center），或传样式对象自定义坐标 |
| `className` | `string` | — | 追加根类名 |
| `theme` | `PwaUpdateTheme` | `'default'` | 内置主题：`weiyun`（微云风卡片）、`toast`（居中胶囊条） |

`PwaUpdatePosition` = `'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center'`。

## 主题

| 主题 | 布局 | 样式文件 |
| --- | --- | --- |
| `default` | 240px 紧凑卡片，底部右对齐小按钮 | `src/styles/base.scss` |
| `weiyun` | 280px 卡片，标题 + 描述 + 通栏主按钮，右上角关闭 | `src/styles/weiyun.scss` |
| `toast` | 深色渐变胶囊条：绿色勾 + 单行文案 + 蓝色胶囊按钮和关闭；≤639px 堆叠成小卡片 | `src/styles/toast.scss` |

所有主题共用同一套文案（`src/constants.ts`）：标题「新版本已就绪」、描述「本次更新带来体验优化与已知问题修复，欢迎升级到最新版本体验。」、按钮「重启完成更新」，英文同理。

新增主题：在 `src/themes/` 下建 `<name>.ts`（定义类名与布局）、在 `src/styles/` 下建 `<name>.scss`（样式），
在 `src/themes/index.ts` 注册，并在 `src/styles/style.scss` 里加一行 `@use`。

## 特性

- 默认 240px 紧凑卡片、小按钮；按钮带 hover / 按下 / 键盘焦点反馈
- 三种内置主题（default / weiyun / toast），共用同一套文案
- 六种预设位置（四角 + 上下居中），也支持自定义坐标
- 自带入场动画，并尊重 `prefers-reduced-motion`
- 不依赖 `vite-plugin-pwa`，非 Vite 项目也可以自己控制 `open` 使用
