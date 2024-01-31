import { AnchorHTMLAttributes, FC } from "react";
import Markdown, { MarkdownToJSX } from "markdown-to-jsx";
import Image from "next/image";
import Link from "next/link";

import CalloutBlock from "./CalloutBlock";

import { getCloudinaryImageUrl } from "@/lib/utils";

export interface CustomMarkdownProps {
  children: string;
  className?: string;
  options?: MarkdownToJSX.Options;
}

const getCorrectAnchor = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const commonClasses = "text-primary underline";

  if (props.href.startsWith("/") && props.target !== "_blank") {
    return <Link href={props.href} {...props} className={commonClasses} />;
  }
  return <a href={props.href} {...props} className={commonClasses} />;
};

const CustomMarkdown: FC<CustomMarkdownProps> = ({
  children,
  className = "",
  options = {},
}) => {
  const { overrides, ...rest } = options;

  return (
    <div className={className}>
      <Markdown
        className="w-full"
        options={{
          overrides: {
            a: getCorrectAnchor,
            blockquote: {
              component: ({ children }) => (
                <blockquote className="text-xl italic">{children}</blockquote>
              ),
            },
            CalloutBlock: {
              component: CalloutBlock,
            },
            img: {
              component: ({ alt, src, ...rest }) => (
                <Image
                  alt={alt || ""}
                  height={558}
                  sizes="(max-width: 1024px) calc(100vw - 3rem), 87vw"
                  src={getCloudinaryImageUrl({
                    height: 558,
                    url: src,
                    width: 976,
                  })}
                  style={{
                    height: "auto",
                    width: "100%",
                  }}
                  width={976}
                  {...rest}
                />
              ),
            },
            ...overrides,
          },
          ...rest,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
};

export default CustomMarkdown;
