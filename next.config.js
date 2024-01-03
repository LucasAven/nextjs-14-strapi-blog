/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns:
      process.env.NODE_ENV === "development"
        ? [
            {
              hostname: "127.0.0.1",
              protocol: "http",
            },
          ]
        : undefined,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
