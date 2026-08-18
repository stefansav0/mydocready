import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "./globals.css";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import ViewTracker from "@/components/ViewTracker";

import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: "MyDocReady | Free Document, Photo, PDF and Calculator Tools",
    template: "%s | MyDocReady",
  },

  description: SITE.description,

  applicationName: SITE.name,

  manifest: "/manifest.json",

  authors: [
    {
      name: SITE.name,
      url: SITE.url,
    },
  ],

  creator: SITE.name,
  publisher: SITE.name,

  category: "Productivity",

  alternates: {
    canonical: SITE.url,
  },

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
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "MyDocReady | Free Document, Photo, PDF and Calculator Tools",

    description: SITE.description,

    url: SITE.url,

    siteName: SITE.name,

    locale: SITE.locale,

    type: "website",

    images: [
      {
        url: `${SITE.url}/logo.png`,
        width: 512,
        height: 512,
        alt: "MyDocReady Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "MyDocReady | Free Document, Photo, PDF and Calculator Tools",

    description: SITE.description,

    images: [`${SITE.url}/logo.png`],
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

  width: "device-width",

  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {/* =========================================================
            Google AdSense
        ========================================================= */}

        <Script
          id="google-adsense"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9348579900264611"
        />

        {/* =========================================================
            Google Analytics
        ========================================================= */}

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

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-T2SK91EF1Y');
          `}
        </Script>

        {/* =========================================================
            Theme Provider
        ========================================================= */}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ViewTracker />

          {/* Accessibility: Skip navigation */}
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