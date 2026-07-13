"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  slug: string;
  title: string;
  category?: string;
}

export default function BlogViewTracker({
  slug,
  title,
  category,
}: Props) {
  useEffect(() => {
    trackEvent("blog_view", {
      slug,
      title,
      category,
    });
  }, [slug, title, category]);

  return null;
}