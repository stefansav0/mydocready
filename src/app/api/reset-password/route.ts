import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, password } = body;

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Email, OTP, and password are required." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myapp");

    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return NextResponse.json(
        { error: "This OTP is invalid or has expired." },
        { status: 400 }
      );
    }

    if (new Date(user.passwordResetOtpExpiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const otpMatches = await bcrypt.compare(otp.toString(), user.passwordResetOtpHash);

    if (!otpMatches) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          passwordResetOtpHash: null,
          passwordResetOtpExpiresAt: null,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      { error: "Unable to reset password right now." },
      { status: 500 }
    );
  }
}
