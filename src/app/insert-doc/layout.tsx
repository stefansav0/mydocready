import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Printable Passport Photos | MyDocReady",

  description:
    "Create printable 35x45mm passport-style photos and generate an A4 PDF for easy printing with MyDocReady.",

  alternates: {
    canonical: "https://www.mydocready.com/insert-doc",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Printable Passport Photos | MyDocReady",

    description:
      "Create printable 35x45mm passport-style photos and generate an A4 PDF for easy printing with MyDocReady.",

    url: "https://www.mydocready.com/insert-doc",

    siteName: "MyDocReady",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Printable Passport Photos | MyDocReady",

    description:
      "Create printable 35x45mm passport-style photos and generate an A4 PDF for easy printing with MyDocReady.",
  },
};

export default function InsertDocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}