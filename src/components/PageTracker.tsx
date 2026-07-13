"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  event: string;
  metadata?: Record<string, any>;
}

export default function PageTracker({
  event,
  metadata = {},
}: Props) {
  useEffect(() => {
    trackEvent(event, metadata);
  }, []);

  return null;
}