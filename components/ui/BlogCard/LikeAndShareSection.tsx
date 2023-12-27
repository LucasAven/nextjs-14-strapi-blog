"use client";

import { FC } from "react";
import {
  Facebook,
  Link,
  Linkedin,
  ThumbsDown,
  ThumbsUp,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";

import { likeDislikeBlog } from "@/app/actions/likeDislikeBlog";
import ExternalLink from "@/components/ExternalLink";
import {
  FACEBOOK_SHARE_URL,
  LINKEDIN_SHARE_URL,
  TWITTER_SHARE_URL,
} from "@/constants/shareUrls";
import { copyContentInClipboard } from "@/lib/utils";

export interface LikeAndShareSectionProps {
  blogId: string;
  className?: string;
  dislikes: number;
  likes: number;
  tagsToInvalidate: string[];
}

const LikeAndShareSection: FC<LikeAndShareSectionProps> = ({
  blogId,
  className = "",
  dislikes,
  likes,
  tagsToInvalidate,
}) => {
  const interactWithBlog = (type: "like" | "dislike") =>
    likeDislikeBlog({
      blogId,
      currentDislikeCount: dislikes,
      currentLikeCount: likes,
      tagsToInvalidate,
      type,
    });

  return (
    <div className={className}>
      <div className="overflow-hidden">
        <div className="sticky top-[150px] my-10 w-full lg:my-0">
          <div className="flex flex-wrap items-center justify-between gap-[25px] md:gap-[10px]">
            <div className="mx-auto pr-4 lg:hidden">
              <h3 className="text-heading mb-0 mt-1 font-semibold leading-none">
                Share this!
              </h3>
            </div>
            <div className="mx-auto">
              <ul className="flex items-center justify-end gap-3 lg:flex-col lg:justify-start lg:gap-[0]">
                <li className="h-8 w-8 rounded-full border-2 border-primary transition-all duration-300 ease-in hover:bg-primary sm:h-10 sm:w-10 lg:mb-2">
                  <ExternalLink
                    aria-label="Facebbok"
                    className=" flex h-full w-full items-center justify-center"
                    href={`${FACEBOOK_SHARE_URL}${window.location.href}`}
                  >
                    <Facebook fill="currentColor" size={16} />
                  </ExternalLink>
                </li>
                <li className="h-8 w-8 rounded-full border-2 border-primary transition-all duration-300 ease-in hover:bg-primary sm:h-10 sm:w-10 lg:mb-2">
                  <ExternalLink
                    aria-label="Twitter"
                    className=" flex h-full w-full items-center justify-center"
                    href={`${TWITTER_SHARE_URL}${window.location.href}&amp;text=Check%20this%20cool%20blog!`}
                  >
                    <Twitter fill="currentColor" size={16} />
                  </ExternalLink>
                </li>
                <li
                  aria-label="Linkedin"
                  className=" h-8 w-8 rounded-full border-2 border-primary transition-all duration-300 ease-in hover:bg-primary sm:h-10 sm:w-10 lg:mb-2"
                >
                  <ExternalLink
                    className=" flex h-full w-full items-center justify-center"
                    href={`${LINKEDIN_SHARE_URL}${window.location.href}`}
                    target="_blank"
                  >
                    <Linkedin fill="currentColor" size={16} />
                  </ExternalLink>
                </li>
                <li>
                  <div className="h-4 w-[2px] bg-primary md:h-6 lg:w-full "></div>
                </li>
                <li className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary transition-all duration-300 ease-in hover:bg-primary sm:h-10 sm:w-10 lg:mb-2">
                  <button
                    aria-label="Like this blog post"
                    className="inline-flex h-full w-full items-center text-sm leading-none"
                    onClick={() => interactWithBlog("like")}
                  >
                    <ThumbsUp
                      className="m-auto"
                      fill="currentColor"
                      size={16}
                    />
                  </button>
                </li>
                <li className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary transition-all duration-300 ease-in hover:bg-primary sm:h-10 sm:w-10 lg:mb-2">
                  <button
                    aria-label="Dislike this blog post"
                    className="inline-flex h-full w-full items-center text-sm leading-none"
                    onClick={() => interactWithBlog("dislike")}
                  >
                    <ThumbsDown
                      className="m-auto"
                      fill="currentColor"
                      size={16}
                    />
                  </button>
                </li>
                <li className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary transition-all duration-300 ease-in hover:bg-primary sm:h-10 sm:w-10 lg:mb-2">
                  <button
                    aria-label="Copy Url"
                    className="hf-full w-full"
                    onClick={async () => {
                      await copyContentInClipboard(window.location.href);
                      toast("Copied to clipboard");
                    }}
                  >
                    <Link className="m-auto" size={16} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeAndShareSection;
