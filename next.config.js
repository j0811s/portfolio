const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // distDir: 'dist',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    domains: ['images.microcms-assets.io', 'placehold.jp']
    // unoptimized: true
  }
};

module.exports = withVanillaExtract(nextConfig);
