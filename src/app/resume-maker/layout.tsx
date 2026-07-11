import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Free ATS-Friendly Resume Builder and Templates",
  description:
    "Create a polished, ATS-friendly resume with clear templates, guided sections, and downloadable document formatting tools.",
  path: "/resume-maker",
});

export default function ResumeMakerLayout({ children }: { children: ReactNode }) {
  return children;
}
