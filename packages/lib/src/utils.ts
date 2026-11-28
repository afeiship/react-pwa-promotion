import type { PwaUpdateLang } from './types';
import { copyByLang } from './constants';

export function resolveLang(lang?: PwaUpdateLang): PwaUpdateLang {
  if (lang) return lang;
  if (typeof navigator !== 'undefined' && navigator.language.startsWith('zh')) return 'zh-CN';
  return 'en-US';
}

export function getCopy(lang: PwaUpdateLang) {
  return copyByLang[lang];
}

export function joinClasses(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}
