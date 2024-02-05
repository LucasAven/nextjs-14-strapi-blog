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
      | "main_image"
      | "tags"
      | "createdAt"
    > {}

export interface Tag extends ContentTypeExtraFields {
  blogs: Blog[];
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
  blogs: Blog[];
  description: string;
  id: string;
  name: string;
  profile_image: ImageContent;
  seo: SeoComponent;
  slug: string;
  social_media: SocialMedia;
}

export interface Blog extends ContentTypeExtraFields {
  author: Pick<Author, "id" | "name" | "slug">;
  content: string;
  dislikes_count: number;
  id: string;
  likes_count: number;
  main_image: ImageContent;
  preview_text: string;
  readingTime: string;
  related_blogs: RelatedBlogsContent[];
  seo: SeoComponent;
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

// COMPONENTS
export interface SeoComponent extends ContentTypeExtraFields {
  id: string;
  keywords?: string;
  og_description: string;
  og_title: string;
  page_description: string;
  page_title?: string;
}
