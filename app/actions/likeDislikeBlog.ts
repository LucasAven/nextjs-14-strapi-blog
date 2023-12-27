"use server";
import { cookies } from "next/headers";

import { updateBlogLikes } from "@/lib/strapi";

/*
    cookie: "blog-BLOG_ID": "like" | "dislike"
*/

export async function likeDislikeBlog({
  blogId,
  currentDislikeCount,
  currentLikeCount,
  tagsToInvalidate,
  type,
}: {
  blogId: string;
  currentDislikeCount: number;
  currentLikeCount: number;
  tagsToInvalidate?: string[];
  type: "like" | "dislike";
}) {
  const isLikeInteraction = type === "like";
  const isDislikeInteraction = type === "dislike";

  const cookieStore = cookies();
  const hasInteracted = cookieStore.get(`blog-${blogId}`);
  const alreadyLiked = hasInteracted && hasInteracted.value === "like";
  const alreadyDisliked = hasInteracted && hasInteracted.value === "dislike";

  const updateCounts = async ({
    updateDislike,
    updateLike,
  }: {
    updateDislike: boolean;
    updateLike: boolean;
  }) => {
    if (updateLike) {
      await updateBlogLikes({
        action: alreadyLiked ? "decrement" : "increment",
        blogId,
        currentCount: currentLikeCount,
        tagsToInvalidate,
        type: "like",
      });
    }

    if (updateDislike) {
      await updateBlogLikes({
        action: alreadyDisliked ? "decrement" : "increment",
        blogId,
        currentCount: currentDislikeCount,
        tagsToInvalidate,
        type: "dislike",
      });
    }
  };

  if (hasInteracted) {
    await updateCounts({
      updateDislike: isDislikeInteraction || alreadyDisliked,
      updateLike: isLikeInteraction || alreadyLiked,
    });

    if (
      (alreadyLiked && isLikeInteraction) ||
      (alreadyDisliked && isDislikeInteraction)
    ) {
      cookieStore.delete(`blog-${blogId}`);
    } else {
      cookieStore.set(`blog-${blogId}`, type);
    }
  } else {
    cookieStore.set(`blog-${blogId}`, type);
    await updateCounts({
      updateDislike: isDislikeInteraction,
      updateLike: isLikeInteraction,
    });
  }

  return {
    disliked: isDislikeInteraction && !alreadyDisliked,
    liked: isLikeInteraction && !alreadyLiked,
  };
}
