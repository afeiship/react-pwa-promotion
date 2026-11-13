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
  /** 点击「立即更新」：组件立即隐藏自身，宿主负责让新 SW 接管并刷新页面 */
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
  lang
}: PwaUpdatePromptProps) {
  // Hide instantly on update click: the host's reload may lag behind SW activation.
  const [updateClicked, setUpdateClicked] = useState(false);

  useEffect(() => {
    if (!open) setUpdateClicked(false);
  }, [open]);

  if (!open || updateClicked) return null;

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
      <div className={`${CLASS_NAME}__title`}>{t.title}</div>
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
          onClick={() => {
            setUpdateClicked(true);
            onUpdate();
          }}>
          {t.update}
        </button>
      </div>
    </div>
  );
}
