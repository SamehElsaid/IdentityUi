const path = require('path')

/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,

  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: true
  },

  env: {
    API_URL: 'https://cortextest.singleclic.com/identityServerFRA/api',
    IDENTITY_URL: 'https://cortextest.singleclic.com/identityServerFRA/',
    API_BASE_URL: 'https://cortextest.singleclic.com/identityServerFRA/api',
    DOMAIN: 'https://identity-ui-iota.vercel.app/',
    DEV_MODE: false
  },

  images: {
    domains: []
  },

  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        './node_modules/apexcharts-clevision'
      )
    }

    return config
  }
}
