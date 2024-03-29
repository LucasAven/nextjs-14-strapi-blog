import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { NEXT_PUBLIC_DOMAIN } from "@/app/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Actual parser of the strapi object used by `formatStrapiData`
 * internally. **SHOULD NOT BE USED DIRECTLY**
 * @param strapiData - Data returned from strapi
 * @returns - Object with the data and pagination
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseStrapiObject = (strapiData: any) => {
  const { data } = strapiData;

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      const parcialData = data.map((item) => {
        const { attributes, id } = item;
        Object.keys(attributes).forEach((key) => {
          if (typeof attributes[key] === "object" && attributes[key] !== null) {
            attributes[key] = parseStrapiObject(attributes[key]);
          }
        });
        return {
          id,
          ...attributes,
        };
      });
      return parcialData;
    } else {
      const { attributes, id } = data;
      Object.keys(attributes).forEach((key) => {
        if (typeof attributes[key] === "object" && attributes[key] !== null) {
          attributes[key] = parseStrapiObject(attributes[key]);
        }
      });
      return {
        id,
        ...attributes,
      };
    }
    // This is the case when data is an object without attributes key (e.g. a component)
  } else if (Object.keys(strapiData).length !== 0) {
    return strapiData;
  }
};

/**
 * Format the object returned from strapi to a more readable one by
 * deleting the attributes and adding the id to each nested object
 * @param strapiObject - Object returned from strapi
 * @param isPaginated - Boolean to check if the object is paginated
 * @returns - Object with the data and pagination
 */
export const formatStrapiData = ({
  isPaginated,
  strapiObject,
}: {
  isPaginated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strapiObject: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => {
  const { meta } = strapiObject;

  if (isPaginated) {
    return {
      data: parseStrapiObject(strapiObject),
      pagination: meta?.pagination || {},
    };
  }

  return {
    data: parseStrapiObject(strapiObject),
    pagination: null,
  };
};

export const getFileNameWithoutExt = (name: string, ext: string): string =>
  name ? name.replace(ext, "") : "";

/**
 *
 * @param date - Date string from strapi
 * @param options - Custom options for formatting the date
 * @returns - String of formatted date
 * @example `with default options`
 * const date = '2023-10-26T01:26:51.768Z';
 * const formattedDate = formatStrapiDate(date); // 'October 25, 2023'
 */
export const formatStrapiDate = (
  date: string,
  options?: Intl.DateTimeFormatOptions,
) => {
  if (!date) return "";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options || defaultOptions);
};

/**
 * @param likes - Number of likes
 * @returns - String of formatted likes
 *
 * @example
 * formatLikes(); // '0'
 * formatLikes(500); // '500'
 * formatLikes(1000); // '1k'
 * formatLikes(1200); // '1.2k'
 * formatLikes(1000000); // '1m'
 * */
export const formatLikes = (likes: number) => {
  if (likes === null || likes === undefined) return "0";
  if (likes < 1000) {
    return likes.toString();
  } else if (likes < 1000000) {
    const kValue = likes / 1000;
    if (Number.isInteger(kValue)) {
      return `${Math.floor(kValue)}k`;
    } else {
      return `${kValue.toFixed(1).replace(".0", "")}k`;
    }
  } else {
    const mValue = likes / 1000000;
    if (Number.isInteger(mValue)) {
      return `${Math.floor(mValue)}m`;
    } else {
      return `${mValue.toFixed(1).replace(".0", "")}m`;
    }
  }
};

export const copyContentInClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

/**
 * @param url - Url to be transformed
 * @param width - Width of the image
 * @param height - Height of the image
 * @returns - Url with the proper transformation params
 * @example
 * const url = 'https://res.cloudinary.com/example/image/upload/v1626197449/example.png';
 * getCloudinaryImageUrl(url, 500, 500); // 'https://res.cloudinary.com/example/f_auto/c_limit/w_500/h_500/q_auto/example.png'
 * */
// export const getCloudinaryImageUrl = ({
//   height,
//   url,
//   width,
// }: {
//   height: number;
//   url: string;
//   width: number;
// }) =>
//   url.replace(
//     /\/image\/upload\/[^\/]+\//,
//     `/f_auto/c_limit/w_${width}/h_${height}/q_auto/`,
//   );
// TODO: check if it's worth get back the original version
export const getCloudinaryImageUrl = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  height,
  url,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  width,
}: {
  height: number;
  url: string;
  width: number;
}) => url;

/**
 * Value used to determine if the code is running on the client side.
 *
 * Be careful when using this value, as it can **easily**
 * lead to NextJS hydration mismatches.
 */
export const isOnClientSide = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

/**
 * Type that returns the same type as the input, but without the `s` at the end.
 * @example
 * type Test = MakeSingularWord<'tests'>; // 'test'
 **/
export type MakeSingularWord<T extends string> = T extends `${infer U}s`
  ? U
  : T;

export const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return NEXT_PUBLIC_DOMAIN;
};
