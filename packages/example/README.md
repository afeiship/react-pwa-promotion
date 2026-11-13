# example

Vite + `vite-plugin-pwa` 的真实链路演示：`registerType: 'prompt'` 让 SW 检测到新版本后不自动刷新，交给 `PwaUpdatePrompt` 提示用户。

```shell
pnpm install   # 在仓库根目录执行
pnpm dev
```

- dev 下 SW 是空实现，点「模拟新版本提示」看 UI，用旁边的下拉框可以实时切换弹窗位置。
- `main.tsx` 直接引入 `lib/src/style.css`（开发时走源码）；正式使用组件包时改成引入 `@jswork/react-pwa-promotion/dist/style.css`。
- 生产链路：`pnpm build && pnpm preview` → 改点代码再 build → 刷新页面，SW 检测到新版本就会弹窗，点「立即更新」刷新到新版。
