"use server";

import {
  getCollectionType,
  GetCollectionTypeParams,
  StrapiCollectionTypes,
} from "@/lib/strapi";

export const loadMoreBlogs = async ({
  filters,
  pagination,
  sort,
}: Pick<
  GetCollectionTypeParams<StrapiCollectionTypes.BLOGS>,
  "filters" | "pagination" | "sort"
>) => {
  const { data, pagination: nextPaginationData } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    filters,
    pagination,
    sort,
  });

  return {
    blogs: data,
    pagination: nextPaginationData,
  };
};
