// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'src/',
  
  // Global CSS
  css: [
    '@/assets/css/main.css'
  ],
  
  // App configuration
  app: {
    head: {
      title: 'Ludus Admin - Dashboard Quản Lý',
      htmlAttrs: {
        lang: 'vi'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Dashboard quản lý e-commerce hiện đại với tính năng quản lý sản phẩm, đơn hàng và khách hàng' },
        { name: 'keywords', content: 'dashboard, admin, e-commerce, quản lý, sản phẩm, đơn hàng, khách hàng' }
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

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: '',
    
    // Public keys (exposed to client-side)
    public: {
      // apiBase: '/api',
      apiBase: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000'
    }
  },

  // Auto import components
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
    // Add modules here if needed
  ],

  // Build configuration
  build: {
    // Build options
  },

  // Server configuration
  nitro: {
    // Server options
  }
})