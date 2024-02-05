import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

import {
  BLOGS_PAGE_TAG,
  FEATURED_BLOG_TAG,
  LATEST_BLOGS_TAG,
  SHARED_DATA_TAG,
} from "@/constants/fetchTags";
import { INTERNAL_ROUTES } from "@/constants/routes";
import {
  CollectionTypesMap,
  StrapiCollectionTypes,
  StrapiContentTypes,
  StrapiSingleTypes,
} from "@/lib/strapi";
import { MakeSingularWord } from "@/lib/utils";
import { Blog, PageSharedData, RelatedBlogsContent } from "@/types/cms";

interface ModifiedEntryBodyRequest<T extends StrapiContentTypes> {
  model: T;
  previousEntry: T extends StrapiCollectionTypes
    ? CollectionTypesMap[T]
    : PageSharedData;
  updatedEntry: T extends StrapiCollectionTypes
    ? CollectionTypesMap[T]
    : PageSharedData;
  // eslint-disable-next-line typescript-sort-keys/interface
  deletedEntry?: T extends StrapiCollectionTypes
    ? CollectionTypesMap[T]
    : PageSharedData;
}

type StrapiContentTypesSingularVersion<T extends StrapiContentTypes> =
  T extends StrapiCollectionTypes
    ? MakeSingularWord<StrapiCollectionTypes>
    : `${StrapiSingleTypes}`;

/**
 * Combines two arrays of blog posts into a single array, ensuring that the
 * resulting array contains only unique blog posts based on the slug.
 * @param blogArray - The first array of blog posts
 * @param blogArray2 - The second array of blog posts
 * @returns A single array of blog posts containing only unique blog posts
 * based on the slug
 * @example
 * const blogArray = [{ slug: "blog-1" }, { slug: "blog-2" }];
 * const blogArray2 = [{ slug: "blog-2" }, { slug: "blog-3" }];
 * const combinedArray = combineUniqueBlogPosts(blogArray, blogArray2);
 * // combinedArray = [{ slug: "blog-1" }, { slug: "blog-2" }, { slug: "blog-3" }]
 **/
function combineUniqueBlogPosts(blogArray: Blog[], blogArray2: Blog[]) {
  const combinedArray = [...blogArray, ...blogArray2];

  // Use a Map to ensure uniqueness based on the slug
  const uniquePostsMap = new Map();

  combinedArray.forEach((post) => {
    if (!uniquePostsMap.has(post.slug)) {
      uniquePostsMap.set(post.slug, post);
    }
  });

  return Array.from(uniquePostsMap.values()) as Blog[];
}

