import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'profile.line-scdn.net'],
  },
};

export default nextConfig;
