export interface ContentTypeExtraFields {
  createdAt: string;
  locale: string;
  publishedAt: string;
  updatedAt: string;
}
export interface CollectionTypePagination {
  limit: number;
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface ImageContent extends ContentTypeExtraFields {
  alternativeText?: string;
  ext?: string;
  height: number;
  name: string;
  url: string;
  width: number;
}

export interface RelatedBlogsContent
  extends ContentTypeExtraFields,
    Pick<
      Blog,
      | "id"
      | "slug"
      | "title"
      | "preview_text"
      | "category"
      | "main_image"
      | "tags"
      | "createdAt"
    > {}

export interface Category extends ContentTypeExtraFields {
  id: string;
  name: string;
}

export interface Tag extends ContentTypeExtraFields {
  id: string;
  name: string;
}

export interface CollectionTypeResponse<T> {
  data: T[];
  pagination: CollectionTypePagination;
}

export interface SocialMedia {
  github: string;
  id: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

export interface Author extends ContentTypeExtraFields {
  blogs: RelatedBlogsContent[];
  description: string;
  id: string;
  name: string;
  profile_image: ImageContent;
  slug: string;
  social_media: SocialMedia;
}

export interface Blog extends ContentTypeExtraFields {
  author: Pick<Author, "id" | "name" | "slug">;
  category: Category;
  content: string;
  dislikes_count: number;
  id: string;
  likes_count: number;
  main_image: ImageContent;
  preview_text: string;
  readingTime: string;
  related_blogs: RelatedBlogsContent[];
  slug: string;
  tags: Tag[];
  title: string;
}

// SINGLE TYPES
export interface PageSharedData {
  footer_logo_image: ImageContent;
  nav_logo_image: ImageContent;
  social_media: SocialMedia;
}
