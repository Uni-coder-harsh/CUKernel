// /CUKernel/frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Tells Next.js to skip transpilation for Mapbox GL JS
  transpilePackages: ['mapbox-gl'], 
};

module.exports = nextConfig;