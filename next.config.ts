import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
