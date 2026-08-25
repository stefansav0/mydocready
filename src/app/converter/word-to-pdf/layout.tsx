import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Word to PDF Converter Online",
  description:
    "Convert Word documents to PDF format online with MyDocReady. Create PDF documents from your Word files quickly and easily.",
  path: "/converter/word-to-pdf",
});

export default function WordToPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}