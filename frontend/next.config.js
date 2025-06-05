/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors during build
  },
  
  // Add webpack configuration to handle potential module issues
  webpack: (config, { isServer, dev }) => {
    // Handle client-side fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        canvas: false,
      };
    }
    
    // Fix for dynamic imports in static exports
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    
    // Handle PDF and document processing libraries
    config.module.rules.push({
      test: /\.(pdf|node)$/,
      use: 'null-loader',
    });
    
    return config;
  },
  
  // Disable server-side features that don't work with static export
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;
