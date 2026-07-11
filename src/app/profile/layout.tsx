import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "My profile",
  description: "Manage your MyDocReady profile.",
  path: "/profile",
  noIndex: true,
});

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
