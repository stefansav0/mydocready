//app/api/admin/charts/route.ts

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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const chart = await db
      .collection("analytics_events")
      .aggregate([
        {
          $match: {
            createdAt: {
              $gte: sevenDaysAgo,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            visitors: {
              $addToSet: "$sessionId",
            },
          },
        },
        {
          $project: {
            date: "$_id",
            visitors: {
              $size: "$visitors",
            },
            _id: 0,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: chart,
      },
      {
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error(error);

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