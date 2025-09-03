// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Produce a static export in ./out for GitHub Pages
  output: 'export',

  // Image handling — keep unoptimized for static export
  images: {
    unoptimized: true,
    // Optional: if you want to allow specific remote hosts instead of using `unoptimized` loader overrides
    // remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },

  // (Optional) Don’t fail builds on lint/type errors
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
