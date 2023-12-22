/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NODE_ENV === "development" ? "127.0.0.1" : ""],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
