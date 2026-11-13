import type { PwaUpdateLang, PwaUpdateTexts } from './types';
import { defaultTextsByLang } from './constants';

export function resolveLang(lang?: PwaUpdateLang): PwaUpdateLang {
  if (lang) return lang;
  if (typeof navigator !== 'undefined' && navigator.language.startsWith('zh')) return 'zh-CN';
  return 'en-US';
}

export function mergeTexts(lang: PwaUpdateLang, texts?: Partial<PwaUpdateTexts>) {
  return { ...defaultTextsByLang[lang], ...texts };
}

export function joinClasses(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}
