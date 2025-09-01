import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SupabaseProvider from "./supabase-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocReady Photo – Resize by KB, Passport Maker, Aadhaar/PAN",
  description:
    "Instantly resize photos to exact KB, create passport-size photos with white/blue background, and get document-ready outputs for Aadhaar, PAN, Passport, RRB, SSC, NEET.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://mydocready.com"),
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    title: "DocReady Photo",
    description:
      "Resize photos by KB, make passport size photos, Aadhaar & PAN ready instantly.",
    url: "https://mydocready.com",
    siteName: "MyDocReady",
    images: [{ url: "/logo.png" }],
    type: "website",
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ✅ Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-T2SK91EF1Y"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T2SK91EF1Y');
          `}
        </Script>

       {/* ✅ Google AdSense */}
<Script
  strategy="afterInteractive"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9348579900264611"
  crossOrigin="anonymous"
/>



        <SupabaseProvider>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
