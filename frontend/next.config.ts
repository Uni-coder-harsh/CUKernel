// /CUKernel/frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Force transpilation bypass
  transpilePackages: ['mapbox-gl'], 
};
module.exports = nextConfig;