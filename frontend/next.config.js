/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow self-signed certificates in development for server-side requests
  ...(process.env.NODE_ENV === 'development' && {
    serverRuntimeConfig: {
      // This will be available in server-side code
    },
  }),
}

module.exports = nextConfig

