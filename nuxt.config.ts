import { defineNuxtConfig } from 'nuxt/config'
import ElementPlus from 'unplugin-element-plus/vite'
import eslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'path'
export default defineNuxtConfig({
  // meta
  meta: {
    title: 'MMGC - Mirai Mad Team',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Mirai Mad 官网'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  css: ['@/assets/scss/index.scss','@/assets/scss/iconfont.scss'],
  // build
  build: {
    transpile: ['element-plus/es']
  },
  typescript: {
    strict: true,
    shim: false
  },
  vite: {
    plugins: [
      ElementPlus(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import '@/assets/scss/export.scss';"
        }
      }
    }
  },
  // build modules
  modules: ['@vueuse/nuxt', '@unocss/nuxt', '@pinia/nuxt'],
  // auto import components
  components: true,
  // vueuse
  vueuse: {
    ssrHandlers: true
  },
  unocss: {
    uno: true,
    attributify: true,
    icons: {
      scale: 1.2
    }
  }
})
