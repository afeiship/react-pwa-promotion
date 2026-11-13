import { useEffect } from 'react';

/**
 * 定期主动检查 SW 更新（intervalMs <= 0 时不开启）。
 * 浏览器只在导航时自动检查 SW（且有 24h 节流），长驻 SPA 页面不导航就发现不了新版本，
 * 所以定时调用 registration.update() 强制走网络检查。
 * 发现 waiting 的新 worker 后回调 onFound；页面隐藏时跳过，切回可见立即检查一次。
 */
export default function useSwUpdatePolling(intervalMs: number, onFound: () => void) {
  useEffect(() => {
    if (intervalMs <= 0 || !('serviceWorker' in navigator)) return;
    let alive = true;

    const check = () => {
      if (document.visibilityState !== 'visible') return;
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => {
          if (!reg || !alive) return;
          const hasNew = !!(reg.waiting && navigator.serviceWorker.controller);
          if (hasNew) return onFound();
          return reg.update().then(() => {
            if (alive && reg.waiting && navigator.serviceWorker.controller) onFound();
          });
        })
        .catch(() => {});
    };

    const timer = window.setInterval(check, intervalMs);
    document.addEventListener('visibilitychange', check);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, [intervalMs, onFound]);
}
