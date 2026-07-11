import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Create an account",
  description: "Create a MyDocReady account.",
  path: "/signup",
  noIndex: true,
});

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return children;
}
