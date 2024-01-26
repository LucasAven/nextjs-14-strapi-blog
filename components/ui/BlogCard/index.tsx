import { FC } from "react";
import Link from "next/link";

import { StrapiImage } from "@/components/StrapiImage";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { cn, formatStrapiDate } from "@/lib/utils";
import { RelatedBlogsContent } from "@/types/cms";

export interface BlogCardProps {
  data: RelatedBlogsContent;
}

const BlogCard: FC<BlogCardProps> = ({ data }) => {
  const { main_image, preview_text, publishedAt, tags, title } = data;
  return (
    <Link href={`${INTERNAL_ROUTES.BLOGS}/${data.slug}`}>
      <article className="mx-auto flex h-full transform overflow-hidden rounded-2xl border border-[#30363d] bg-secondary text-foreground transition-blog-card duration-blog-card ease-blog-card hover:scale-[.99] hover:opacity-80">
        <div className="flex max-w-full flex-col">
          <div className="min-h-[270px] w-full">
            <StrapiImage
              className="h-full w-full rounded-tl-2xl rounded-tr-2xl object-cover"
              image={main_image}
              sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            />
          </div>
          <div className="flex h-full flex-col px-5 py-8">
            <div className="mb-auto flex flex-col items-start gap-3">
              <div className="flex items-center gap-1.5">
                <p className="font-medium leading-relaxed tracking-wider text-gray-400">
                  {formatStrapiDate(publishedAt)}
                </p>
              </div>
              <h2 className="line-clamp-4 text-left text-2xl font-medium leading-7">
                {title}
              </h2>
              <p className="mb-2.5 line-clamp-3 text-left text-sm !leading-tight tracking-wider text-gray-400 sm:text-base sm:font-medium">
                {preview_text}
              </p>
            </div>
            <div
              className={cn(
                "ml-auto mt-auto flex max-h-14 max-w-full flex-wrap items-center gap-x-2 overflow-hidden pt-4",
                !tags.length && "hidden",
              )}
            >
              {tags.map((tag) => (
                <span
                  key={tag.name}
                  className="text-sm font-medium text-gray-300/90"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
