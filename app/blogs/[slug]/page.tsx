import { Metadata } from "next";
import { redirect } from "next/navigation";

import LikeAndShareSection from "@/components/ui/BlogCard/LikeAndShareSection";
import BlogHeader from "@/components/ui/BlogHeader";
import BlogsGrid from "@/components/ui/BlogsGrid";
import CustomMarkdown from "@/components/ui/CustomMarkdown";
import EmailCTA from "@/components/ui/EmailCTA";
import { FEATURED_BLOG_TAG, LATEST_BLOGS_TAG } from "@/constants/fetchTags";
import { PAGE_CONSTANTS } from "@/constants/page";
import { INTERNAL_ROUTES } from "@/constants/routes";
import {
  getBlogBySlug,
  getCollectionType,
  getFeaturedBlog,
  getLatestBlogs,
  StrapiCollectionTypes,
} from "@/lib/strapi";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const { data } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    filters: { slug: { $eq: slug } },
  });
  const blog = data[0];
  const seo = blog.seo;

  const keywords = seo.keywords ?? blog.tags.map((t) => t.name);
  const canonicalUrl = `${PAGE_CONSTANTS.siteUrl}/${blog.slug}`;
  const pageTitle = seo.page_title ?? blog.title;

  /* eslint-disable sort-keys */
  return {
    title: pageTitle,
    description: seo.page_description ?? blog.preview_text,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [
      {
        name: blog.author.name,
        url: `${PAGE_CONSTANTS.siteUrl}/${blog.author.slug}`,
      },
    ],
    openGraph: {
      authors: [blog.author.name],
      description: seo.og_description,
      publishedTime: blog.publishedAt,
      siteName: PAGE_CONSTANTS.siteName,
      tags: keywords,
      title: seo.og_title,
      type: "article",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      description: seo.og_description,
      title: seo.og_title,
    },
  };
  /* eslint-enable sort-keys */
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) {
    redirect(INTERNAL_ROUTES.BLOGS);
  }

  const blog = await getBlogBySlug(slug);

  // Cached  and decoupled request for featured blog
  const featuredBlog = await getFeaturedBlog();
  const isInFeaturedBlog = featuredBlog.slug === slug;
  // Cached  and decoupled request for latest blogs
  const latestBlogs = await getLatestBlogs({
    amount: 6,
    featuredBlogSlug: featuredBlog.slug,
  });
  const isInLatestBlogs = latestBlogs.find((b) => b.slug === slug);

  const tagsToInvalidate = [
    blog.slug,
    isInLatestBlogs ? LATEST_BLOGS_TAG : null,
    isInFeaturedBlog ? FEATURED_BLOG_TAG : null,
  ].filter(Boolean);

  return (
    <>
      <main
        className="relative flex min-h-screen flex-col items-center bg-secondary"
        id="main"
      >
        <BlogHeader blog={blog} className="pt-10" />
        <div
          key={blog.slug}
          className={
            "relative z-10 -mt-[35vw] flex h-full w-full flex-col items-center border-t border-gray-300 bg-background pt-10 sm:mt-[-30px] md:!mt-[-150px] lg:!mt-[-210px] lg:flex-row xl:!mt-[-150px] [@media_(min-width:425px)]:-mt-20"
          }
        >
          <CustomMarkdown
            className="ml-auto max-w-5xl space-y-6 px-6 text-base md:text-lg lg:mx-auto"
            options={{
              overrides: {
                h2: {
                  props: {
                    className:
                      "!mt-10 mb-4 text-[28px] leading-tight md:!mt-16 md:text-4xl lg:text-[40px]",
                  },
                },
                h3: {
                  props: {
                    className:
                      "!mt-10 mb-4 text-2xl leading-tight md:!mt-16 md:text-3xl lg:text-[32px]",
                  },
                },
              },
            }}
          >
            {blog.content}
          </CustomMarkdown>
          <LikeAndShareSection
            blogId={blog.id}
            className="px-4 max-md:w-full max-md:xxs:px-8 lg:sticky lg:top-20 lg:flex lg:self-start lg:pr-8"
            dislikes={blog.dislikes_count}
            likes={blog.likes_count}
            tagsToInvalidate={tagsToInvalidate}
          />
        </div>
        <EmailCTA className="relative w-full bg-background pt-0 md:pt-5 lg:pt-20" />
        <section
          className={cn(
            "container relative flex flex-col gap-4 bg-background max-md:px-4",
            !blog.related_blogs.length && "hidden",
          )}
        >
          <h2 className="text-center text-3xl font-bold tracking-tighter md:text-left md:text-4xl lg:text-5xl">
            Continue reading
          </h2>
          <BlogsGrid blogs={blog.related_blogs} />
        </section>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  const { data: blogs } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    pagination: { page: 1, pageSize: 99 },
  });

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}
