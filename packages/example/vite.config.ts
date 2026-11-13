import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    react(),
    // 检测到新版本不自动刷新，由 PwaUpdatePrompt 决定何时更新
    VitePWA({
      registerType: 'prompt',
      injectRegister: null, // example 里用 useRegisterSW 自行注册
      manifest: {
        name: 'react-pwa-promotion example',
        short_name: 'pwa-promotion',
        theme_color: '#ffffff',
        icons: [{ src: 'vite.svg', sizes: 'any', type: 'image/svg+xml' }]
      }
    })
  ]
});
