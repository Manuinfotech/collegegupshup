import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      // Allow supabase storage in production
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  }
};

export default nextConfig;
