"use client";

import React from "react";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/seo";
import HeroSection from "@/components/HeroSection";

import QuickLinks from "@/components/home/QuickLinks";
import PrimarySuite from "@/components/home/PrimarySuite";
import CreativeSuite from "@/components/home/CreativeSuite";
import TrustImpact from "@/components/home/TrustImpact";
import HelpfulGuides from "@/components/home/HelpfulGuides";

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/logo.png`,
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