import type { PwaUpdateLang, PwaUpdateTexts, PwaUpdateTheme } from './types';
import { defaultTextsByLang } from './constants';
import { themes } from './themes';

export function resolveLang(lang?: PwaUpdateLang): PwaUpdateLang {
  if (lang) return lang;
  if (typeof navigator !== 'undefined' && navigator.language.startsWith('zh')) return 'zh-CN';
  return 'en-US';
}

/** 文案优先级：通用默认 < 主题专属默认 < 用户 texts */
export function mergeTexts(
  lang: PwaUpdateLang,
  texts?: Partial<PwaUpdateTexts>,
  theme?: PwaUpdateTheme
) {
  const themeTexts = theme ? themes[theme]?.texts?.[lang] : undefined;
  return { ...defaultTextsByLang[lang], ...themeTexts, ...texts };
}

export function joinClasses(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}
