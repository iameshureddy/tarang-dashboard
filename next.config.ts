/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;