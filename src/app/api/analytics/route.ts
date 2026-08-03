import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import clientPromise from "@/lib/mongodb";
import { getDatabaseName } from "@/lib/database";

const MAX_TEXT_LENGTH = 2_048;
const MAX_METADATA_KEYS = 20;

function text(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sanitizeMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const sanitized: Record<string, string | number | boolean | null> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, MAX_METADATA_KEYS)) {
    const metadataKey = text(key, 100);
    if (!metadataKey) continue;

    if (typeof item === "string") sanitized[metadataKey] = text(item, 500);
    if (typeof item === "number" || typeof item === "boolean" || item === null) {
      sanitized[metadataKey] = item;
    }
  }

  return sanitized;
}

function getIpAddress(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid analytics payload." }, { status: 400 });
    }

    const { event, page, referrer, sessionId, metadata } = body as Record<string, unknown>;
    const pagePath = text(page);
    if (!pagePath.startsWith("/")) {
      return NextResponse.json({ error: "A valid page path is required." }, { status: 400 });
    }

    const parser = new UAParser(request.headers.get("user-agent") || "");
    const userAgent = parser.getResult();
    const ipHash = crypto.createHash("sha256").update(getIpAddress(request)).digest("hex");

    const client = await clientPromise;
    await client.db(getDatabaseName()).collection("analytics_events").insertOne({
      event: text(event, 100) || "page_view",
      page: pagePath,
      referrer: text(referrer),
      sessionId: text(sessionId, 128),
      metadata: sanitizeMetadata(metadata),
      ipHash,
      browser: userAgent.browser.name || "Unknown",
      os: userAgent.os.name || "Unknown",
      device: userAgent.device.type || "Desktop",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics event could not be stored:", error);
    return NextResponse.json({ error: "Analytics is temporarily unavailable." }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  if (request.headers.get("x-api-key") !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const count = await client.db(getDatabaseName()).collection("analytics_events").countDocuments();
    return NextResponse.json({ success: true, analyticsDocuments: count });
  } catch (error) {
    console.error("Analytics status check failed:", error);
    return NextResponse.json({ error: "Analytics is temporarily unavailable." }, { status: 503 });
  }
}
