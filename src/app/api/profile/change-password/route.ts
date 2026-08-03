import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { getSessionFromRequest } from "@/lib/session";
import { getDatabaseName } from "@/lib/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { password } = body;
    const session = getSessionFromRequest(req);

    if (!session) {
      return Response.json(
        { error: "You must sign in to change a password." },
        { status: 401 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return Response.json({ error: "Use a password with at least 8 characters." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(getDatabaseName());

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").updateOne(
      { email: session.email },
      {
        $set: {
          password: hashedPassword,
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
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
