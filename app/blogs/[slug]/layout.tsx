import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "This is a test",
  title: "Create Next App test",
};

export default function BlogPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
