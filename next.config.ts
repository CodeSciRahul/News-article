import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.clerk.dev'],
    remotePatterns: [
      {
        protocol: 'https',
          hostname: 'encrypted-tbn0.gstatic.com'
        },
        {
          protocol: 'https',
          hostname: 'images.clerk.dev'
      },
    ]
  },
};

export default nextConfig;
