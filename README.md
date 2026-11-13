# react-pwa-promotion
> A tiny React update prompt for Vite PWA (vite-plugin-pwa).

组件是纯 UI，不绑定构建工具；由宿主（Vite PWA 插件）提供 Service Worker 状态，一起完成新版本升级提示。

包管理器统一用 **pnpm**（`pnpm-workspace.yaml` + `packageManager` 字段）。

## 结构

| 目录 | 说明 |
| --- | --- |
| `packages/lib` | 组件库 `@jswork/react-pwa-promotion`：tsup 产出 cjs / esm / d.ts，`src/style.css` 由独立包 `@jswork/tsup-plugin-lightningcss`（Lightning CSS）编译成 `dist/style.css` |
| `packages/example` | Vite + `vite-plugin-pwa`（`registerType: 'prompt'`）示例，演示真实 SW 更新链路 |

## 命令

```shell
pnpm install
pnpm dev        # 启动 example（含 dev 模拟开关）
pnpm ln:build   # 构建 lib：tsup + Lightning CSS
```

用法见 [packages/lib/README.md](packages/lib/README.md)。旧版实现（class 组件 + `@jswork/sw-runtime` + SCSS）已清空，git 历史里可以找回。
