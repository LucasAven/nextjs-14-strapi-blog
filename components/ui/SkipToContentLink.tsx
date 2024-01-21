"use client";

const SkipToContentLink = () => (
  <a
    className="absolute -top-16 left-5 z-50 bg-primary/90 px-4 py-4 focus-within:top-28 motion-safe:transition-all motion-safe:duration-500"
    href="#main"
    onKeyDown={(e) => {
      if (e.key === " ") {
        e.preventDefault();
        (e.target as HTMLAnchorElement).click();
      }
    }}
  >
    Skip to main content
  </a>
);

export default SkipToContentLink;
