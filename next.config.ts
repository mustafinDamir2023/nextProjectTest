import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    agentFeedback: true,
    cacheComponents: true // 👈 Включено
  },
  // partialPrefetching можно убрать, он включается автоматически при cacheComponents: true
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css'
      }
    }
  }
}

export default nextConfig
