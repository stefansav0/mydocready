import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { getDatabaseName } from "@/lib/database";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter your email address." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(getDatabaseName());

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account exists for this email, a password reset OTP has been prepared.",
        },
        { status: 200 }
      );
    }

    const otp = randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetOtpHash: otpHash,
          passwordResetOtpExpiresAt: expiresAt,
          updatedAt: new Date(),
        },
      }
    );

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your password reset OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Password reset request</h2>
            <p>Your one-time password is:</p>
            <div style="font-size: 32px; letter-spacing: 6px; font-weight: 700; color: #2563eb; margin: 20px 0;">${otp}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Forgot password email sending failed:", mailError);
      return NextResponse.json(
        { error: "We could not send the reset email. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "We sent a 6-digit OTP to your email. Enter it below to set a new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { error: "Unable to process your request right now." },
      { status: 500 }
    );
  }
}
