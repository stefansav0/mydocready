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
  title: "MyDocReady - Free Document, PDF & Image Tools",

  description:
    "Prepare documents, PDFs, photos and files for everyday applications with free, easy-to-use online tools from MyDocReady.",

  alternates: {
    canonical: "https://www.mydocready.com/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "MyDocReady - Free Document, PDF & Image Tools",

    description:
      "Free online tools to prepare, edit, convert, compress and manage documents, PDFs, photos and files.",

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

    {
      "@type": "WebPage",

      "@id": `${SITE.url}/#webpage`,

      url: SITE.url,

      name: "MyDocReady - Free Document, PDF & Image Tools",

      description:
        "Free online tools to prepare documents, PDFs, photos and files for everyday applications.",

      isPartOf: {
        "@id": `${SITE.url}/#website`,
      },

      about: {
        "@id": `${SITE.url}/#organization`,
      },
    },
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* Structured Data */}
      <JsonLd data={HOME_JSON_LD} />

      {/* 1. Clear introduction */}
      <HeroSection />

      {/* 2. Most useful tools */}
      <QuickLinks />

      {/* 3. Why MyDocReady / trust */}
      <TrustImpact />

      {/* 4. Main document & PDF tools */}
      <PrimarySuite />

      {/* 5. Photo, image & creative tools */}
      <CreativeSuite />

      {/* 6. Helpful original resources */}
      <HelpfulGuides />
    </main>
  );
}