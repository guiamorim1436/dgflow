import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/index.html',
      },
    ];
  },
};

export default nextConfig;
