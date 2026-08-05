"use client";

import React from "react";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/seo";
import HeroSection from "@/components/HeroSection";

// Import your modular sections
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
      publisher: { "@id": `${SITE.url}/#organization` },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is MyDocReady free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Many MyDocReady document and image tools are available free of charge. Check each tool page for the latest feature details.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to create an account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most tools can be used without creating an account. Any feature that requires sign-in is identified before use.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use MyDocReady on mobile devices?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. MyDocReady is designed to work on current smartphones, tablets, laptops, and desktop browsers.",
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-200 selection:text-indigo-900">
      <JsonLd data={HOME_JSON_LD} />
      
      {/* 1. Clean Hero Banner */}
      <HeroSection />

      {/* 2. Tools & Utilities */}
      <QuickLinks />
      <PrimarySuite />
      <CreativeSuite />
      {/* 4. Blogs & Resources */}
      <HelpfulGuides />

      {/* 3. About MyDocReady (Trust, Stats & Impact) */}
      <TrustImpact />

      

      
      
      
    </div>
  );
}