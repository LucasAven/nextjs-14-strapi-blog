import { Linkedin, Twitter, Youtube } from "lucide-react";

import EmailForm from "./EmailForm";

import ExternalLink from "@/components/ExternalLink";
import { getSingleType } from "@/lib/strapi";

export default async function EmailCTA() {
  const { linkedin_link, twitter_link, youtube_link } =
    await getSingleType("page-shared-data");

  return (
    <div className="px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-8 md:flex-row">
        <EmailForm />

        <div className="self-center md:self-auto md:border-b-2 md:border-l-2 md:p-5">
          <div className="flex h-full items-center justify-end">
            <div className="text-center md:text-right">
              <h3 className="mb-2 text-xl font-semibold">Follow me!</h3>
              <p>Get the latest news and tech inspiration.</p>
              <div className="mt-4 flex justify-end space-x-4">
                <ExternalLink
                  className="text-primary hover:text-foreground"
                  href={twitter_link}
                >
                  <Twitter />
                </ExternalLink>
                <ExternalLink
                  className="text-primary hover:text-foreground"
                  href={youtube_link}
                >
                  <Youtube />
                </ExternalLink>
                <ExternalLink
                  className="text-primary hover:text-foreground"
                  href={linkedin_link}
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
