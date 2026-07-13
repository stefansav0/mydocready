"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ResumeMakerTracker() {
  useEffect(() => {
    trackEvent("resume_maker_page_view");
  }, []);

  return null;
}