import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // GitHub Pages 部署配置
  base: process.env.DEPLOY_TARGET === 'GITHUB_PAGES' ? '/BoKe/' :
        process.env.DEPLOY_TARGET === 'CUSTOM_DOMAIN' ? '/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

