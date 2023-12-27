import { redirect } from "next/navigation";

import Pagination from "@/components/Pagination";
import BlogsGrid from "@/components/ui/BlogsGrid";
import EmailCTA from "@/components/ui/EmailCTA";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { getCollectionType, StrapiCollectionTypes } from "@/lib/strapi";

export default async function Blogs({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const { page } = searchParams;
  const parsedPage = page ? Number(page) : 1;

  if (!parsedPage) {
    redirect(INTERNAL_ROUTES.BLOGS);
  }

  const { data: blogs, pagination } = await getCollectionType({
    contentType: StrapiCollectionTypes.BLOGS,
    pagination: { page: parsedPage, pageSize: 3 },
  });

  if (!blogs.length) {
    redirect(INTERNAL_ROUTES.BLOGS);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-5 md:p-10 xl:p-14">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
        Blogs
      </h1>
      <BlogsGrid blogs={blogs} />
      <Pagination {...pagination} className="mt-5" />
      <EmailCTA className="mt-10" />
    </main>
  );
}
