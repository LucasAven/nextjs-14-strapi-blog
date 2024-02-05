/* eslint-disable sort-keys */
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://lucas-tech-blog.vercel.app/sitemap.xml",
  };
}
