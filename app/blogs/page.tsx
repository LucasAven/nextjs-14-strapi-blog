import Link from "next/link";
import { redirect } from "next/navigation";

import Pagination from "@/components/Pagination";
import { INTERNAL_ROUTES } from "@/constants/routes";
import { getCollectionType } from "@/lib/strapi";

export default async function Blogs({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const { page } = searchParams;

  if (!page) {
    redirect(`${INTERNAL_ROUTES.BLOGS}?page=1`);
  }

  const { data: blogs, pagination } = await getCollectionType({
    contentType: "blogs",
    pagination: { page: Number(page), pageSize: 1 },
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {blogs.map((blog) => (
        <Link key={blog.slug} href={`${INTERNAL_ROUTES.BLOGS}/${blog.slug}`}>
          {blog.title}
        </Link>
      ))}
      <Pagination {...pagination} className="mt-5" />
    </main>
  );
}
