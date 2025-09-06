import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'profile.line-scdn.net', 'dsbbmmw2icjvs.cloudfront.net'],
  },
};

export default nextConfig;
