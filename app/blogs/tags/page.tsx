import { Metadata } from "next";
import Link from "next/link";

import EmailCTA from "@/components/ui/EmailCTA";
import { PAGE_CONSTANTS } from "@/constants/page";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { getCollectionType, StrapiCollectionTypes } from "@/lib/strapi";

/* eslint-disable sort-keys */
export const metadata: Metadata = {
  alternates: {
    canonical: `${PAGE_CONSTANTS.siteUrl}${INTERNAL_ROUTES.TAGS}`,
  },
  title: "All Tags",
  openGraph: {
    title: "All Tags",
    type: "website",
    siteName: PAGE_CONSTANTS.siteName,
    description: "",
    url: `${PAGE_CONSTANTS.siteUrl}${INTERNAL_ROUTES.TAGS}`,
  },
  twitter: {
    card: "summary_large_image",
    title: "All Tags",
    description: "",
  },
};
/* eslint-enable sort-keys */

export default async function TagsPage() {
  const { data: tags } = await getCollectionType({
    contentType: StrapiCollectionTypes.TAGS,
    pagination: { page: 1, pageSize: 99 },
  });

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="pb-5 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:pb-10 md:text-5xl lg:text-6xl">
        Tags
      </h1>
      <ul className="mx-auto px-4 sm:px-14 md:ml-0 md:px-28">
        {tags.map((tag) => (
          <li
            key={tag.name}
            className="text-xl font-semibold tracking-tighter text-foreground hover:underline sm:text-3xl"
          >
            <Link href={`${INTERNAL_ROUTES.TAGS}/${tag.name}`}>
              {tag.name}{" "}
              <span className="text-primary">({tag.blogs.length})</span>
            </Link>
          </li>
        ))}
      </ul>
      <EmailCTA className="mt-20" />
    </main>
  );
}
