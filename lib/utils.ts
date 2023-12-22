import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
