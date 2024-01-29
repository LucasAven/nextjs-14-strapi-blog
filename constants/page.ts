import { getBaseUrl } from "@/lib/utils";

export const PAGE_CONSTANTS = {
  siteDescription: "A blog about technology, programming, and other things.",
  siteKeywords:
    "blog, tech, programming, nextjs, lucas, avendano, lucas avendano, lucasaven",
  siteName: "Lucas' Tech Blog",
  siteUrl: getBaseUrl(),
} as const;
