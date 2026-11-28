import type { PwaUpdateLang } from './types';

export const CLASS_NAME = 'react-pwa-promotion';

export type UpdateCopy = {
  title: string;
  description: string;
  update: string;
};

/** 所有主题共用同一套文案 */
export const copyByLang: Record<PwaUpdateLang, UpdateCopy> = {
  'zh-CN': {
    title: '新版本已就绪',
    description: '本次更新带来体验优化与已知问题修复，欢迎升级到最新版本体验。',
    update: '重启完成更新'
  },
  'en-US': {
    title: 'New version ready',
    description: 'This update brings UX improvements and bug fixes. Enjoy the latest version.',
    update: 'Restart to update'
  }
};
