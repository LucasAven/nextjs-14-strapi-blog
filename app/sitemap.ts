/* eslint-disable sort-keys */
import { MetadataRoute } from "next";

import { PAGE_CONSTANTS } from "@/constants/page";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { getCollectionType, StrapiCollectionTypes } from "@/lib/strapi";

const URL = PAGE_CONSTANTS.siteUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: authors } = await getCollectionType({
    contentType: StrapiCollectionTypes.AUTHORS,
    pagination: { page: 1, pageSize: 99 },
  });

  const { data: blogs } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    pagination: { page: 1, pageSize: 99 },
  });

  const { data: tags } = await getCollectionType({
    contentType: StrapiCollectionTypes.TAGS,
    pagination: { page: 1, pageSize: 99 },
  });

  return [
    {
      url: URL,
      lastModified: new Date(),
    },
    {
      url: `${URL}${INTERNAL_ROUTES.BLOGS}`,
      lastModified: new Date(),
    },
    ...blogs.map((blog) => ({
      url: `${URL}${INTERNAL_ROUTES.BLOGS}/${blog.slug}`,
      lastModified: blog.updatedAt,
    })),
    {
      url: `${URL}${INTERNAL_ROUTES.TAGS}`,
      lastModified: new Date(),
    },
    ...tags.map((tag) => ({
      url: `${URL}${INTERNAL_ROUTES.TAGS}/${encodeURIComponent(tag.name)}`,
      lastModified: tag.updatedAt,
    })),
    ...authors.map((author) => ({
      url: `${URL}${INTERNAL_ROUTES.AUTHOR}/${author.slug}`,
      lastModified: author.updatedAt,
    })),
  ];
}
