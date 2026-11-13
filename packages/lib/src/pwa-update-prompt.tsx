import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PwaUpdateLang, PwaUpdatePromptProps } from './types';
import { CLASS_NAME } from './constants';
import PwaProgress from './pwa-progress';
import useSwUpdatePolling from './use-sw-update-polling';
import { joinClasses, mergeTexts, resolveLang } from './utils';

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

// 样式独立在 src/style.css（构建时用 Lightning CSS 编译到 dist/style.css），
// 使用方需引入一次 CSS，组件本身不往 DOM 注入 <style>。
export default function PwaUpdatePrompt({
  open = false,
  onUpdate,
  onDismiss,
  position = 'top-right',
  className,
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
  const t = mergeTexts(resolvedLang, texts);
  const preset = typeof position === 'string';
  const classes = joinClasses(
    CLASS_NAME,
    preset && `${CLASS_NAME}--${position}`,
    className
  );

  return (
    <div
      className={classes}
      style={typeof position === 'string' ? undefined : (position as CSSProperties)}
      lang={resolvedLang}
      role="dialog"
      aria-live="polite"
      aria-label={t.title}>
      <PwaProgress active={updating} />
      <div className={`${CLASS_NAME}__title`}>
        {t.title}
        {version && <span className={`${CLASS_NAME}__version`}>{version}</span>}
      </div>
      <div className={`${CLASS_NAME}__desc`}>{t.description}</div>
      <div className={`${CLASS_NAME}__actions`}>
        <button
          type="button"
          className={`${CLASS_NAME}__btn ${CLASS_NAME}__btn--ghost`}
          onClick={() => {
            setFound(false);
            onDismiss?.();
          }}>
          {t.dismiss}
        </button>
        <button
          type="button"
          className={`${CLASS_NAME}__btn ${CLASS_NAME}__btn--primary`}
          disabled={updating}
          aria-busy={updating}
          onClick={() => {
            setUpdating(true);
            if (onUpdate) onUpdate();
            else defaultUpdate();
          }}>
          {updating && <span className={`${CLASS_NAME}__spin`} aria-hidden="true" />}
          {t.update}
        </button>
      </div>
    </div>
  );
}
