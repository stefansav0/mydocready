import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE } from "@/lib/seo";
import ViewTracker from "@/components/ViewTracker";

export const metadata: Metadata = {
  title: {
    default: "MyDocReady | Free Document, Photo, PDF and Calculator Tools",
    template: "%s | MyDocReady",
  },
  description: SITE.description,
  applicationName: SITE.name,
  manifest: "/manifest.json",
  metadataBase: new URL(SITE.url),

  keywords: [
    "PDF converter",
    "passport photo maker",
    "resize image by KB",
    "resume builder",
    "online calculators",
    "free document tools",
  ],

  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Productivity",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/logo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo.png",
      },
    ],
  },

  openGraph: {
    title: "MyDocReady | Free tools for documents, photos and calculations",
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "MyDocReady Logo",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "MyDocReady | Free document and photo tools",
    description: SITE.description,
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#020617",
    },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <head>

        {/* Google AdSense */}
        <script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9348579900264611"
        />

      </head>

      <body>

        {/* Google Analytics */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-T2SK91EF1Y"
        />

        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T2SK91EF1Y');
          `}
        </Script>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ViewTracker />

          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <NavBar />

          <main id="main-content" tabIndex={-1}>
            {children}
          </main>

          <Footer />
        </ThemeProvider>

      </body>
    </html>
  );
}