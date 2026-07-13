import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Dashboard Cards
    const totalEvents = await db.collection("analytics_events").countDocuments();

    const todayEvents = await db.collection("analytics_events").countDocuments({
      createdAt: { $gte: today },
    });

    const uniqueVisitors = await db
      .collection("analytics_events")
      .distinct("sessionId");

    const liveVisitors = await db
      .collection("analytics_events")
      .distinct("sessionId", {
        createdAt: {
          $gte: fiveMinutesAgo,
        },
      });

    // Top Pages
    const topPages = await db
      .collection("analytics_events")
      .aggregate([
        {
          $match: {
            event: "page_view",
          },
        },
        {
          $group: {
            _id: "$page",
            views: { $sum: 1 },
          },
        },
        {
          $sort: { views: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();

    // Top Tools
    const topTools = await db
      .collection("analytics_events")
      .aggregate([
        {
          $match: {
            event: {
              $in: [
                "resume_generated",
                "ats_score_checked",
                "cover_letter_generated",
                "pdf_download",
                "image_compress_completed",
                "presentation_created",
              ],
            },
          },
        },
        {
          $group: {
            _id: "$event",
            total: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        totalEvents,
        todayEvents,
        uniqueVisitors: uniqueVisitors.length,
        liveVisitors: liveVisitors.length,
        topPages,
        topTools,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}