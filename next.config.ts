import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Optimize CSS loading
  experimental: {
    optimizeCss: true,
  },
  // Reduce preload warnings in development
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;
