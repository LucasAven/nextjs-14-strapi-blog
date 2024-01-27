/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // optimizeCss: true, disabled due to breaking builds
    webVitalsAttribution: ["CLS", "LCP"],
  },
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
