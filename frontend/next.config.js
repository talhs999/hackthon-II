/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  },
};

module.exports = nextConfig;