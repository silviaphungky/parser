/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'X-Frame-Options',
          },
        ],
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Forwarded-Host',
            value: 'frontend-app',
          },
          {
            key: 'Origin',
            value: 'https://fantasi-app.kpk.go.id',
          },
        ],
      },
    ]
  },
  output: 'standalone',
}

export default nextConfig
