/** 布局：card = 标题/描述/按钮竖排卡片；bar = 图标 + 单行文案 + 胶囊按钮的横条 */
export type ThemeLayout = 'card' | 'bar';

/** 一套主题的定义；样式在 src/styles/<name>.scss，根类名需与之对应 */
export interface ThemeDefinition {
  /** 额外的根类名（位置变体类由组件统一拼接） */
  className?: string;
  layout: ThemeLayout;
  /** 是否渲染右上角关闭按钮 */
  closeButton?: boolean;
}
