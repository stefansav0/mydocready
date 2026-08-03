"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import type { AnalyticsMetadata } from "@/lib/analytics";

interface Props {
  event: string;
  metadata?: AnalyticsMetadata;
}

export default function PageTracker({
  event,
  metadata = {},
}: Props) {
  useEffect(() => {
    trackEvent(event, metadata);
  }, [event, metadata]);

  return null;
}
