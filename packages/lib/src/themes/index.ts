import type { PwaUpdateTheme } from '../types';
import type { ThemeDefinition } from './types';
import { defaultTheme } from './default';
import { weiyunTheme } from './weiyun';
import { toastTheme } from './toast';

export type { ThemeDefinition };

/** 主题注册表：定义在各自 <name>.ts，样式在同目录 <name>.css */
export const themes: Record<PwaUpdateTheme, ThemeDefinition> = {
  default: defaultTheme,
  weiyun: weiyunTheme,
  toast: toastTheme
};
