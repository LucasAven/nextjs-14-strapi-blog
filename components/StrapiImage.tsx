import { FC } from "react";
import Image from "next/image";

import { getFileNameWithoutExt } from "@/lib/utils";
import { ImageContent } from "@/types/cms";

export interface StrapiImageProps {
  className?: string;
  image: ImageContent;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export const StrapiImage: FC<StrapiImageProps> = ({
  className,
  image: { alternativeText, ext, height, name, url, width },
  priority = false,
  sizes,
  style = {},
}) => (
  <Image
    alt={alternativeText || getFileNameWithoutExt(name, ext)}
    className={className}
    height={height}
    priority={priority}
    sizes={sizes}
    // src={url}
    // Use when testing Strapi locally
    src={
      process.env.NODE_ENV === "development"
        ? `http://127.0.0.1:1337${url}`
        : url
    }
    style={style}
    width={width}
  />
);
