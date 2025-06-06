/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  output: 'export',
  swcMinify: false, // Add this line to use Terser for minification
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ignoreBuildErrors: true, // Keep this commented out or remove
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
