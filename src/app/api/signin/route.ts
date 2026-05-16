import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        {
          error: "Missing email or password",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("myapp");

    const user = await db
      .collection("users")
      .findOne({ email });

    if (!user) {
      return Response.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return Response.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}