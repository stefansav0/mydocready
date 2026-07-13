import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import { UAParser } from "ua-parser-js";

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Analytics API Started");

    const body = await req.json();

    const {
      event = "page_view",
      page,
      referrer = "",
      sessionId = "",
      metadata = {},
    } = body;

    console.log("📦 Body:", body);

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: "Page is required",
        },
        { status: 400 }
      );
    }

    console.log("🔌 Connecting to MongoDB...");

    const client = await clientPromise;

    console.log("✅ MongoDB Connected");

    // IMPORTANT: This tells us which database is being used
    const db = client.db(process.env.MONGODB_DB);

    console.log("📂 Database:", db.databaseName);

    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const ipHash = crypto
      .createHash("sha256")
      .update(ip)
      .digest("hex");

    const parser = new UAParser(req.headers.get("user-agent") || "");
    const result = parser.getResult();

    const analyticsDoc = {
      event,
      page,
      referrer,
      sessionId,
      metadata,

      ipHash,

      browser: result.browser.name || "Unknown",
      os: result.os.name || "Unknown",
      device: result.device.type || "Desktop",

      userAgent: req.headers.get("user-agent") || "",

      createdAt: new Date(),
    };

    console.log("📝 Inserting document...");

    const insertResult = await db
      .collection("analytics_events")
      .insertOne(analyticsDoc);

    console.log("✅ Insert Success");
    console.log("🆔 Document ID:", insertResult.insertedId);

    // Count documents for verification
    const count = await db
      .collection("analytics_events")
      .countDocuments();

    console.log("📊 Total Analytics Documents:", count);

    return NextResponse.json({
      success: true,
      insertedId: insertResult.insertedId,
      database: db.databaseName,
      totalDocuments: count,
    });
  } catch (error: any) {
    console.error("❌ Analytics Error");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Optional GET route for quick testing in browser
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const count = await db.collection("analytics_events").countDocuments();

    return NextResponse.json({
      success: true,
      database: db.databaseName,
      analyticsDocuments: count,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}