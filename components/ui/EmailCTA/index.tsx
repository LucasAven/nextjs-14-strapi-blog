import { Linkedin, Twitter, Youtube } from "lucide-react";

import EmailForm from "./EmailForm";

import ExternalLink from "@/components/ExternalLink";
import { SHARED_DATA_TAG } from "@/constants/fetchTags";
import { getSingleType, StrapiSingleTypes } from "@/lib/strapi";
import { cn } from "@/lib/utils";

interface EmailCTAProps {
  className?: string;
}

export default async function EmailCTA({ className = "" }: EmailCTAProps) {
  const { social_media } = await getSingleType({
    contentType: StrapiSingleTypes.PAGE_SHARED_DATA,
    nextCacheConfig: {
      tags: [SHARED_DATA_TAG],
    },
  });

  return (
    <div className={cn("px-4 py-8", className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-y-8 md:flex-row">
        <EmailForm />

        <div className="self-center md:self-auto md:border-b-2 md:border-l-2 md:p-5">
          <div className="flex h-full items-center justify-end">
            <div className="text-center md:text-right">
              <h3 className="mb-2 text-xl font-semibold">Follow me!</h3>
              <p>Get the latest news and tech inspiration.</p>
              <div className="mt-4 flex justify-center space-x-4 md:justify-end">
                <ExternalLink
                  className="text-primary hover:text-foreground"
                  href={social_media.twitter}
                >
                  <Twitter />
                </ExternalLink>
                <ExternalLink
                  className="text-primary hover:text-foreground"
                  href={social_media.youtube}
                >
                  <Youtube />
                </ExternalLink>
                <ExternalLink
                  className="text-primary hover:text-foreground"
                  href={social_media.linkedin}
                >
                  <Linkedin />
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
