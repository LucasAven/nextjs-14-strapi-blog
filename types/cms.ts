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

export interface RelatedBlogsContent extends ContentTypeExtraFields {
  id: string;
  slug: string;
  title: string;
}

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

export interface Blog extends ContentTypeExtraFields {
  category: Category;
  content: string;
  dislikes_count: number;
  id: string;
  likes_count: number;
  main_image: ImageContent;
  preview_text: string;
  related_blogs: RelatedBlogsContent[];
  slug: string;
  tags: Tag[];
  thumbnail: ImageContent;
  title: string;
}

// SINGLE TYPES
export interface PageSharedData {
  footer_logo_image: ImageContent;
  github_link: string;
  instagram_link: string;
  linkedin_link: string;
  nav_logo_image: ImageContent;
  twitter_link: string;
  youtube_link: string;
}
