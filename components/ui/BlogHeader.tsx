"use client";
import { FC, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

import { StrapiImage } from "../StrapiImage";

import useScrollListener from "@/hooks/useScrollListener";
import { cn, formatStrapiDate } from "@/lib/utils";
import { Blog } from "@/types/cms";

export interface BlogHeaderProps {
  blog: Blog;
  className?: string;
}

const BlogHeader: FC<BlogHeaderProps> = ({ blog, className = "" }) => {
  const { author, createdAt, main_image, readingTime, title } = blog;
  const [scrollY, setScrollY] = useState(0);

  useScrollListener({ handleScroll: () => setScrollY(window.scrollY) });

  return (
    <div
      className={cn("container sticky z-0 mx-auto", className)}
      style={{
        transform: `translateY(${scrollY * 0.5}px)`,
      }}
    >
      <div className="mx-auto md:max-w-[765px] md:text-center lg:max-w-[1188px]">
        <h1 className="mx-auto mb-0 max-w-[1005px] text-[38px] font-bold leading-tight md:text-[45px] xl:line-clamp-3 xl:text-[72px]">
          {title}
        </h1>
        <ul className="mt-2 flex max-w-[273px] flex-wrap items-center gap-x-9 gap-y-2 sm:max-w-[100%] md:justify-center md:gap-10">
          <li className="flex items-center gap-2.5 text-xs leading-none md:text-sm">
            <Link href={`/blogs/author/${author.slug}`}>
              <div className="group flex items-center gap-2 capitalize">
                <span className="block text-xs text-gray-100 md:text-sm">
                  By
                </span>
                <span className="text-xs text-primary group-hover:underline md:text-sm">
                  {author.name}
                </span>
              </div>
            </Link>
          </li>
          <li className="flex items-center gap-2.5 text-xs leading-none md:text-sm">
            <Calendar size={16} />
            <time className="text-primary" dateTime={createdAt}>
              {formatStrapiDate(createdAt)}
            </time>
          </li>
          <li className="flex items-center gap-2.5 text-xs leading-none md:text-sm">
            <Clock size={16} />
            <span className="text-primary">{readingTime}</span>
          </li>
        </ul>
      </div>
      <div className="mx-auto mt-[32px] sm:mt-[52px] md:mt-[70px] md:px-[50px]">
        <div className="border-heading m-0 mx-auto min-h-[200px] w-full overflow-hidden rounded-[20px] border-2 border-primary/70 md:min-h-[350px] md:rounded-[40px] lg:min-h-[500px]">
          <StrapiImage
            className="h-full w-full object-cover"
            image={main_image}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
