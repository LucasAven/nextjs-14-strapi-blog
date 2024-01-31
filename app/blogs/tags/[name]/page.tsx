import { Metadata } from "next";

import BlogsGrid from "@/components/ui/BlogsGrid";
import EmailCTA from "@/components/ui/EmailCTA";
import { PAGE_CONSTANTS } from "@/constants/page";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { getCollectionType, StrapiCollectionTypes } from "@/lib/strapi";

/* eslint-disable sort-keys */
export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> {
  const { name } = params;

  const { data: tags } = await getCollectionType({
    contentType: StrapiCollectionTypes.TAGS,
    // decodeURIComponent is needed because of the %20 in the name
    filters: { name: { $eq: decodeURIComponent(name) } },
  });
  const tag = tags[0];

  const canonicalUrl = `${PAGE_CONSTANTS.siteUrl}${INTERNAL_ROUTES.TAGS}/${tag.name}`;
  const pageTitle = `Blog Posts with #${tag.name}`;
  const pageDescription = `Check out all the blog posts with the tag ${tag.name}!`;

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    title: pageTitle,
    description: pageDescription,
    keywords: tag.name,
    openGraph: {
      title: pageTitle,
      type: "website",
      siteName: PAGE_CONSTANTS.siteName,
      description: pageDescription,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}
/* eslint-enable sort-keys */

export default async function TagPage({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;

  const { data: tags } = await getCollectionType({
    contentType: StrapiCollectionTypes.TAGS,
    // decodeURIComponent is needed because of the %20 in the name
    filters: { name: { $eq: decodeURIComponent(name) } },
  });

  const tag = tags[0];

  return (
    <main className="flex min-h-screen flex-col items-center" id="main">
      <h1 className="pb-5 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:pb-10 md:text-5xl lg:text-6xl">
        # {tag.name}
      </h1>
      <div className="container flex flex-col gap-4 max-md:px-4">
        <BlogsGrid blogs={tag.blogs} imagePriority />
        <EmailCTA className="mt-5" />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const { data: tags } = await getCollectionType({
    contentType: StrapiCollectionTypes.TAGS,
    pagination: { page: 1, pageSize: 99 },
  });

  return tags.map((tag) => ({
    name: tag.name,
  }));
}
