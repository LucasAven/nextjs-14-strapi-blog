"use client";

import { useRef } from "react";
import Link from "next/link";

import { StrapiImage } from "@/components/StrapiImage";
import { INTERNAL_ROUTES } from "@/constants/routes";
import useScrollListener from "@/hooks/useScrollListener";
import { ImageContent } from "@/types/cms";

export default function Navbar({ logo }: { logo: ImageContent }) {
  const navRef = useRef(null);

  // hide navbar on scroll down
  useScrollListener({
    handleScroll: () => {
      let lastScrollTop = 0;

      const scrollTop = window.scrollY;

      if (navRef.current) {
        if (scrollTop > lastScrollTop) {
          navRef.current.style.top = "-80px";
        } else {
          navRef.current.style.top = "0";
        }

        lastScrollTop = scrollTop;
      }
    },
  });

  return (
    <header
      className="fixed left-0 top-0 z-50 flex h-20 w-full justify-between bg-background p-4 text-foreground transition-all duration-500"
      ref={navRef}
    >
      <Link aria-label="Home" href={INTERNAL_ROUTES.HOME}>
        <StrapiImage
          className="h-full w-full object-contain"
          image={logo}
          priority
        />
      </Link>
      <nav className="flex items-center justify-center gap-4">
        <h6>
          <Link className="hover:text-primary" href={INTERNAL_ROUTES.HOME}>
            Home
          </Link>
        </h6>
        <h6>
          <Link className="hover:text-primary" href={INTERNAL_ROUTES.BLOGS}>
            Blogs
          </Link>
        </h6>
        <h6>
          <Link className="hover:text-primary" href={INTERNAL_ROUTES.ABOUT}>
            About Us
          </Link>
        </h6>
      </nav>
    </header>
  );
}
