import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/((?!api|_next|favicon|assets|logo|.*\\..*).*)',
        destination: '/index.html',
      },
    ];
  },
};

export default nextConfig;
