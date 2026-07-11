import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Sign in",
  description: "Sign in to manage your MyDocReady profile.",
  path: "/signin",
  noIndex: true,
});

export default function SignInLayout({ children }: { children: ReactNode }) {
  return children;
}
