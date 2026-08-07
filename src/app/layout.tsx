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
    // Image Tools
  "Passport photo maker",
  "Passport size photo maker",
  "Passport photo online",
  "Visa photo maker",
  "Photo resize online",
  "Resize image by KB",
  "Resize image to 10KB",
  "Resize image to 20KB",
  "Resize image to 30KB",
  "Resize image to 50KB",
  "Resize image to 100KB",
  "Resize image to 200KB",
  "Resize image to 500KB",
  "Compress image",
  "Image compressor",
  "JPG compressor",
  "JPEG compressor",
  "PNG compressor",
  "WebP compressor",
  "Image cropper",
  "Crop image online",
  "Background remover",
  "Image resizer",
  "Resize photo",
  "Convert JPG to PNG",
  "Convert PNG to JPG",
  "Convert WebP to JPG",
  "Convert JPG to WebP",
  "Image converter",
  "Image optimizer",
  "Reduce image size",
  "Photo editor online",
  "Photo compressor",
  "Signature resize",
  "Signature cropper",
  "Passport photo editor",
  "ID photo maker",
  "Image DPI converter",
  "Image to PDF",
  "Photo to PDF",

  // Resume & CV
  "Resume builder",
  "Resume maker",
  "Free resume builder",
  "Resume creator",
  "Online resume builder",
  "Online CV maker",
  "CV builder",
  "CV maker",
  "ATS resume builder",
  "ATS resume checker",
  "Resume templates",
  "Professional resume templates",
  "Resume PDF download",
  "Student resume builder",
  "Fresher resume builder",
  "Experienced resume builder",
  "AI resume builder",
  "Resume examples",
  "Resume generator",
  "Resume optimizer",
  "Resume checker",
  "Resume editor",
  "Cover letter builder",
  "Cover letter generator",
  "Resume format",
  "CV templates",
  "Job resume builder",
  "Simple resume maker",
  "Creative resume templates",
  "Modern resume builder",

  // Document Tools
  "Free document tools",
  "Document converter",
  "Online document converter",
  "Document editor",
  "Document merger",
  "Document splitter",
  "Word editor online",
  "DOC converter",
  "DOCX converter",
  "Text converter",
  "RTF to PDF",
  "TXT to PDF",
  "File converter",
  "File compressor",
  "Online office tools",
  "OCR document",
  "Scan PDF",
  "Image to text",
  "PDF to DOCX",
  "DOCX to PDF",
  "Word to JPG",
  "JPG to Word",
  "Document repair",
  "File repair",
  "Online OCR",
  "Text extractor",
  "Document scanner",
  "Free file tools",
  "Online document utilities",
  "Document optimizer",

  // Calculators
  "Online calculator",
  "Scientific calculator",
  "Age calculator",
  "BMI calculator",
  "EMI calculator",
  "Loan calculator",
  "Home loan calculator",
  "Car loan calculator",
  "GST calculator",
  "Tax calculator",
  "Income tax calculator",
  "Percentage calculator",
  "Discount calculator",
  "Profit calculator",
  "Loss calculator",
  "Margin calculator",
  "Date calculator",
  "Time calculator",
  "Hours calculator",
  "Days calculator",
  "Currency converter",
  "Unit converter",
  "Length converter",
  "Weight converter",
  "Temperature converter",
  "Speed converter",
  "SIP calculator",
  "FD calculator",
  "RD calculator",
  "Compound interest calculator",
  "Simple interest calculator",
  "Salary calculator",
  "Calorie calculator",
  "Retirement calculator",
  "Pregnancy calculator",

  // Government Exam Photo Tools
  "Aadhaar photo resize",
  "PAN card photo resize",
  "Driving licence photo resize",
  "SSC photo resize",
  "UPSC photo resize",
  "NEET photo resize",
  "JEE photo resize",
  "CUET photo resize",
  "Government exam photo resize",
  "Signature resize for application",
  "Photo resize for online form",
  "Resize passport photo",
  "Photo crop for ID",
  "Photo resize for visa",
  "Exam signature resize",

  // AI Tools
  "AI PDF summarizer",
  "AI resume builder",
  "AI cover letter generator",
  "AI document summarizer",
  "AI grammar checker",
  "AI paraphrasing tool",
  "AI OCR tool",
  "AI PDF reader",
  "AI image to text",
  "AI translator",
  "AI document analyzer",
  "AI note summarizer",
  "AI text generator",
  "AI writing assistant",
  "AI file converter",

  // Long-Tail Keywords
  "compress PDF to 100KB online free",
  "compress PDF to 200KB online",
  "compress PDF without losing quality",
  "resize image to 20KB online",
  "resize image to 50KB online",
  "resize image to 100KB online",
  "passport size photo maker online free",
  "free resume builder with PDF download",
  "ATS resume builder free",
  "convert PDF to Word editable",
  "merge PDF files online free",
  "split PDF pages online",
  "remove PDF password online",
  "JPG to PDF converter free",
  "PDF editor without watermark",
  "online GST calculator India",
  "age calculator by date of birth",
  "background remover HD free",
  "compress image under 100KB",
  "signature resize online free",
  "online document converter free",
  "OCR PDF to Word free",
  "image cropper online free",
  "convert image to passport photo",
  "online image compressor without losing quality",
  "best PDF tools online",
  "free online office tools",
  "online file converter free",
  "PDF toolkit free",
  "resume maker without watermark",

  // Generic High Search
  "Free PDF tools",
  "Free image tools",
  "Free online tools",
  "Document tools",
  "Online utilities",
  "Free utilities",
  "File tools",
  "Image tools",
  "PDF utilities",
  "Document utilities",
  "Web tools",
  "Free productivity tools",
  "Office tools online",
  "Online converter",
  "File converter online",
  "Image converter online",
  "PDF software online",
  "Best online tools",
  "Free browser tools",
  "All-in-one PDF tools"
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