import { defineNuxtConfig } from 'nuxt/config'
import eslintPlugin from 'vite-plugin-eslint'
import ElementPlus from 'unplugin-element-plus/vite'
import { i18n } from './i18n/i18n'

export default defineNuxtConfig({
  app: {
    head: {
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
    }
  },
  css: ['@/assets/scss/index.scss', '@/assets/scss/iconfont.scss'],
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
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
      }),
      ElementPlus()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import '@/assets/scss/export.scss';"
        }
      }
    }
  },
  nitro: {
    // devProxy: {
    //   '/api': {
    //     target: 'http://localhost:8055/mmgcApi',
    //     changeOrigin: true
    //   }
    // }
  },
  // build modules
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
    'nuxt-icon',
    'nuxt-swiper',
    'nuxt-lodash'
  ],
  i18n: {
    locales: ['cn', 'en', 'jp'],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root' // recommended
    },
    defaultLocale: 'cn',
    vueI18n: i18n
  },
  // auto import components
  components: true,
  runtimeConfig: {
    public: {
      apiBase: 'https://mirai-mad.com',
      apiPrefix: '/mmgcApi',
      apiLocal: 'http://localhost:8055'
    }
  },
  plugins: ['~~/plugins/pinia-plugin-persist.client']

  // unocss: {
  //   uno: true,
  //   attributify: true,
  //   icons: {
  //     scale: 1.2
  //   }
  // }
})
