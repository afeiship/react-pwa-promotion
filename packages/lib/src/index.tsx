import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

export type PwaUpdatePosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type PwaUpdateTexts = {
  title: string;
  description: string;
  update: string;
  dismiss: string;
};

export interface PwaUpdatePromptProps {
  /** 是否有新版本待更新，由宿主的 Service Worker 状态提供 */
  open: boolean;
  /** 点击「立即更新」：按钮进入 loading 并禁用，宿主负责让新 SW 接管并刷新页面 */
  onUpdate: () => void;
  /** 点击「稍后」 */
  onDismiss: () => void;
  /** 四个角，或传样式对象自定义坐标（如 { left: 40, top: 40 }） */
  position?: PwaUpdatePosition | CSSProperties;
  className?: string;
  /** 覆盖默认文案 */
  texts?: Partial<PwaUpdateTexts>;
  /** 提示框语言：决定默认文案与 aria lang；未传时跟随 <html> 的 lang */
  lang?: 'zh-CN' | 'en-US';
  /** 新版本号，传入后显示在标题旁（如 "v1.2.0"，原样展示） */
  version?: string;
}

const CLASS_NAME = 'react-pwa-promotion';

const defaultTextsByLang: Record<'zh-CN' | 'en-US', PwaUpdateTexts> = {
  'zh-CN': {
    title: '发现新版本',
    description: '新版本已就绪，刷新即可使用。',
    update: '立即更新',
    dismiss: '稍后'
  },
  'en-US': {
    title: 'Update available',
    description: 'A new version is ready. Refresh to use it.',
    update: 'Update now',
    dismiss: 'Later'
  }
};

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

  const resolvedLang =
    lang ?? (typeof navigator !== 'undefined' && navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US');
  const t = { ...defaultTextsByLang[resolvedLang], ...texts };
  const preset = typeof position === 'string';
  const classes = [CLASS_NAME, preset ? `${CLASS_NAME}--${position}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={typeof position === 'string' ? undefined : position}
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

// Fake progress bar pinned to the top edge of the prompt. On activate it jumps
// to 20%, then creeps asymptotically towards 90% and never reaches 100% — the
// page reload makes the whole prompt vanish before it "finishes".
function PwaProgress({ active }: { active: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    setProgress(20);
    const timer = setInterval(() => {
      setProgress((p) => Math.min(90, p + Math.max(0.4, (90 - p) * 0.1)));
    }, 250);
    return () => clearInterval(timer);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`${CLASS_NAME}__progress`}
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}
