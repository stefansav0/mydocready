import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "PDF to PowerPoint Converter Online",
  description:
    "Convert PDF files to PowerPoint format online with MyDocReady. Create presentation documents from your PDF files quickly and easily.",
  path: "/converter/pdf-to-powerpoint",
});

export default function PdfToPowerPointLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}