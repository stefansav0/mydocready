export type AnalyticsMetadata = Record<string, unknown>;

export async function trackEvent(event: string, metadata: AnalyticsMetadata = {}) {
  if (typeof window === "undefined") return;

  const SESSION_KEY = "mdr_session_id";

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        page: window.location.pathname,
        referrer: document.referrer,
        sessionId,
        metadata,
      }),
      keepalive: true,
    });
  } catch {}
}
