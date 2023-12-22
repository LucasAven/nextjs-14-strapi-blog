import { AnchorHTMLAttributes } from "react";
import Markdown from "markdown-to-jsx";
import Link from "next/link";
import { redirect } from "next/navigation";

import { StrapiImage } from "@/components/StrapiImage";
import LikesSection from "@/components/ui/BlogCard/LikesSection";
import { FEATURED_BLOG_TAG, LATEST_BLOGS_TAG } from "@/constants/fetchTags";
import { INTERNAL_ROUTES } from "@/constants/routes";
import {
  getCollectionType,
  getFeaturedBlog,
  getLatestBlogs,
} from "@/lib/strapi";

const getCorrectAnchor = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const commonClasses = "text-primary underline";

  if (props.href.startsWith("/") && props.target !== "_blank") {
    return <Link href={props.href} {...props} className={commonClasses} />;
  }
  return <a href={props.href} {...props} className={commonClasses} />;
};

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
    contentType: "blogs",
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
    <section className="flex min-h-screen flex-col items-center p-24">
      <div key={blog.slug} className="flex flex-col items-center">
        <h3 className="text-3xl font-bold">{blog.title}</h3>
        <LikesSection
          blogId={blog.id}
          dislikes={blog.dislikes_count}
          likes={blog.likes_count}
          tagsToInvalidate={tagsToInvalidate}
        />
        <Markdown
          className="prose"
          options={{
            overrides: {
              a: getCorrectAnchor,
            },
          }}
        >
          {blog.content}
        </Markdown>
        {blog.main_image && <StrapiImage image={blog.main_image} />}
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const { data: blogs } = await getCollectionType({
    contentType: "blogs",
    pagination: { page: 1, pageSize: 9 },
  });

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}
