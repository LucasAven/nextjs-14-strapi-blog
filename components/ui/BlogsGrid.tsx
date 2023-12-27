import { FC } from "react";

import BlogCard from "./BlogCard";

import { cn } from "@/lib/utils";
import { Blog, RelatedBlogsContent } from "@/types/cms";

export interface BlogsGridProps {
  blogs: Blog[] | RelatedBlogsContent[];
  className?: string;
}

const BlogsGrid: FC<BlogsGridProps> = ({ blogs, className = "" }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3",
        className,
      )}
    >
      {blogs.length > 0 &&
        blogs.map((blog: Blog | RelatedBlogsContent) => (
          <BlogCard key={blog.slug} data={blog} />
        ))}
    </div>
  );
};

export default BlogsGrid;
