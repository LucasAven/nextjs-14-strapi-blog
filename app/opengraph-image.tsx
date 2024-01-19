import { ImageResponse } from "next/og";

import { getSingleType, StrapiSingleTypes } from "@/lib/strapi";
import { getStrapiImageUrl } from "@/lib/utils";

export const runtime = "edge";

export const alt = "Lucas' Blog Image";

export const size = {
  height: 630,
  width: 1200,
};
export const contentType = "image/png";

export default async function Image() {
  const { nav_logo_image } = await getSingleType({
    contentType: StrapiSingleTypes.PAGE_SHARED_DATA,
    fetchOptions: {
      cache: "no-store",
    },
  });

  const getFont = async () => {
    const res = await fetch(
      new URL("../public/Geist-SemiBold.otf", import.meta.url),
    );
    return await res.arrayBuffer();
  };

  return new ImageResponse(
    (
      <div tw="flex items-center justify-center w-full h-full bg-[#0c0a09]">
        <div
          style={{
            marginLeft: "-160px",
          }}
          tw="flex w-1/2 h-1/2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={alt}
            height={nav_logo_image.height}
            src={getStrapiImageUrl(nav_logo_image.url)}
            style={{ objectFit: "contain" }}
            tw="w-full h-full"
            width={nav_logo_image.width}
          />
        </div>
        <div
          style={{
            marginLeft: "-100px",
            width: "60%",
          }}
          tw="flex flex-col text-white justify-center items-center"
        >
          <h1
            style={{
              marginLeft: "25%",
            }}
            tw="w-full font-bold tracking-tighter text-7xl"
          >
            Lucas&apos; Tech Blog
          </h1>
          <div tw="flex flex-col mx-auto text-gray-400 text-2xl">
            From Lines of Code to Digital Stories: join my journey into
            <span
              style={{ gap: 5, marginLeft: "25%" }}
              tw="flex text-[#ff7029]"
            >
              Tech <span tw="text-gray-400">and </span>
              <span tw="text-[#ff7029]">
                web development<span tw="text-gray-400">!</span>
              </span>
            </span>
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
