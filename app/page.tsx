import { Metadata } from "next";

import FeaturedBlogCard from "@/components/ui/BlogCard/FeaturedBlogCard";
import BlogsGrid from "@/components/ui/BlogsGrid";
import EmailCTA from "@/components/ui/EmailCTA";
import EmailForm from "@/components/ui/EmailCTA/EmailForm";
import { PAGE_CONSTANTS } from "@/constants/page";
import { getFeaturedBlog, getLatestBlogs } from "@/lib/strapi";

/* eslint-disable sort-keys */
export const metadata: Metadata = {
  alternates: {
    canonical: PAGE_CONSTANTS.siteUrl,
  },
  title: `Home | ${PAGE_CONSTANTS.siteName}`,
  openGraph: {
    title: PAGE_CONSTANTS.ogSiteTitle,
    type: "website",
    siteName: PAGE_CONSTANTS.siteName,
    description: PAGE_CONSTANTS.ogSiteDescription,
    url: PAGE_CONSTANTS.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_CONSTANTS.ogSiteTitle,
    description: PAGE_CONSTANTS.ogSiteDescription,
  },
};
/* eslint-enable sort-keys */

// TODO: make repetitive api call into a function

export default async function Home() {
  const featuredBlog = await getFeaturedBlog();
  const latestBlogs = await getLatestBlogs({
    amount: 6,
    featuredBlogSlug: featuredBlog.slug,
  });

  return (
    <main className="flex flex-col" id="main">
      <section className="container pb-20 pt-16 max-sm:px-4">
        <div className="mb-10 flex flex-col gap-4 text-center md:mb-20">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Lucas&apos; Tech Blog
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
            From Lines of Code to Digital Stories: join my journey into{" "}
            <span className="text-primary">Tech</span> and{" "}
            <span className="text-primary">web development</span>!
          </p>
          <EmailForm className="mt-5" showInputOnly />
        </div>
        <FeaturedBlogCard data={featuredBlog} />
      </section>
      <section className="container flex flex-col gap-4 max-md:px-4">
        <h2 className="text-center text-3xl font-bold tracking-tighter md:text-left md:text-4xl lg:text-5xl">
          Latest Blog Posts
        </h2>
        <BlogsGrid blogs={latestBlogs} />
        <EmailCTA />
      </section>
    </main>
  );
}
