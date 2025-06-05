/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
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
        child_process: false,
      };
    }
    
    // Fix for potential minification issues
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    
    return config;
  },
};

module.exports = nextConfig;
