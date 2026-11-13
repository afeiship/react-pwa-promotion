import type { PwaUpdateLang, PwaUpdateTexts } from './types';

export const CLASS_NAME = 'react-pwa-promotion';

export const defaultTextsByLang: Record<PwaUpdateLang, PwaUpdateTexts> = {
  'zh-CN': {
    title: '发现新版本',
    description: '新版本已就绪，刷新即可使用。',
    update: '立即更新',
    dismiss: '稍后'
  },
  'en-US': {
    title: 'Update available',
    description: 'A new version is ready. Refresh to use it.',
    update: 'Update now',
    dismiss: 'Later'
  }
};
