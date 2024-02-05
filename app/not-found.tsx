import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <div className="grid h-[16em] place-items-center overflow-hidden rounded-full bg-primary px-1 lg:h-96">
        <h1 className="shadow-404 text-9xl font-bold text-white lg:text-[12rem]">
          404
        </h1>
      </div>
      <p className="mb-4 mt-4 text-5xl">Page Not Found</p>
      <Link
        className="inline-block rounded bg-primary px-6 py-2 text-white hover:bg-primary/90"
        href="/"
      >
        Go Home
      </Link>
    </div>
  );
}
