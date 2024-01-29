import { GeistSans } from "geist/font";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import SkipToContentLink from "@/components/ui/SkipToContentLink";
import { SHARED_DATA_TAG } from "@/constants/fetchTags";
import { PAGE_CONSTANTS } from "@/constants/page";
import { getSingleType, StrapiSingleTypes } from "@/lib/strapi";

export const metadata: Metadata = {
  description: PAGE_CONSTANTS.siteDescription,
  keywords: PAGE_CONSTANTS.siteKeywords,
  openGraph: {
    description: PAGE_CONSTANTS.siteDescription,
    siteName: PAGE_CONSTANTS.siteName,
    title: PAGE_CONSTANTS.siteName,
    type: "website",
    url: PAGE_CONSTANTS.siteUrl,
  },
  title: {
    default: PAGE_CONSTANTS.siteName,
    template: `%s | ${PAGE_CONSTANTS.siteName}`,
  },
  twitter: {
    card: "summary_large_image",
    description: PAGE_CONSTANTS.siteDescription,
    title: PAGE_CONSTANTS.siteName,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { nav_logo_image, social_media } = await getSingleType({
    contentType: StrapiSingleTypes.PAGE_SHARED_DATA,
    nextCacheConfig: {
      tags: [SHARED_DATA_TAG],
    },
  });

  return (
    <html lang="en">
      <body
        className={`${GeistSans.className} relative bg-background pt-20 text-foreground`}
      >
        <SkipToContentLink />
        <Navbar logo={nav_logo_image} />
        <div className="relative z-10 rounded-bl-[50px] rounded-br-[50px] bg-background pb-10">
          {children}
        </div>
        <Footer links={social_media} logo={nav_logo_image} />
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
