import { createPageMetadata } from "@/lib/seo";
import ScanDocumentClient from "./scan-document-client";

export const metadata = createPageMetadata({
  title: "Document Scanner",
  description: "Scan documents, receipts, forms, and papers in the browser with print-ready PDF export.",
  path: "/scan-document",
});

export default function ScanDocumentPage() {
  return <ScanDocumentClient />;
}
