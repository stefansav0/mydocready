import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/session";
import { getDatabaseName } from "@/lib/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;

    if (!email || typeof password !== "string") {
      return NextResponse.json(
        {
          error: "Missing email or password",
        },
        {
          status: 400,
        }
      );
    }

    // Connect MongoDB
    const client = await clientPromise;
    const db = client.db(getDatabaseName());

    // Find user
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // Check stored password
    if (!user.password) {
      console.error("User record is missing a password hash.");

      return NextResponse.json(
        {
          error: "Account is not configured correctly.",
        },
        {
          status: 500,
        }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    // Create session
    const token = createSessionToken(user.email);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || "",
      },
    });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      sessionCookieOptions
    );

    return response;
  } catch (error) {
    // PRINT THE REAL ERROR
    console.error("========== SIGNIN ERROR ==========");
    console.error(error);
    console.error("==================================");

    return NextResponse.json(
      {
        success: false,
        error: "Unable to sign in right now.",
      },
      {
        status: 500,
      }
    );
  }
}
