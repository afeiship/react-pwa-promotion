import type { PwaUpdateTheme } from './types';
import { CLASS_NAME } from './constants';

/** 主题预设元数据：根类名修饰符 + 是否渲染右上角关闭按钮，样式实现在 style.css */
export const themeClassMap: Record<PwaUpdateTheme, { className?: string; closeButton?: boolean }> = {
  default: {},
  weiyun: { className: `${CLASS_NAME}--weiyun`, closeButton: true }
};
