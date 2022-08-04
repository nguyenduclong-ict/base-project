import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  srcDir: __dirname,
  head: {
    title: 'Sale Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/main.scss', 'element-ui/lib/theme-chalk/index.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/client', '@/plugins/element-ui', '@/plugins/mixin'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/svg-sprite',
  ],

  svgSprite: {
    input: '~/assets/svg/',
  },

  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/tailwindcss'],

  auth: {
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'token',
          global: true,
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
        },
        user: {
          property: '',
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          user: { url: '/auth/me', method: 'get' },
        },
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.API_URL,
    progress: false,
  },

  router: {
    middleware: ['auth', 'shop', 'meta'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
} as NuxtConfig

export default config
