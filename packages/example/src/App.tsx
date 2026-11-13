import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import PwaUpdatePrompt, { type PwaUpdatePosition } from '../../lib/src';

const positions: PwaUpdatePosition[] = [
  'bottom-right',
  'bottom-left',
  'top-right',
  'top-left'
];

export default function App() {
  const [simulate, setSimulate] = useState(false);
  const [position, setPosition] = useState<PwaUpdatePosition>('top-right');
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW();

  const dismiss = () => {
    setNeedRefresh(false);
    setSimulate(false);
  };

  const update = () => {
    void updateServiceWorker(true);
    // dev 下 vite-plugin-pwa 的 SW 是空实现，手动刷一次模拟真实刷新
    if (import.meta.env.DEV) window.location.reload();
  };

  return (
    <main className="app">
      <h1>react-pwa-promotion</h1>
      <p>Vite PWA（registerType: prompt）+ 版本升级提示组件</p>

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
        </div>
      )}

      <PwaUpdatePrompt
        open={needRefresh || simulate}
        onUpdate={update}
        onDismiss={dismiss}
        position={position}
      />
    </main>
  );
}
