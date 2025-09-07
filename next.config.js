/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking for production
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds for now
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  experimental: {
    // optimizeCss: true, // Disabled due to build issues
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
