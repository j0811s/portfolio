/** @type {import('next').NextConfig} */
import { createVanillaExtractPlugin }from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  // output: 'export',
  // distDir: 'dist',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
      {
        protocol: 'https',
        hostname: 'placehold.jp',
      },
    ],
    // unoptimized: true
  }
};

export default withVanillaExtract(nextConfig);
