import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a DOCX file" },
        { status: 400 }
      );
    }

    const isDocx =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");
    if (!isDocx) {
      return NextResponse.json({ error: "Only DOCX files are supported." }, { status: 400 });
    }

    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Choose a DOCX file smaller than 10 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // DOCX -> HTML
    const result = await mammoth.convertToHtml({
      buffer,
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'" />
        <title>Converted PDF</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 40px;
            line-height: 1.6;
            color: #111;
            font-size: 14px;
          }

          h1,h2,h3,h4,h5,h6{
            margin-top:20px;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }

          table,
          th,
          td {
            border: 1px solid #ddd;
          }

          th,
          td {
            padding: 8px;
          }

          img {
            max-width: 100%;
            height: auto;
          }

          p {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        ${result.value}
      </body>
      </html>
    `;

    const isVercel = process.env.VERCEL === "1";

    let browser;

    if (isVercel) {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      browser = await puppeteer.launch({
        headless: true,
      });
    }

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: {
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
  },
});

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="converted.pdf"',
      },
    });
  } catch (error) {
    console.error("Conversion Error:", error);

    return NextResponse.json(
      {
        error: "Conversion failed",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
