import { ImageResponse } from "next/og";

import { API_TOKEN, API_URL } from "@/app/config";
import {
  // getCollectionType,
  getSingleType,
  // StrapiCollectionTypes,
  StrapiSingleTypes,
} from "@/lib/strapi";
import { formatLikes, getCloudinaryImageUrl } from "@/lib/utils";

export const runtime = "edge";

export const alt = "Lucas' Blog Post Image";

export const size = {
  height: 630,
  width: 1200,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { nav_logo_image } = await getSingleType({
    contentType: StrapiSingleTypes.PAGE_SHARED_DATA,
    fetchOptions: {
      cache: "no-store",
    },
  });

  let blogs;
  try {
    const data = await fetch(
      `${API_URL}/blogs?populate[0]=main_image&filters[slug][$eq]=${slug}&pagination[page]=1&pagination[pageSize]=1`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
    );
    const a = await data.json();
    blogs = {
      ...a.data[0].attributes,
      main_image: a.data[0].attributes.main_image.data.attributes,
    };
  } catch (error) {
    console.error("\n\n\n\n\nerror", error);
  }
  console.log("\n\n\n\n\nblogs", blogs);
  // const { data: blogs } = await getCollectionType({
  //   contentType: StrapiCollectionTypes.BLOGS,
  //   fetchOptions: {
  //     cache: "no-store",
  //   },
  //   filters: { slug: { $eq: slug } },
  // });

  const post = blogs;
  // const post = blogs[0];

  const getFont = async () => {
    const res = await fetch(
      new URL("../../../public/Geist-SemiBold.otf", import.meta.url),
    );
    return await res.arrayBuffer();
  };

  return new ImageResponse(
    (
      <div tw="flex flex-col items-center justify-center w-full h-full relative border-2 border-[#ff7029]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={alt}
          height={size.height}
          src={getCloudinaryImageUrl({
            height: size.height,
            url: post.main_image.url,
            width: size.width,
          })}
          style={{ objectFit: "cover" }}
          tw="w-full h-full"
          width={size.width}
        />
        <div tw="absolute top-0 left-0 w-full h-full bg-[#0c0a09] opacity-50" />
        <h1
          style={{
            left: "50%",
            textShadow: "0 0 10px #000",
            top: "40%",
            transform: "translate(-50%, -50%)",
          }}
          tw="absolute text-white text-[65px] tracking-wider leading-snug font-bold max-w-5xl text-center"
        >
          {post.title}
        </h1>
        <div tw="absolute flex flex-col items-center justify-center text-white bottom-0 right-0 bg-[#0c0a09] border-2 border-t-[#ff7029] border-l-[#ff7029] rounded-tl-[30px] px-4 min-w-[165px] h-[165px]">
          <div tw="flex items-center justify-center w-[80px] h-[80px] mx-auto mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Lucas' Tech Blog Logo"
              height={80}
              src={getCloudinaryImageUrl({
                height: 80,
                url: nav_logo_image.url,
                width: 80,
              })}
              style={{ objectFit: "cover" }}
              tw="w-full h-full"
              width={80}
            />
          </div>
          <div tw="flex items-center justify-center">
            <div tw="flex items-center">
              <svg
                fill="currentColor"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 10v12"></path>
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
              </svg>
              <div tw="flex text-white mt-1 ml-2 text-2xl tracking-wider leading-snug font-bold">
                {formatLikes(post.likes_count || 0)}
              </div>
            </div>
            <div tw="flex items-center ml-2">
              <svg
                fill="currentColor"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17 14V2"></path>
                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path>
              </svg>
              <div tw="flex text-white mt-1 ml-2 text-2xl tracking-wider leading-snug font-bold">
                {formatLikes(post.dislikes_count || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          data: await getFont(),
          name: "Geist",
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
