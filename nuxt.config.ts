import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'src/',

  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '~': fileURLToPath(new URL('./src', import.meta.url))
  },

  css: [
    '~/assets/css/main.css'  // Thêm dòng này
  ],

  app: {
    head: {
      title: 'Ludus Admin - Dashboard Quản Lý',
      htmlAttrs: { lang: 'vi' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Dashboard quản lý e-commerce hiện đại với tính năng quản lý sản phẩm, đơn hàng và khách hàng'
        },
        {
          name: 'keywords',
          content:
            'dashboard, admin, e-commerce, quản lý, sản phẩm, đơn hàng, khách hàng'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000'
      
    }
  },
  plugins: ['~/plugins/api.js'],
  

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt']
})
