import type { PwaUpdateLang, PwaUpdateTexts } from '../types';

/** 布局：card = 标题/描述/按钮竖排卡片；bar = 图标 + 单行文案 + 胶囊按钮的横条 */
export type ThemeLayout = 'card' | 'bar';

/** 一套主题的定义；样式在同目录的 <name>.css，根类名需与之对应 */
export interface ThemeDefinition {
  /** 额外的根类名（位置变体类由组件统一拼接） */
  className?: string;
  layout: ThemeLayout;
  /** 是否渲染右上角关闭按钮 */
  closeButton?: boolean;
  /** 主题专属默认文案，用户传入的 texts 优先级更高 */
  texts?: Partial<Record<PwaUpdateLang, Partial<PwaUpdateTexts>>>;
}
