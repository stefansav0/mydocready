import clientPromise from "@/lib/mongodb";
import { getDatabaseName } from "@/lib/database";

export async function GET(request: Request) {
  if (request.headers.get("x-api-key") !== process.env.ADMIN_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    await client.db(getDatabaseName()).command({ ping: 1 });
    return Response.json({ success: true, message: "MongoDB connected" });
  } catch (error) {
    console.error("MongoDB health check failed:", error);
    return Response.json({ success: false, error: "Database is unavailable." }, { status: 503 });
  }
}
