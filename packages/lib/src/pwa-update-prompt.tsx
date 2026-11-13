import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PwaUpdateLang, PwaUpdatePromptProps } from './types';
import { CLASS_NAME } from './constants';
import PwaProgress from './pwa-progress';
import { joinClasses, mergeTexts, resolveLang } from './utils';

// 样式独立在 src/style.css（构建时用 Lightning CSS 编译到 dist/style.css），
// 使用方需引入一次 CSS，组件本身不往 DOM 注入 <style>。
export default function PwaUpdatePrompt({
  open,
  onUpdate,
  onDismiss,
  position = 'top-right',
  className,
  texts,
  lang,
  version
}: PwaUpdatePromptProps) {
  // Keep the prompt visible after clicking update; the button shows a loading
  // state while the host activates the new SW and reloads.
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!open) setUpdating(false);
  }, [open]);

  if (!open) return null;

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
          onClick={onDismiss}>
          {t.dismiss}
        </button>
        <button
          type="button"
          className={`${CLASS_NAME}__btn ${CLASS_NAME}__btn--primary`}
          disabled={updating}
          aria-busy={updating}
          onClick={() => {
            setUpdating(true);
            onUpdate();
          }}>
          {updating && <span className={`${CLASS_NAME}__spin`} aria-hidden="true" />}
          {t.update}
        </button>
      </div>
    </div>
  );
}
