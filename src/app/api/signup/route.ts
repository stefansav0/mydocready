import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("myapp");

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
  } catch (error) {
    return Response.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}