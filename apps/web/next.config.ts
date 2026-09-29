import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @tonelle/shared ships TypeScript source.
  transpilePackages: ['@tonelle/shared'],
  experimental: {
    // Selfies arrive as base64 data URLs (≤ 4 MB decoded ≈ 5.4 MB encoded).
    serverActions: { bodySizeLimit: '6mb' },
  },
};

export default nextConfig;
