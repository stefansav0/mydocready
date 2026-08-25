import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "PDF to JPG Converter Online",
  description:
    "Convert PDF files to JPG images online with MyDocReady. Create JPG documents from your PDF files quickly and easily.",
  path: "/converter/pdf-to-jpg",
});

export default function PdfToJpgLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}