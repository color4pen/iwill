/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'profile.line-scdn.net'],
  },
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
