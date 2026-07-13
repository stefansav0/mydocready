export async function trackEvent(
  event: string,
  metadata: Record<string, any> = {}
) {
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
  } catch (error) {
    console.error("Analytics Error:", error);
  }
}