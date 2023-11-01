/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NODE_ENV === "development" ? "127.0.0.1" : ""],
  },
};

module.exports = nextConfig;
