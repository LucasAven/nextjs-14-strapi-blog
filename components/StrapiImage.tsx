import { FC } from "react";
import Image from "next/image";

import { getCloudinaryImageUrl, getFileNameWithoutExt } from "@/lib/utils";
import { ImageContent } from "@/types/cms";

export interface StrapiImageProps {
  className?: string;
  height?: number;
  image: ImageContent;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  width?: number;
}

export const StrapiImage: FC<StrapiImageProps> = ({
  className,
  height,
  image: {
    alternativeText,
    ext,
    height: intrinsicHeight,
    name,
    url,
    width: intrinsicWidth,
  },
  priority = false,
  sizes,
  style = {},
  width,
}) => (
  <Image
    alt={alternativeText || getFileNameWithoutExt(name, ext)}
    className={className}
    height={height || intrinsicHeight}
    priority={priority}
    sizes={sizes}
    src={getCloudinaryImageUrl({
      height: height || intrinsicHeight,
      url,
      width: width || intrinsicWidth,
    })}
    style={style}
    width={width || intrinsicWidth}
  />
);
