/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // optimizeCss: true, disabled due to breaking builds
    webVitalsAttribution: ["CLS", "LCP"],
  },
  images: {
    deviceSizes: [320, 640, 660, 768, 1024, 1600],
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
