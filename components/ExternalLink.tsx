import { AnchorHTMLAttributes, DetailedHTMLProps, FC, forwardRef } from "react";

const ExternalLink: FC<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
> = forwardRef(({ children, rel, target, ...props }, ref) => (
  <a
    rel={rel || "nofollow noreferrer noopener"}
    target={target || "_blank"}
    {...props}
    ref={ref}
  >
    {children}
  </a>
));

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
