import type { NextConfig } from "next";

// Check if we're using a custom domain (CNAME exists)
const isProduction = process.env.NODE_ENV === 'production';
// When using a custom domain, we don't need a basePath
const useCustomDomain = process.env.USE_CUSTOM_DOMAIN === 'true';
const basePath = isProduction && !useCustomDomain ? '/website' : '';

const nextConfig: NextConfig = {
  /* config options here */
  // Use the GitHub repository name as a base path in production (only if not using custom domain)
  basePath: basePath,
  // Add assetPrefix to ensure styles and assets load correctly
  assetPrefix: basePath,
  // Generate static HTML files
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    // Define image domains if needed
    remotePatterns: [],
  },
  // Disable ESLint during production build
  eslint: {
    // Warning: this will completely disable ESLint during build
    ignoreDuringBuilds: true,
  },
  // Make basePath available to the app
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
