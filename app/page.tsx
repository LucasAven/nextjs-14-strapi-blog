import BlogCard from "@/components/ui/BlogCard";
import FeaturedBlogCard from "@/components/ui/BlogCard/FeaturedBlogCard";
import EmailCTA from "@/components/ui/EmailCTA";
import EmailForm from "@/components/ui/EmailCTA/EmailForm";
import { getFeaturedBlog, getLatestBlogs } from "@/lib/strapi";

export default async function Home() {
  const featuredBlog = await getFeaturedBlog();
  const latestBlogs = await getLatestBlogs({
    amount: 6,
    featuredBlogSlug: featuredBlog.slug,
  });

  // TODO: Add SEO
  // TODO: Add blog page

  return (
    <main className="flex flex-col">
      <section className="container pb-20 pt-16 max-sm:px-4">
        <div className="mb-10 flex flex-col gap-4 text-center md:mb-20">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Lucas&apos; Tech Blog
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
            From Lines of Code to Digital Stories: join my journey into{" "}
            <span className="text-primary">Tech</span> and{" "}
            <span className="text-primary">web development</span>!
          </p>
          <EmailForm className="mt-5" showInputOnly />
        </div>
        <FeaturedBlogCard data={featuredBlog} />
      </section>
      <section className="container flex flex-col gap-4 max-md:px-4">
        <h2 className="text-center text-3xl font-bold tracking-tighter md:text-left md:text-4xl lg:text-5xl">
          Latest Blogs
        </h2>
        <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {latestBlogs.length > 0 &&
            latestBlogs.map((blog) => <BlogCard key={blog.slug} data={blog} />)}
        </div>
        <EmailCTA />
      </section>
    </main>
  );
}
