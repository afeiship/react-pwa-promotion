import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import PwaUpdatePrompt, { type PwaUpdatePosition, type PwaUpdateTheme } from '../../lib/src';

const positions: PwaUpdatePosition[] = [
  'bottom-right',
  'bottom-left',
  'top-right',
  'top-left'
];

const themes: PwaUpdateTheme[] = ['default', 'weiyun'];

export default function App() {
  const [simulate, setSimulate] = useState(false);
  const [position, setPosition] = useState<PwaUpdatePosition>('top-right');
  const [theme, setTheme] = useState<PwaUpdateTheme>('weiyun');
  // 只负责注册 SW；新版本由 PwaUpdatePrompt 的 pollInterval 自行轮询发现
  const { updateServiceWorker } = useRegisterSW();

  const dismiss = () => setSimulate(false);

  const update = async () => {
    // dev 下模拟 SW 激活延迟，便于观察按钮 loading 态
    if (import.meta.env.DEV) await new Promise((r) => setTimeout(r, 2000));
    void updateServiceWorker(true);
    // dev 下 vite-plugin-pwa 的 SW 是空实现，手动刷一次模拟真实刷新
    if (import.meta.env.DEV) window.location.reload();
  };

  return (
    <main className="app">
      <h1>react-pwa-promotion</h1>
      <p>Vite PWA（registerType: prompt）+ 版本升级提示组件</p>
      <p>每 60s 轮询一次 SW 更新，发现新版本自动弹出提示（页面隐藏时暂停）</p>

      {import.meta.env.DEV && (
        <div className="toolbar">
          <button type="button" onClick={() => setSimulate(true)}>
            模拟新版本提示
          </button>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as PwaUpdatePosition)}>
            {positions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as PwaUpdateTheme)}>
            {themes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}

      <PwaUpdatePrompt
        open={simulate}
        pollInterval={6_000}
        onUpdate={update}
        onDismiss={dismiss}
        position={position}
        theme={theme}
        version="v1.0.19"
        texts={
          theme === 'weiyun'
            ? {
                title: '新版本已就绪',
                description: '本次更新带来体验优化与已知问题修复，欢迎升级到最新版本体验。',
                update: '重启完成更新',
                dismiss: ''
              }
            : undefined
        }
      />
    </main>
  );
}
