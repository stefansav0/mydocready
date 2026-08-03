import clientPromise from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/session";
import { getDatabaseName } from "@/lib/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name } = body;
    const session = getSessionFromRequest(req);

    if (!session) {
      return Response.json(
        { error: "You must sign in to update a profile." },
        { status: 401 }
      );
    }

    if (typeof name !== "string" || name.trim().length > 80) {
      return Response.json({ error: "Enter a name of up to 80 characters." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(getDatabaseName());

    const result = await db.collection("users").updateOne(
      { email: session.email },
      {
        $set: {
          name: name.trim(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Profile updated",
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
