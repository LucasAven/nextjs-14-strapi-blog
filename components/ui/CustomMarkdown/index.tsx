import { AnchorHTMLAttributes, FC } from "react";
import Markdown, { MarkdownToJSX } from "markdown-to-jsx";
import Link from "next/link";

import CalloutBlock from "./CalloutBlock";

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
    <Markdown
      className={className}
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
          ...overrides,
        },
        ...rest,
      }}
    >
      {children}
    </Markdown>
  );
};

export default CustomMarkdown;
