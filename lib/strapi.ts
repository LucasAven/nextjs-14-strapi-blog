/* eslint-disable sort-keys */
import ky from "ky";
import { revalidateTag } from "next/cache";
import qs from "qs";

import { API_URL } from "@/app/config";
import { FEATURED_BLOG_TAG, LATEST_BLOGS_TAG } from "@/constants/fetchTags";
import { formatStrapiData } from "@/lib/utils";
import {
  Author,
  Blog,
  CollectionTypeResponse,
  PageSharedData,
  Tag,
} from "@/types/cms";

// COLLECTION TYPES
export enum StrapiCollectionTypes {
  AUTHORS = "authors",
  BLOGS = "blogs",
  TAGS = "tags",
}
type CollectionTypesMap = {
  authors: Author;
  blogs: Blog;
  tags: Tag;
};

type strapiOperators = "$eq" | "$ne" | "$lt" | "$lte" | "$gt" | "$gte";
type StrapiFilterValue = Partial<{ [key in strapiOperators]: string }>;
export type StrapiFilters = {
  [key: string]: StrapiFilterValue | StrapiFilters;
};
export type PaginationType = { page: number; pageSize: number };
export type GetCollectionTypeParams<T extends StrapiCollectionTypes> = {
  contentType: T;
  filters?: StrapiFilters;
  id?: string;
  nextCacheConfig?: NextFetchRequestConfig;
  pagination?: PaginationType;
  sort?: `${string}:${"asc" | "desc"}`;
};

// SINGLE TYPES
type StrapiSingleTypes = "page-shared-data";

type StrapiContentTypes = StrapiCollectionTypes | StrapiSingleTypes;

export type LikeDislikeParams = {
  action: "increment" | "decrement";
  blogId: string;
  currentCount: number;
  tagsToInvalidate?: string[];
  type: "like" | "dislike";
};

const strapiClient = ky.extend({
  prefixUrl: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
});
const getPopulateData = (contentType: StrapiContentTypes) => {
  switch (contentType) {
    case "blogs":
      return [
        "author",
        "main_image",
        "related_blogs",
        "related_blogs.tags",
        "related_blogs.main_image",
        "tags",
      ];
    case "tags":
      return ["blogs", "blogs.tags", "blogs.main_image"];
    case "authors":
      return [
        "blogs",
        "blogs.tags",
        "blogs.main_image",
        "profile_image",
        "social_media",
      ];
    case "page-shared-data":
      return ["nav_logo_image", "footer_logo_image", "social_media"];
    default:
      return [];
  }
};

const encodeParams = (params: object) =>
  qs.stringify(params, {
    encodeValuesOnly: true,
  });

export async function getCollectionType<T extends StrapiCollectionTypes>({
  contentType,
  filters = {},
  id,
  nextCacheConfig,
  pagination = { page: 1, pageSize: 1 },
  sort,
}: GetCollectionTypeParams<T>): Promise<
  CollectionTypeResponse<CollectionTypesMap[T]>
> {
  const query = encodeParams({
    id,
    filters: { ...filters },
    pagination: { ...pagination },
    populate: getPopulateData(contentType),
    sort: sort ? [sort] : undefined,
  });

  return await strapiClient
    .get(`${contentType}?${query}`, { next: nextCacheConfig })
    .json()
    .then((res) => formatStrapiData({ isPaginated: true, strapiObject: res }))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return {
        data: [],
        pagination: null,
      };
    });
}

export async function getSingleType(
  contentType: StrapiSingleTypes,
): Promise<PageSharedData> {
  const query = encodeParams({
    populate: getPopulateData(contentType),
  });

  return await strapiClient
    .get(`${contentType}/?${query}`)
    .json()
    .then(
      (res) => formatStrapiData({ isPaginated: false, strapiObject: res }).data,
    )
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return null;
    });
}

export async function updateBlogLikes({
  action = "increment",
  blogId,
  currentCount,
  tagsToInvalidate,
  type,
}: LikeDislikeParams) {
  type LikeDislikeType = keyof Pick<Blog, "likes_count" | "dislikes_count">;

  const field: LikeDislikeType =
    type === "like" ? "likes_count" : "dislikes_count";
  const fieldValue =
    action === "increment" ? currentCount + 1 : currentCount - 1;

  if (fieldValue < 0) return;

  await strapiClient
    .put(`blogs/${blogId}`, {
      json: {
        data: {
          [field]: fieldValue,
        },
      },
    })
    .json()
    .then(() =>
      tagsToInvalidate
        ? tagsToInvalidate.forEach((tag) => revalidateTag(tag))
        : null,
    )
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return [];
    });
}

export async function getFeaturedBlog() {
  const { data: mostLikedBlogs } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    nextCacheConfig: {
      tags: [FEATURED_BLOG_TAG],
    },
    pagination: {
      page: 1,
      pageSize: 1,
    },
    sort: "likes_count:desc",
  });

  return mostLikedBlogs[0] as Blog;
}

export async function getLatestBlogs({
  amount,
  featuredBlogSlug,
}: {
  amount: number;
  featuredBlogSlug: string;
}) {
  const { data: latestBlogs } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    nextCacheConfig: {
      tags: [LATEST_BLOGS_TAG],
    },
    pagination: {
      page: 1,
      pageSize: amount,
    },
    filters: {
      slug: {
        $ne: featuredBlogSlug,
      },
    },
    sort: "publishedAt:desc",
  });

  return latestBlogs as Blog[];
}
