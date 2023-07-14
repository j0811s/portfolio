const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sassOptions: {
  //   includePaths: [path.join(__dirname, 'styles')]
  // },
  images: {
    domains: ['images.microcms-assets.io', 'placehold.jp']
  }
};

module.exports = withVanillaExtract(nextConfig);
