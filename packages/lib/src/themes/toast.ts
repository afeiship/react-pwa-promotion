import type { ThemeDefinition } from './types';

/** Toast：深色渐变胶囊条（勾 + 单行文案 + 胶囊按钮），样式见 toast.css */
export const toastTheme: ThemeDefinition = {
  className: 'react-pwa-promotion--toast',
  layout: 'bar',
  texts: {
    'zh-CN': { title: '新版本可用', description: '', update: '刷新', dismiss: '' },
    'en-US': { title: 'Update available', description: '', update: 'Refresh', dismiss: '' }
  }
};
