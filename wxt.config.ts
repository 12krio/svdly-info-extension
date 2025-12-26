import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage'],
    host_permissions: [
      'https://google.com/*',
      'https://your-confluence.com/*',
      'https://*.cybozu.com/*'  // ← * でワイルドカード
    ]
  }
});