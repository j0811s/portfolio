/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: 'export',
  // distDir: 'dist',
  trailingSlash: true,
  serverExternalPackages: ['just-bash', '@wterm/just-bash'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
    ],
    // unoptimized: true
  },
};

export default nextConfig;
