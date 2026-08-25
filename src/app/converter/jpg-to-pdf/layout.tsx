import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "JPG to PDF Converter Online",
  description:
    "Convert JPG images to PDF online with MyDocReady. Create PDF documents from your images quickly and easily.",
  path: "/converter/jpg-to-pdf",
});

export default function JpgToPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}