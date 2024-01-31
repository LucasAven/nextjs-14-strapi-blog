import { FC } from "react";

import BlogCard from "./BlogCard";

import { cn } from "@/lib/utils";
import { Blog, RelatedBlogsContent } from "@/types/cms";

export interface BlogsGridProps {
  blogs: Blog[] | RelatedBlogsContent[];
  className?: string;
  imagePriority?: boolean;
}

const BlogsGrid: FC<BlogsGridProps> = ({
  blogs,
  className = "",
  imagePriority = false,
}) => {
  return (
    <div
      className={cn(
        "grid max-w-[1400px] grid-cols-1 gap-4 py-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3",
        className,
      )}
    >
      {blogs.length > 0 &&
        blogs.map((blog: Blog | RelatedBlogsContent) => (
          <BlogCard key={blog.slug} data={blog} imagePriority={imagePriority} />
        ))}
    </div>
  );
};

export default BlogsGrid;
