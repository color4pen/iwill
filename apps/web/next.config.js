/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'profile.line-scdn.net', 'dsbbmmw2icjvs.cloudfront.net'],
  },
  transpilePackages: ["@repo/ui"],
  // ミドルウェアを適用するための設定
  experimental: {
    // 必要に応じて実験的な機能を有効化
  },
};

export default nextConfig;
