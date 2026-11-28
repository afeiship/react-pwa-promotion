import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PwaUpdateLang, PwaUpdatePromptProps } from '../types';
import { CLASS_NAME } from '../constants';
import { themes } from '../themes';
import PwaProgress from './pwa-progress';
import CardLayout from './layout-card';
import BarLayout from './layout-bar';
import useSwUpdatePolling from '../hooks/use-sw-update-polling';
import { joinClasses, mergeTexts, resolveLang } from '../utils';

// 内置默认更新行为：通知新 SW SKIP_WAITING，接管成功（controllerchange）后刷新页面。
// 要求 SW 响应该消息（vite-plugin-pwa generateSW 默认支持）。
function defaultUpdate() {
  navigator.serviceWorker?.addEventListener(
    'controllerchange',
    () => window.location.reload(),
    { once: true }
  );
  navigator.serviceWorker?.getRegistration().then((reg) => {
    if (reg?.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    else window.location.reload();
  });
}

// 样式独立在 src/style.css（通过 @import 组合 src/styles 与 src/themes/*.css），
// 构建时用 Lightning CSS bundle 编译到 dist/style.css；组件本身不往 DOM 注入 <style>。
export default function PwaUpdatePrompt({
  open = false,
  onUpdate,
  onDismiss,
  position = 'top-right',
  className,
  theme = 'default',
  texts,
  lang,
  version,
  pollInterval = 0
}: PwaUpdatePromptProps) {
  // Keep the prompt visible after clicking update; the button shows a loading
  // state while the host activates the new SW and reloads.
  const [updating, setUpdating] = useState(false);
  // pollInterval 轮询发现的新版本，与受控的 open 取或
  const [found, setFound] = useState(false);

  const handleFound = useCallback(() => setFound(true), []);
  useSwUpdatePolling(pollInterval, handleFound);

  const show = open || found;

  useEffect(() => {
    if (!show) setUpdating(false);
  }, [show]);

  if (!show) return null;

  const resolvedLang: PwaUpdateLang = resolveLang(lang);
  const t = mergeTexts(resolvedLang, texts, theme);
  const preset = typeof position === 'string';
  const themeDef = themes[theme];
  const classes = joinClasses(
    CLASS_NAME,
    themeDef.className,
    preset && `${CLASS_NAME}--${position}`,
    className
  );
  const common = {
    className: classes,
    style: typeof position === 'string' ? undefined : (position as CSSProperties),
    lang: resolvedLang,
    role: 'dialog' as const,
    'aria-live': 'polite' as const,
    'aria-label': t.title
  };

  const dismiss = () => {
    setFound(false);
    onDismiss?.();
  };

  const update = () => {
    setUpdating(true);
    if (onUpdate) onUpdate();
    else defaultUpdate();
  };

  return (
    <div {...common}>
      <PwaProgress active={updating} />
      {themeDef.layout === 'bar' ? (
        <BarLayout texts={t} updating={updating} onDismiss={dismiss} onUpdate={update} />
      ) : (
        <CardLayout
          texts={t}
          version={version}
          closeButton={themeDef.closeButton}
          closeLabel={resolvedLang === 'zh-CN' ? '关闭' : 'Close'}
          updating={updating}
          onDismiss={dismiss}
          onUpdate={update}
        />
      )}
    </div>
  );
}
