"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ViewTracker() {
  useEffect(() => {
    trackEvent("page_view");
  }, []);

  return null;
}