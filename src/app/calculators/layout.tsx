import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Free Financial and Everyday Calculators",
  description:
    "Calculate EMI, SIP returns, fixed-deposit maturity, GST, tax, age, percentages, savings goals, and shared bills with clear results.",
  path: "/calculators",
});

export default function CalculatorsLayout({ children }: { children: ReactNode }) {
  return children;
}
