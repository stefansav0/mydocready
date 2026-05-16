import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myapp");

    await db.command({ ping: 1 });

    return Response.json({
      success: true,
      message: "MongoDB connected",
    });
  } catch (error: any) {
    console.error("🔥 FULL MONGO ERROR:", error);

    return Response.json({
      success: false,
      error: error?.message,
      name: error?.name,
      code: error?.code,
    });
  }
}