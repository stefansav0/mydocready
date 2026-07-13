//src/app/api/admin/recent/route.ts

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
    if (req.headers.get("x-api-key") !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false },
        {
          status: 401,
          headers: corsHeaders(),
        },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const recent = await db
      .collection("analytics_events")
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .project({
        event: 1,
        page: 1,
        browser: 1,
        device: 1,
        createdAt: 1,
      })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: recent,
      },
      {
        headers: corsHeaders(),
      },
    );
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { success: false },
      {
        status: 500,
        headers: corsHeaders(),
      },
    );
  }
}