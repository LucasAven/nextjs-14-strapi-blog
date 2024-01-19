"use client";
import { FC, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

import { StrapiImage } from "../StrapiImage";
import { VisuallyHiddenText } from "../VisuallyHiddenText";

import { INTERNAL_ROUTES } from "@/constants/routes";
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
        <h1 className="mx-auto mb-0 max-w-[1005px] text-4xl font-bold leading-tight md:text-[45px] xl:line-clamp-3 xl:text-[72px]">
          {title}
        </h1>
        <ul className="mt-2 flex max-w-[273px] flex-wrap items-center gap-x-9 gap-y-2 sm:max-w-[100%] md:justify-center md:gap-10">
          <li className="flex items-center gap-2.5 text-xs leading-none md:text-sm">
            <Link href={`${INTERNAL_ROUTES.AUTHOR}/${author.slug}`}>
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
            <Calendar size={16} aria-hidden />
            <time className="text-primary" dateTime={createdAt}>
              <VisuallyHiddenText description="Published on: " />
              {formatStrapiDate(createdAt)}
            </time>
          </li>
          <li className="flex items-center gap-2.5 text-xs leading-none md:text-sm">
            <Clock size={16} aria-hidden />
            <span className="text-primary">{readingTime}</span>
          </li>
        </ul>
        <ul className="mx-auto mt-7 flex max-w-lg flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {blog.tags.map((tag) => (
            <li
              key={tag.name}
              className="text-xs font-semibold leading-none text-primary hover:underline md:text-sm"
            >
              <Link href={`${INTERNAL_ROUTES.TAGS}/${tag.name}`}>
                #{tag.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-8 sm:mt-12 md:mt-16 md:px-[50px]">
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
