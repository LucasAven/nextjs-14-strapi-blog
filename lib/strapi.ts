/* eslint-disable sort-keys */
import ky, { Options } from "ky";
import { revalidateTag } from "next/cache";
import qs from "qs";

import { API_TOKEN, API_URL } from "@/app/config";
import { FEATURED_BLOG_TAG, LATEST_BLOGS_TAG } from "@/constants/fetchTags";
import { formatStrapiData } from "@/lib/utils";
import {
  Author,
  Blog,
  CollectionTypeResponse,
  PageSharedData,
  Tag,
} from "@/types/cms";

type GetGenericTypeParams = {
  fetchOptions?: Omit<Options, "next">;
  nextCacheConfig?: NextFetchRequestConfig;
  sort?: `${string}:${"asc" | "desc"}`;
};
// COLLECTION TYPES
export enum StrapiCollectionTypes {
  AUTHORS = "authors",
  BLOGS = "blogs",
  TAGS = "tags",
}
export type CollectionTypesMap = {
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
  pagination?: PaginationType;
} & GetGenericTypeParams;

// SINGLE TYPES
type GetSingleTypeParams = {
  contentType: StrapiSingleTypes;
} & GetGenericTypeParams;
export enum StrapiSingleTypes {
  PAGE_SHARED_DATA = "page-shared-data",
}

export type StrapiContentTypes = StrapiCollectionTypes | StrapiSingleTypes;

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
    Authorization: `Bearer ${API_TOKEN}`,
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
        "seo",
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
        "seo",
      ];
    case "page-shared-data":
      return ["nav_logo_image", "footer_logo_image", "social_media"];
    default:
      return [];
  }
};

const createQueryParams = (
  contentType: StrapiContentTypes,
  params: object = {},
) =>
  qs.stringify(
    { populate: getPopulateData(contentType), ...params },
    { encodeValuesOnly: true },
  );

export async function getCollectionType<T extends StrapiCollectionTypes>({
  contentType,
  fetchOptions,
  filters = {},
  id,
  nextCacheConfig,
  pagination = { page: 1, pageSize: 1 },
  sort,
}: GetCollectionTypeParams<T>): Promise<
  CollectionTypeResponse<CollectionTypesMap[T]>
> {
  const query = createQueryParams(contentType, {
    id,
    filters: { ...filters },
    pagination: { ...pagination },
    sort: sort ? [sort] : undefined,
  });

  return await strapiClient
    .get(`${contentType}?${query}`, { next: nextCacheConfig, ...fetchOptions })
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

export async function getSingleType({
  contentType,
  fetchOptions,
  nextCacheConfig,
  sort,
}: GetSingleTypeParams): Promise<PageSharedData> {
  const query = createQueryParams(contentType, {
    sort: sort ? [sort] : undefined,
  });
  return await strapiClient
    .get(`${contentType}/?${query}`, {
      next: nextCacheConfig,
      ...fetchOptions,
    })
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

export async function getBlogBySlug(slug: string) {
  const { data } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    filters: { slug: { $eq: slug } },
    nextCacheConfig: {
      tags: [slug],
    },
  });
  return data[0];
}
