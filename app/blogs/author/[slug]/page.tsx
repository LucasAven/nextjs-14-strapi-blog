import {
  FileText,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import ExternalLink from "@/components/ExternalLink";
import { StrapiImage } from "@/components/StrapiImage";
import CustomMarkdown from "@/components/ui/CustomMarkdown";
import LoadingBlogsList from "@/components/ui/LoadingBlogsList";
import { PAGE_CONSTANTS } from "@/constants/page";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { getCollectionType, StrapiCollectionTypes } from "@/lib/strapi";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const { data } = await getCollectionType({
    contentType: StrapiCollectionTypes.AUTHORS,
    filters: { slug: { $eq: slug } },
    nextCacheConfig: {
      tags: [slug],
    },
  });
  const author = data[0];
  const seo = author.seo;

  const canonicalUrl = `${PAGE_CONSTANTS.siteUrl}${INTERNAL_ROUTES.AUTHOR}/${author.slug}`;
  const pageTitle = seo.page_title ?? author.name;
  const pageDescription =
    seo.page_description ??
    `${author.name}'s author page. Discover more about the author and their blog posts!`;

  /* eslint-disable sort-keys */
  return {
    title: pageTitle,
    description: pageDescription,
    keywords: seo.keywords ?? author.name,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      description: seo.og_description,
      siteName: PAGE_CONSTANTS.siteName,
      title: seo.og_title,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.og_title,
      description: seo.og_description,
    },
  };
  /* eslint-enable sort-keys */
}

export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) {
    redirect(INTERNAL_ROUTES.HOME);
  }

  const { data: authors } = await getCollectionType({
    contentType: StrapiCollectionTypes.AUTHORS,
    filters: { slug: { $eq: slug } },
    nextCacheConfig: {
      tags: [slug],
    },
  });

  const filterByAuthor = { author: { slug: { $eq: slug } } };
  const paginationBlogsByAuthor = { page: 1, pageSize: 3 };

  const { data: authorBlogs, pagination } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    filters: filterByAuthor,
    nextCacheConfig: {
      tags: [slug],
    },
    pagination: paginationBlogsByAuthor,
  });

  if (!authors.length) {
    redirect(INTERNAL_ROUTES.HOME);
  }
  const author = authors[0];
  const socialMedia = Object.entries(author.social_media).filter(
    ([key, value]) => value && key !== "id",
  );

  const socialMediaIconMap = {
    github: <Github focusable="false" size={20} aria-hidden />,
    instagram: <Instagram focusable="false" size={20} aria-hidden />,
    linkedin: <Linkedin focusable="false" size={20} aria-hidden />,
    twitter: <Twitter focusable="false" size={20} aria-hidden />,
    youtube: <Youtube focusable="false" size={20} aria-hidden />,
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center" id="main">
        <section className="pb-8 pt-14 md:pb-14 md:pt-20">
          <div className="container">
            <div className="grid items-center justify-between gap-8 md:grid-cols-2 md:gap-12 xl:items-start xl:gap-8">
              <div className="max-w-[544px] xl:pt-10">
                <h1 className="mb-3 text-3xl font-bold leading-tight sm:font-medium md:text-5xl 2xl:text-[52px]">
                  {author.name}
                </h1>
                {author.blogs.length > 0 ? (
                  <div className="flex items-center gap-1 pb-4 text-xs text-foreground md:text-sm">
                    <FileText size={16} />
                    {author.blogs.length} Articles
                  </div>
                ) : null}
                <CustomMarkdown
                  className="space-y-2 text-base md:text-lg"
                  options={{
                    overrides: {
                      li: {
                        props: {
                          className: "list-disc list-inside",
                        },
                      },
                    },
                  }}
                >
                  {author.description}
                </CustomMarkdown>
                <ul className="mt-4 flex gap-3">
                  {socialMedia &&
                    socialMedia.map(([name, value]) => {
                      return (
                        <li key={name}>
                          <ExternalLink
                            aria-label={`${author.name}'s ${name} link`}
                            className="block rounded-full border-2 border-primary p-2 text-primary transition-blog-card hover:scale-105 hover:border-foreground hover:text-foreground"
                            href={value}
                          >
                            {
                              socialMediaIconMap[
                                name as keyof typeof socialMediaIconMap
                              ]
                            }
                          </ExternalLink>
                        </li>
                      );
                    })}
                </ul>
              </div>
              <div className="mx-auto mt-14 aspect-square h-[262px] w-[262px] rounded-full border-2 border-primary sm:h-[350px] sm:w-[350px] md:ml-auto md:mr-0 md:mt-0 md:h-[100%] md:w-[100%] xl:h-[485px] xl:w-[485px]">
                <StrapiImage
                  className="h-full w-full rounded-full object-cover"
                  image={author.profile_image}
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <section
        className={cn(
          "container relative flex flex-col gap-4 bg-background max-md:px-4",
          !author.blogs.length && "hidden",
        )}
      >
        <h2 className="text-center text-3xl font-bold tracking-tighter md:text-left md:text-4xl lg:text-5xl">
          Check my blog posts
        </h2>
        <LoadingBlogsList
          filters={filterByAuthor}
          initialBlogs={authorBlogs}
          initialHasMore={pagination.pageCount > pagination.page}
          pagination={paginationBlogsByAuthor}
        />
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const { data: authors } = await getCollectionType({
    contentType: StrapiCollectionTypes.AUTHORS,
    pagination: { page: 1, pageSize: 10 },
  });

  return authors.map((author) => ({
    slug: author.slug,
  }));
}
