import Link from "next/link";

import { StrapiImage } from "@/components/StrapiImage";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { cn, formatStrapiDate } from "@/lib/utils";
import { Blog } from "@/types/cms";

const FeaturedBlogCard = async ({ data }: { data: Blog }) => {
  return (
    <Link href={`${INTERNAL_ROUTES.BLOGS}/${data.slug}`}>
      <article className="mx-auto flex max-w-6xl transform overflow-hidden rounded-2xl border border-[#30363d] bg-secondary text-foreground transition-blog-card duration-blog-card ease-blog-card hover:scale-[.99] hover:opacity-80">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col justify-between p-6 md:p-12 md:max-lg:pb-6">
            <div className="mb-5 flex flex-col items-start gap-3 sm:mb-12 lg:mb-24">
              <h2 className="text-2xl font-medium sm:text-3xl">{data.title}</h2>
              <p className="mb-2.5 line-clamp-4 text-sm leading-relaxed tracking-wider text-gray-400 sm:line-clamp-6 sm:text-base sm:font-medium">
                {data.preview_text}
              </p>
            </div>
            <div className="mb-2.5 flex items-center justify-between">
              <p className="font-medium leading-relaxed tracking-wider text-gray-400">
                {formatStrapiDate(data.publishedAt)}
              </p>
              <span
                className={cn(
                  "font-medium leading-none tracking-widest text-gray-400",
                  !data.likes_count && "hidden",
                )}
              >
                {data.likes_count} Likes
              </span>
            </div>
          </div>
          <div className="min-h-[200px] w-full">
            <StrapiImage
              className="h-full w-full rounded-bl-2xl rounded-tl-2xl object-cover"
              image={data.main_image}
              priority
            />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedBlogCard;
