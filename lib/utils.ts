import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseStrapiObject = (strapiObject: any) => {
  const { data, meta } = strapiObject;
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
      const pagination = meta?.pagination || {};
      return {
        data: parcialData,
        pagination,
      };
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

export const getFileNameWithoutExt = (name: string, ext: string): string =>
  name ? name.replace(ext, "") : "";
