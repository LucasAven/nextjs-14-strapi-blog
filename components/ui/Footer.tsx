import { FC } from "react";
import Link from "next/link";

import ExternalLink from "@/components/ExternalLink";
import { StrapiImage } from "@/components/StrapiImage";
import { EXTERNAL_ROUTES, INTERNAL_ROUTES } from "@/constants/routes";
import { ImageContent, SocialMedia } from "@/types/cms";

export interface FooterProps {
  links: SocialMedia;
  logo: ImageContent;
}

const footer: FC<FooterProps> = ({ links, logo }) => {
  const FooterLinks = {
    externalLinks: [
      {
        href: links?.github || EXTERNAL_ROUTES.GITHUB,
        name: "Github",
      },
      {
        href: links?.linkedin || EXTERNAL_ROUTES.LINKEDIN,
        name: "LinkedIn",
      },
      {
        href: links?.twitter || EXTERNAL_ROUTES.TWITTER,
        name: "Twitter",
      },
      {
        href: links?.youtube || EXTERNAL_ROUTES.YOUTUBE,
        name: "YouTube",
      },
      {
        href: links?.instagram || EXTERNAL_ROUTES.INSTAGRAM,
        name: "Instagram",
      },
    ],
    internalLinks: [
      {
        href: INTERNAL_ROUTES.HOME,
        name: "Home",
      },
      {
        href: INTERNAL_ROUTES.BLOGS,
        name: "Blog",
      },
      {
        href: INTERNAL_ROUTES.TAGS,
        name: "Tags",
      },
    ],
  } as const;

  return (
    <footer className="sticky bottom-0 z-0 -mt-12 bg-primary px-8 pt-16 text-background md:pt-24">
      <div className="container mx-auto flex flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:pb-12">
        <div className="mx-auto w-64 text-center md:mx-0 md:text-left">
          <Link
            className="group flex items-center justify-center gap-1 font-medium text-background md:justify-start"
            href={INTERNAL_ROUTES.HOME}
          >
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-background transition-blog-card duration-blog-card hover:scale-95">
              <StrapiImage
                className="h-auto w-full object-contain"
                height={96}
                image={logo}
                width={96}
              />
            </div>
            <span className="text-center text-xl group-hover:underline">
              Lucas&apos; Tech Blog
            </span>
          </Link>
        </div>
        <div className="flex text-center md:gap-5 md:text-right">
          <div className="px-4 max-md:w-full">
            <nav className="mb-10 list-none">
              <ul>
                {FooterLinks.internalLinks.map(({ href, name }) => (
                  <li key={name}>
                    <Link
                      className="text-lg font-medium text-background hover:text-foreground"
                      href={href}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="px-4 max-md:w-full">
            <nav className="mb-10 list-none">
              <ul>
                {FooterLinks.externalLinks.map(({ href, name }) => (
                  <li key={name}>
                    <ExternalLink
                      className="text-lg font-medium text-background hover:text-foreground"
                      href={href}
                    >
                      {name}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="container flex flex-col">
        <div className="mx-auto h-[1px] w-full bg-background" aria-hidden />
        <div className="container mx-auto flex flex-col flex-wrap px-5 py-4 md:flex-row">
          <p className="text-center text-sm font-medium text-background md:text-left">
            Crafted with ❤️ by{" "}
            <span className="whitespace-nowrap">Lucas Avendaño</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default footer;
