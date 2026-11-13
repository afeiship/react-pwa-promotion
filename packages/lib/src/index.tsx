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
  /** 点击「立即更新」：宿主负责让新 SW 接管并刷新页面 */
  onUpdate: () => void;
  /** 点击「稍后」 */
  onDismiss: () => void;
  /** 四个角，或传样式对象自定义坐标（如 { left: 40, top: 40 }） */
  position?: PwaUpdatePosition | CSSProperties;
  className?: string;
  /** 覆盖默认中文文案 */
  texts?: Partial<PwaUpdateTexts>;
}

const CLASS_NAME = 'react-pwa-promotion';

const defaultTexts: PwaUpdateTexts = {
  title: '发现新版本',
  description: '新版本已就绪，刷新即可使用。',
  update: '立即更新',
  dismiss: '稍后'
};

// 样式独立在 src/style.css（构建时用 Lightning CSS 编译到 dist/style.css），
// 使用方需引入一次 CSS，组件本身不往 DOM 注入 <style>。
export default function PwaUpdatePrompt({
  open,
  onUpdate,
  onDismiss,
  position = 'bottom-right',
  className,
  texts
}: PwaUpdatePromptProps) {
  if (!open) return null;

  const t = { ...defaultTexts, ...texts };
  const preset = typeof position === 'string';
  const classes = [CLASS_NAME, preset ? `${CLASS_NAME}--${position}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={typeof position === 'string' ? undefined : position}
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
          onClick={onUpdate}>
          {t.update}
        </button>
      </div>
    </div>
  );
}
