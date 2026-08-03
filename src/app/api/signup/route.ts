import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { getDatabaseName } from "@/lib/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;

    if (!email || !password || !/^\S+@\S+\.\S+$/.test(email)) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return Response.json(
        { error: "Use a password with at least 8 characters." },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db(getDatabaseName());

    const existingUser = await db
      .collection("users")
      .findOne({ email });

    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