function revalidateBlog({
  previousRelatedBlogs = [],
  revalidateTagsPage,
  updatedBlogEntry,
}: {
  previousRelatedBlogs?: RelatedBlogsContent[];
  revalidateTagsPage: boolean;
  updatedBlogEntry: Blog;
}) {
  // revalidate all cache saved for blog with this slug
  revalidateTag(updatedBlogEntry.slug);
  // revalidate featured blog (currently I don't have a way to check if the blog is featured this could be manage through Strapi later)
  revalidateTag(FEATURED_BLOG_TAG);
  // revalidate latest blogs (currently I don't have a way to check if the blog is in the latest blogs list)
  revalidateTag(LATEST_BLOGS_TAG);
  // revalidate blogs page
  revalidateTag(BLOGS_PAGE_TAG);

  // revalidate author page containing this blog
  revalidateTag(updatedBlogEntry.author.slug);

  // revalidate updated blog's page
  revalidatePath(`${INTERNAL_ROUTES.BLOGS}/${updatedBlogEntry.slug}`, "page");

  // revalidate each blog post page that is inside "related blogposts"
  // (this takes care of the possible added and removed related blogs)
  const uniqueRelatedSlugs = new Set([
    ...previousRelatedBlogs.map((rel) => rel.slug),
    ...updatedBlogEntry.related_blogs.map((rel) => rel.slug),
  ]);
  uniqueRelatedSlugs.forEach((slug) => revalidateTag(slug));

  // only revalidate tags if the tags have changed
  if (revalidateTagsPage) {
    // revalidate tags page
    revalidatePath(INTERNAL_ROUTES.TAGS, "layout");
  }

  // revalidates all tags in the blog (they could be new or removed)
  updatedBlogEntry.tags.forEach((tag) => revalidateTag(tag.name));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const endpointSecret = process.env.WEBHOOK_TOKEN;
  const sig = headers().get("Authorization")?.replace("Bearer ", "") || "";

  if (!endpointSecret) {
    return new Response("No endpoint secret", {
      status: 500,
    });
  }

  if (!sig || sig !== endpointSecret) {
    return new Response("Missing or mismatch authorization signature", {
      status: 401,
    });
  }

  switch (
    body?.model as StrapiContentTypesSingularVersion<StrapiContentTypes>
  ) {
    case "blog":
      const bodyBlog: ModifiedEntryBodyRequest<StrapiCollectionTypes.BLOGS> =
        body;

      if (bodyBlog.deletedEntry) {
        revalidateBlog({
          revalidateTagsPage: true,
          updatedBlogEntry: bodyBlog.deletedEntry,
        });
        break;
      }

      // check if the tag page should be revalidated based on if the blog's
      // tags has changed between the previous and the updated version
      const shouldRevalidateTagPage =
        bodyBlog.previousEntry.tags.length !==
          bodyBlog.updatedEntry.tags.length ||
        bodyBlog.previousEntry.tags.every(
          (tag) => !bodyBlog.updatedEntry.tags.find((t) => t.name === tag.name),
        );

      revalidateBlog({
        previousRelatedBlogs: bodyBlog.previousEntry.related_blogs,
        revalidateTagsPage: shouldRevalidateTagPage,
        updatedBlogEntry: bodyBlog.updatedEntry,
      });
      break;
    case "author":
      const bodyAuthor: ModifiedEntryBodyRequest<StrapiCollectionTypes.AUTHORS> =
        body;

      if (bodyAuthor.deletedEntry) {
        revalidateTag(bodyAuthor.deletedEntry.slug);
        bodyAuthor.deletedEntry.blogs.forEach((blog) =>
          revalidateTag(blog.slug),
        );
        break;
      }

      revalidateTag(bodyAuthor.updatedEntry.slug);
      revalidatePath(
        `${INTERNAL_ROUTES.AUTHOR}/${bodyAuthor.updatedEntry.slug}`,
        "page",
      );

      const uniqueAuthorBlogPosts = combineUniqueBlogPosts(
        bodyAuthor.previousEntry.blogs,
        bodyAuthor.updatedEntry.blogs,
      );
      // revalidate just the blog posts based on their slug
      // (is not necessary to revalidate other blog's tag since the author
      // is only visible on blog post's page)
      uniqueAuthorBlogPosts.forEach((blog) => revalidateTag(blog.slug));
      break;
    case "tag":
      const bodyTag: ModifiedEntryBodyRequest<StrapiCollectionTypes.TAGS> =
        body;

      if (bodyTag.deletedEntry) {
        revalidateTag(bodyTag.deletedEntry.name);

        // get each blog post data that has this tag
        bodyTag.deletedEntry.blogs.forEach((blog, index) =>
          revalidateBlog({
            revalidateTagsPage: index === 0, // this is to avoid multiple revalidations of the tags page which are unnecessary
            updatedBlogEntry: blog,
          }),
        );
        break;
      }

      revalidateTag(bodyTag.updatedEntry.name);

      // get each blog post data that has this tag
      // (this takes care of the possible added and removed blogs)
      const uniqueTaggedBlogPosts = combineUniqueBlogPosts(
        bodyTag.previousEntry.blogs,
        bodyTag.updatedEntry.blogs,
      );
      uniqueTaggedBlogPosts.forEach((blog, index) =>
        revalidateBlog({
          revalidateTagsPage: index === 0, // this is to avoid multiple revalidations of the tags page which are unnecessary
          updatedBlogEntry: blog,
        }),
      );
      break;
    case "page-shared-data":
      revalidateTag(SHARED_DATA_TAG);
      revalidatePath(INTERNAL_ROUTES.HOME, "layout");
      break;
    default:
      return new Response("Unexpected model in body", {
        status: 500,
      });
  }

  return new Response("Content Types revalidated!", {
    status: 200,
  });
}
