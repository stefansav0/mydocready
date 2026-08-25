import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "PowerPoint to PDF Converter Online",
  description:
    "Convert PowerPoint presentations to PDF format online with MyDocReady. Create PDF documents from your presentation files quickly and easily.",
  path: "/converter/powerpoint-to-pdf",
});

export default function PowerpointToPdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}