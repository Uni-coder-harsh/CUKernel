// /CUKernel/frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Keep this active to bypass issues with Mapbox's structure
  transpilePackages: ['mapbox-gl', '@mapbox/mapbox-gl-geocoder'], 

  // No complex Webpack alias is needed if the install command works
};

module.exports = nextConfig;