import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";
import PageTracker from "@/components/PageTracker";

export const metadata = createPageMetadata({
  title: "Free Online PDF and Document Converters",
  description:
    "Convert Word, Excel, PowerPoint, JPG, and PDF files online with simple, browser-friendly document tools from MyDocReady.",
  path: "/converter",
});

export default function ConverterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PageTracker
        event="converter_page_view"
        metadata={{
          page: "converter",
          category: "document_tools",
        }}
      />

      {children}
    </>
  );
}