/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  i18n: {
    locales: ['fi-FI', 'en-GB'],
    defaultLocale: 'fi-FI',
    localeDetection: false,
  },  
  trailingSlash: true,
}

module.exports = nextConfig
