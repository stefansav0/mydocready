import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Excel to PDF Converter Online",
  description:
    "Convert Excel XLS and XLSX files to PDF online with MyDocReady. Create PDF documents from your spreadsheets quickly and easily.",
  path: "/converter/excel-to-pdf",
});

export default function ExcelToPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}