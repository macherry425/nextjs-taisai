/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['ably'],
  },
  devIndicators: false
};

export default nextConfig;
