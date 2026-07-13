//app/api/admin/tools/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
          headers: corsHeaders(),
        }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const tools = await db
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

    return NextResponse.json(
      {
        success: true,
        data: tools,
      },
      {
        headers: corsHeaders(),
      }
    );
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}