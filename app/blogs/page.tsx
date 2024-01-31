import { Metadata } from "next";
import { redirect } from "next/navigation";

import Pagination from "@/components/Pagination";
import BlogsGrid from "@/components/ui/BlogsGrid";
import EmailCTA from "@/components/ui/EmailCTA";
import { PAGE_CONSTANTS } from "@/constants/page";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { getCollectionType, StrapiCollectionTypes } from "@/lib/strapi";

/*
 * rel="prev" and rel="next" are used to indicate the relationship between component URLs in a paginated series.
 * even though Google says they don't use it anymore, it's still a good practice to have it for other search engines
 * and for accessibility as stated here: https://ahrefs.com/blog/rel-prev-next-pagination/#should-seos-remove-rel-prev-next
 */
function generatePaginatedLinks({
  currentPage,
  page,
  pageCount,
}: {
  currentPage: number;
  page: number;
  pageCount: number;
}) {
  const correctLinks = [];
  if (page > 1 && currentPage === page) {
    correctLinks.push({
      rel: "prev",
      url: `${PAGE_CONSTANTS.siteUrl}${INTERNAL_ROUTES.BLOGS}?page=${page - 1}`,
    });
  }
  if (page < pageCount) {
    correctLinks.push({
      rel: "next",
      url: `${PAGE_CONSTANTS.siteUrl}${INTERNAL_ROUTES.BLOGS}?page=${page + 1}`,
    });
  }
  return correctLinks;
}

/* eslint-disable sort-keys */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page: string };
}): Promise<Metadata> {
  const { page } = searchParams;
  const parsedPage = page ? Number(page) : 1;

  const { pagination } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    pagination: { page: parsedPage, pageSize: 1 },
  });

  const canonicalUrl =
    parsedPage > 1
      ? `${PAGE_CONSTANTS.siteUrl}${INTERNAL_ROUTES.BLOGS}/?page=${parsedPage}`
      : `${PAGE_CONSTANTS.siteUrl}${INTERNAL_ROUTES.BLOGS}`;

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    title: {
      absolute: !!page
        ? `Blog Posts - ${parsedPage} of ${pagination.pageCount} - ${PAGE_CONSTANTS.siteName}`
        : `Blog Posts | ${PAGE_CONSTANTS.siteName}`,
    },
    // * little hack to get a custom link tags in the head (without having to use layout or next/head(deprecated in app router))
    icons: {
      other: generatePaginatedLinks({
        currentPage: parsedPage,
        page: pagination.page,
        pageCount: pagination.pageCount,
      }),
    },
    openGraph: {
      title: `Blog Posts | ${PAGE_CONSTANTS.siteName}`,
      type: "website",
      siteName: PAGE_CONSTANTS.siteName,
      description: PAGE_CONSTANTS.siteDescription,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `Blog Posts | ${PAGE_CONSTANTS.siteName}`,
      description: PAGE_CONSTANTS.siteDescription,
    },
  };
}
/* eslint-enable sort-keys */

export default async function Blogs({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const { page } = searchParams;
  const parsedPage = page ? Number(page) : 1;

  if (!parsedPage) {
    redirect(INTERNAL_ROUTES.BLOGS);
  }

  const { data: blogs, pagination } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    pagination: { page: parsedPage, pageSize: 3 },
  });

  if (!blogs.length) {
    redirect(INTERNAL_ROUTES.BLOGS);
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center p-5 md:p-10 xl:p-14"
      id="main"
    >
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
        Blog Posts
      </h1>
      <BlogsGrid blogs={blogs} imagePriority />
      <Pagination {...pagination} className="mt-5" />
      <EmailCTA className="mt-10" />
    </main>
  );
}
