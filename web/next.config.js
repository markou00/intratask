/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Needed for Azure deployment
  output: "standalone",
};

module.exports = nextConfig;
