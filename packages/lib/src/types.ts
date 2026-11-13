import type { CSSProperties } from 'react';

export type PwaUpdatePosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type PwaUpdateLang = 'zh-CN' | 'en-US';

export type PwaUpdateTexts = {
  title: string;
  description: string;
  update: string;
  dismiss: string;
};

export interface PwaUpdatePromptProps {
  /** 是否有新版本待更新，由宿主的 Service Worker 状态提供；开启 pollInterval 后可不传 */
  open?: boolean;
  /** 点击「立即更新」：按钮进入 loading 并禁用，宿主负责让新 SW 接管并刷新页面；
   *  不传且开启 pollInterval 时，内置默认行为：SKIP_WAITING + 刷新页面 */
  onUpdate?: () => void;
  /** 点击「稍后」；不传时仅关闭提示框 */
  onDismiss?: () => void;
  /** 四个角，或传样式对象自定义坐标（如 { left: 40, top: 40 }） */
  position?: PwaUpdatePosition | CSSProperties;
  className?: string;
  /** 覆盖默认文案 */
  texts?: Partial<PwaUpdateTexts>;
  /** 提示框语言：决定默认文案与 aria lang；未传时跟随 <html> 的 lang */
  lang?: PwaUpdateLang;
  /** 新版本号，传入后显示在标题旁（如 "v1.2.0"，原样展示） */
  version?: string;
  /** 轮询检查新版本的间隔 ms，默认 0 不开启；>0 时组件自动检测到新版本并弹出提示。
   *  页面隐藏时暂停轮询，切回可见时立即检查一次。生产建议 30min~1h，过短会频繁请求 SW 脚本 */
  pollInterval?: number;
}
