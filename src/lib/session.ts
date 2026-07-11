import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "mydocready_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;

type SessionPayload = {
  email: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

function signature(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email: email.toLowerCase(),
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${value}.${signature(value)}`;
}

export function getSessionFromRequest(request: Request): SessionPayload | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

  if (!token) return null;

  const [value, receivedSignature] = token.split(".");
  if (!value || !receivedSignature) return null;

  try {
    const expectedSignature = signature(value);
    const received = Buffer.from(receivedSignature);
    const expected = Buffer.from(expectedSignature);
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.email || typeof payload.email !== "string" || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
