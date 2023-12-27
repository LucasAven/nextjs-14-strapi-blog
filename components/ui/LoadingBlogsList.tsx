"use client";

import { FC, useState } from "react";
import { Loader } from "lucide-react";

import { loadMoreBlogs } from "@/app/actions/loadMoreBlogs";
import BlogCard from "@/components/ui/BlogCard";
import { Button } from "@/components/ui/Button";
import { PaginationType, StrapiFilters } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import { Blog } from "@/types/cms";

export interface LoadingBlogsListProps {
  filters: StrapiFilters;
  initialBlogs: Blog[];
  initialHasMore?: boolean;
  pagination?: PaginationType;
}

const LoadingBlogsList: FC<LoadingBlogsListProps> = ({
  filters,
  initialBlogs,
  initialHasMore = true,
  pagination,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(pagination.page);

  const loadMore = async () => {
    setIsLoading(true);
    const { blogs, pagination: blogsPagination } = await loadMoreBlogs({
      filters,
      pagination: { page: page + 1, pageSize: pagination.pageSize },
    });
    setBlogs((prevBlogs) => [...prevBlogs, ...blogs]);
    setPage(blogsPagination.page);
    setHasMore(blogsPagination.pageCount > blogsPagination.page);
    setIsLoading(false);
  };

  return (
    <div className={cn("flex flex-col", !hasMore && !isLoading && "pb-10")}>
      <div className="grid grid-cols-1 gap-4 py-5 pb-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.slug} data={blog} />
        ))}
      </div>
      <Loader
        aria-label="Loading more blogs"
        className={cn("mx-auto text-primary", !isLoading && "hidden")}
        size={40}
      />
      <Button
        className={cn("mx-auto", !hasMore && "hidden", isLoading && "hidden")}
        onClick={loadMore}
      >
        Load More
      </Button>
    </div>
  );
};

export default LoadingBlogsList;
