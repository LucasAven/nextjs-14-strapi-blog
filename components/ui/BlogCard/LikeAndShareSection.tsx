"use client";

import { FC, useEffect, useState } from "react";
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
import { VisuallyHiddenText } from "@/components/VisuallyHiddenText";
import {
  FACEBOOK_SHARE_URL,
  LINKEDIN_SHARE_URL,
  TWITTER_SHARE_URL,
} from "@/constants/shareUrls";
import {
  copyContentInClipboard,
  formatLikes,
  isOnClientSide,
} from "@/lib/utils";

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

  const [currentUrl, setCurrentUrl] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isOnClientSide) {
      setCurrentUrl(window.location.href);
    }
  }, []);

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
                <li className="h-8 w-8 rounded-full border-2 border-primary duration-300 ease-in focus-within:bg-primary hover:bg-primary motion-safe:transition-all sm:h-10 sm:w-10 lg:mb-2">
                  <ExternalLink
                    aria-label="Share on Facebook"
                    className=" flex h-full w-full items-center justify-center"
                    href={`${FACEBOOK_SHARE_URL}${currentUrl}`}
                  >
                    <Facebook
                      fill="currentColor"
                      focusable="false"
                      size={16}
                      aria-hidden
                    />
                  </ExternalLink>
                </li>
                <li className="h-8 w-8 rounded-full border-2 border-primary duration-300 ease-in focus-within:bg-primary hover:bg-primary motion-safe:transition-all sm:h-10 sm:w-10 lg:mb-2">
                  <ExternalLink
                    aria-label="Share on Twitter"
                    className=" flex h-full w-full items-center justify-center"
                    href={`${TWITTER_SHARE_URL}${currentUrl}&amp;text=Check%20this%20cool%20blog!`}
                  >
                    <Twitter
                      fill="currentColor"
                      focusable="false"
                      size={16}
                      aria-hidden
                    />
                  </ExternalLink>
                </li>
                <li className=" h-8 w-8 rounded-full border-2 border-primary duration-300 ease-in focus-within:bg-primary hover:bg-primary motion-safe:transition-all sm:h-10 sm:w-10 lg:mb-2">
                  <ExternalLink
                    aria-label="Share on Linkedin"
                    className=" flex h-full w-full items-center justify-center"
                    href={`${LINKEDIN_SHARE_URL}${currentUrl}`}
                    target="_blank"
                  >
                    <Linkedin
                      fill="currentColor"
                      focusable="false"
                      size={16}
                      aria-hidden
                    />
                  </ExternalLink>
                </li>
                <li>
                  <div className="h-4 w-[2px] bg-primary md:h-6 lg:w-full "></div>
                </li>
                <li
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary duration-300 ease-in focus-within:bg-primary hover:bg-primary motion-safe:transition-all sm:h-10 sm:w-10 lg:mb-2"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    aria-hidden={!isHovered}
                    aria-live="polite"
                    className="pre-sm:-top-7 absolute top-8 motion-safe:transition-all md:top-0 md:opacity-0 md:group-focus-within:-top-7 md:group-focus-within:opacity-100 md:group-hover:-top-7 md:group-hover:opacity-100"
                    id="likeCount"
                  >
                    <span className="whitespace-nowrap rounded-full bg-primary px-1.5 py-0.5 text-base text-white">
                      {formatLikes(likes)}
                      <VisuallyHiddenText description="likes" />
                    </span>
                  </div>
                  <button
                    aria-describedby="likeCount"
                    aria-label="Like this blog post"
                    className="inline-flex h-full w-full items-center text-sm leading-none"
                    onClick={() => interactWithBlog("like")}
                  >
                    <ThumbsUp
                      className="m-auto"
                      fill="currentColor"
                      focusable="false"
                      size={16}
                      aria-hidden
                    />
                  </button>
                </li>
                <li
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary duration-300 ease-in focus-within:bg-primary hover:bg-primary motion-safe:transition-all sm:h-10 sm:w-10 lg:mb-2"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    aria-hidden={!isHovered}
                    aria-live="polite"
                    className="pre-sm:-top-7 absolute top-8 motion-safe:transition-all md:top-0 md:opacity-0 md:group-focus-within:-top-7 md:group-focus-within:opacity-100 md:group-hover:-top-7 md:group-hover:opacity-100"
                    id="dislikeCount"
                  >
                    <span className="whitespace-nowrap rounded-full bg-primary px-1.5 py-0.5 text-base text-white">
                      {formatLikes(dislikes)}
                      <VisuallyHiddenText description="dislikes" />
                    </span>
                  </div>
                  <button
                    aria-describedby="dislikeCount"
                    aria-label="Dislike this blog post"
                    className="inline-flex h-full w-full items-center text-sm leading-none"
                    onClick={() => interactWithBlog("dislike")}
                  >
                    <ThumbsDown
                      className="m-auto"
                      fill="currentColor"
                      focusable="false"
                      size={16}
                      aria-hidden
                    />
                  </button>
                </li>
                <li className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary duration-300 ease-in focus-within:bg-primary hover:bg-primary motion-safe:transition-all sm:h-10 sm:w-10 lg:mb-2">
                  <button
                    aria-label="Copy Url to clipboard"
                    className="h-full w-full"
                    onClick={async () => {
                      try {
                        await copyContentInClipboard(currentUrl);
                        toast("Url copied to clipboard");
                      } catch (error) {
                        toast("Failed to copy URL");
                      }
                    }}
                  >
                    <Link
                      className="m-auto"
                      focusable="false"
                      size={16}
                      aria-hidden
                    />
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
