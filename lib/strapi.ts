/* eslint-disable sort-keys */
import ky from "ky";
import qs from "qs";

import { API_URL } from "@/app/config";
import { parseStrapiObject } from "@/lib/utils";
import { Blog, CollectionTypeResponse, PageSharedData } from "@/types/cms";

type StrapiCollectionTypes = "blogs" | "category" | "tags";
type StrapiSingleTypes = "page-shared-data";
type StrapiContentTypes = StrapiCollectionTypes | StrapiSingleTypes;

type strapiOperators = "$eq" | "$ne" | "$lt" | "$lte" | "$gt" | "$gte";
type GetCollectionTypeParams = {
  contentType: StrapiCollectionTypes;
  filters?: { [key: string]: Partial<{ [key in strapiOperators]: string }> };
  id?: string;
  pagination?: { page: number; pageSize: number };
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
        "thumbnail",
        "main_image",
        "related_blogs",
        "slug",
        "category",
        "tags",
      ];
    case "category":
      return ["blogs", "blogs.thumbnail", "blogs.slug"];
    case "tags":
      return ["blogs", "blogs.thumbnail", "blogs.slug"];
    case "page-shared-data":
      return ["nav_logo_image", "footer_logo_image"];
    default:
      return [];
  }
};

const encodeParams = (params: object) =>
  qs.stringify(params, {
    encodeValuesOnly: true,
  });

export async function getCollectionType({
  contentType,
  filters = {},
  id,
  pagination = { page: 1, pageSize: 1 },
}: GetCollectionTypeParams): Promise<CollectionTypeResponse<Blog>> {
  const query = encodeParams({
    id,
    filters: { ...filters },
    pagination: { ...pagination },
    populate: getPopulateData(contentType),
  });

  return await strapiClient
    .get(`${contentType}?${query}`)
    .json()
    .then((res) => parseStrapiObject(res))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return [];
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
    .then((res) => parseStrapiObject(res))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return [];
    });
}
