import { FC } from "react";
import Link from "next/link";

import ExternalLink from "@/components/ExternalLink";
import { StrapiImage } from "@/components/StrapiImage";
import { EXTERNAL_ROUTES, INTERNAL_ROUTES } from "@/constants/routes";
import { ImageContent } from "@/types/cms";

export interface FooterProps {
  links: {
    github_link: string;
    instagram_link: string;
    linkedin_link: string;
    twitter_link: string;
    youtube_link: string;
  };
  logo: ImageContent;
}

const footer: FC<FooterProps> = ({
  links: {
    github_link = "",
    instagram_link = "",
    linkedin_link = "",
    twitter_link = "",
    youtube_link = "",
  },
  logo,
}) => {
  const FooterLinks = {
    externalLinks: [
      {
        href: github_link || EXTERNAL_ROUTES.GITHUB,
        name: "Github",
      },
      {
        href: linkedin_link || EXTERNAL_ROUTES.LINKEDIN,
        name: "LinkedIn",
      },
      {
        href: twitter_link || EXTERNAL_ROUTES.TWITTER,
        name: "Twitter",
      },
      {
        href: youtube_link || EXTERNAL_ROUTES.YOUTUBE,
        name: "YouTube",
      },
      {
        href: instagram_link || EXTERNAL_ROUTES.INSTAGRAM,
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
        name: "Blogs",
      },
      {
        href: INTERNAL_ROUTES.ABOUT,
        name: "About",
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
            <div className="h-24 w-24 overflow-hidden rounded-full bg-background transition-blog-card duration-blog-card hover:scale-95">
              <StrapiImage
                className="h-full w-full object-contain"
                image={logo}
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
