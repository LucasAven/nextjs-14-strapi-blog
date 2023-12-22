"use client";

import { FC, useMemo } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { likeDislikeBlog } from "@/app/actions/likeDislikeBlog";
import { formatLikes } from "@/lib/utils";

export interface LikesSectionProps {
  blogId: string;
  dislikes: number;
  likes: number;
  tagsToInvalidate: string[];
}

const LikesSection: FC<LikesSectionProps> = ({
  blogId,
  dislikes,
  likes,
  tagsToInvalidate,
}) => {
  const commonFunctionParams = useMemo(
    () => ({
      blogId,
      currentDislikeCount: dislikes,
      currentLikeCount: likes,
      tagsToInvalidate,
    }),
    [blogId, dislikes, likes, tagsToInvalidate],
  );

  return (
    <div className="flex flex-wrap items-center">
      <button
        aria-label="Like this blog post"
        className="ml-auto mr-3 inline-flex items-center border-r border-gray-100 py-1 pr-3 text-sm leading-none text-gray-400 md:ml-0 lg:ml-auto"
        onClick={() =>
          likeDislikeBlog({
            ...commonFunctionParams,
            type: "like",
          })
        }
      >
        <ThumbsUp className="mr-1 h-4 w-4" />
        {formatLikes(likes)}
      </button>
      <button
        aria-label="Dislike this blog post"
        className="inline-flex items-center text-sm leading-none text-gray-400"
        onClick={() =>
          likeDislikeBlog({
            ...commonFunctionParams,
            type: "dislike",
          })
        }
      >
        <ThumbsDown className="mr-1 h-4 w-4" />
        {formatLikes(dislikes)}
      </button>
    </div>
  );
};

export default LikesSection;
