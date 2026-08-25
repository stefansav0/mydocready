import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.mydocready.com/resize",
  },
};

export default function ResizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}