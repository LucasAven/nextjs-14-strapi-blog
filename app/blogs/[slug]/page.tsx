import { redirect } from "next/navigation";

import LikeAndShareSection from "@/components/ui/BlogCard/LikeAndShareSection";
import BlogHeader from "@/components/ui/BlogHeader";
import BlogsGrid from "@/components/ui/BlogsGrid";
import CustomMarkdown from "@/components/ui/CustomMarkdown";
import EmailCTA from "@/components/ui/EmailCTA";
import { FEATURED_BLOG_TAG, LATEST_BLOGS_TAG } from "@/constants/fetchTags";
import { INTERNAL_ROUTES } from "@/constants/routes";
import {
  getCollectionType,
  getFeaturedBlog,
  getLatestBlogs,
  StrapiCollectionTypes,
} from "@/lib/strapi";
import { cn } from "@/lib/utils";

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) {
    redirect(INTERNAL_ROUTES.BLOGS);
  }

  const { data } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    filters: { slug: { $eq: slug } },
    nextCacheConfig: {
      tags: [slug],
    },
  });
  const blog = data[0];

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
      <section className="relative flex min-h-screen flex-col items-center bg-secondary ">
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
                  component: ({ children }) => (
                    <h2 className="!mt-10 text-[28px] leading-tight md:!mt-16 md:text-4xl lg:text-[40px]">
                      {children}
                    </h2>
                  ),
                },
                h3: {
                  component: ({ children }) => (
                    <h3 className="!mt-10 text-2xl leading-tight md:!mt-16 md:text-3xl lg:text-[32px]">
                      {children}
                    </h3>
                  ),
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
      </section>
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
    </>
  );
}

export async function generateStaticParams() {
  const { data: blogs } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    pagination: { page: 1, pageSize: 9 },
  });

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}
