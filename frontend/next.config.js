/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint during builds
  },
  
  // Add webpack configuration to handle potential module issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
