import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const MAX_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 5_000;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

function textValue(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { name, email, message } = body as Record<string, unknown>;
    const senderName = textValue(name, MAX_NAME_LENGTH);
    const senderEmail = textValue(email, 254).toLowerCase();
    const senderMessage = textValue(message, MAX_MESSAGE_LENGTH);

    if (!senderName || !EMAIL_PATTERN.test(senderEmail) || !senderMessage) {
      return NextResponse.json(
        { error: "Enter a name, valid email address, and message." },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASS;
    if (!emailUser || !emailPassword) {
      console.error("Contact email is not configured.");
      return NextResponse.json({ error: "Contact is temporarily unavailable." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: emailUser, pass: emailPassword },
    });

    await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      replyTo: { name: senderName, address: senderEmail },
      subject: `MyDocReady contact: ${senderName}`,
      text: `Name: ${senderName}\nEmail: ${senderEmail}\n\n${senderMessage}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
