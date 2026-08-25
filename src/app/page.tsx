import type { Metadata } from "next";

import React from "react";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/seo";

import HeroSection from "@/components/HeroSection";
import QuickLinks from "@/components/home/QuickLinks";
import PrimarySuite from "@/components/home/PrimarySuite";
import CreativeSuite from "@/components/home/CreativeSuite";
import TrustImpact from "@/components/home/TrustImpact";
import HelpfulGuides from "@/components/home/HelpfulGuides";

/**
 * Homepage SEO Metadata
 */
export const metadata: Metadata = {
  title: "MyDocReady - Free Online Document, PDF & Image Tools",
  description:
    "MyDocReady provides free online tools to create, edit, convert, compress and manage PDFs, documents, images and more.",
  alternates: {
    canonical: "https://www.mydocready.com/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "MyDocReady - Free Online Document, PDF & Image Tools",
    description:
      "Free online tools to create, edit, convert, compress and manage PDFs, documents, images and more.",
    url: "https://www.mydocready.com/",
    siteName: SITE.name,
    type: "website",
  },
};

/**
 * Homepage Structured Data
 */
const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/logo.png`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      publisher: {
        "@id": `${SITE.url}/#organization`,
      },
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* Structured Data */}
      <JsonLd data={HOME_JSON_LD} />

      {/* 1. Main introduction */}
      <HeroSection />

      {/* 2. Popular shortcuts */}
      <QuickLinks />

      {/* 3. Core tools */}
      <PrimarySuite />

      {/* 4. Additional tools */}
      <CreativeSuite />

      {/* 5. Helpful resources */}
      <HelpfulGuides />

      {/* 6. About / trust */}
      <TrustImpact />
    </div>
  );
}