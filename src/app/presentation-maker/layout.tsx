import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Free Online Presentation and Slide Maker",
  description:
    "Create clear, professional presentation slides online with an easy-to-use maker for school, work, and personal projects.",
  path: "/presentation-maker",
});

export default function PresentationMakerLayout({ children }: { children: ReactNode }) {
  return children;
}
