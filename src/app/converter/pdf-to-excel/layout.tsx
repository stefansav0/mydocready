import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "PDF to Excel Converter Online",
  description:
    "Convert PDF files to Excel XLS and XLSX format online with MyDocReady. Extract data from your PDF documents quickly and easily.",
  path: "/converter/pdf-to-excel",
});

export default function PdfToExcelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}