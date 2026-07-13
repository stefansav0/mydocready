//app/api/admin/analytics/route.ts

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

    const browsers = await db
      .collection("analytics_events")
      .aggregate([
        {
          $group: {
            _id: "$browser",
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

    const devices = await db
      .collection("analytics_events")
      .aggregate([
        {
          $group: {
            _id: "$device",
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

    const operatingSystems = await db
      .collection("analytics_events")
      .aggregate([
        {
          $group: {
            _id: "$os",
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
        data: {
          browsers,
          devices,
          operatingSystems,
        },
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