/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint checking during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking during builds
  },
  images: { 
    unoptimized: true 
  },
  trailingSlash: true,
  // Add experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
