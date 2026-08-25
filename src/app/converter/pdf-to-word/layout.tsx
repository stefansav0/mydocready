import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "PDF to Word Converter Online",
  description:
    "Convert PDF files to Word documents online with MyDocReady. Create editable Word files from your PDF documents quickly and easily.",
  path: "/converter/pdf-to-word",
});

export default function PdfToWordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}