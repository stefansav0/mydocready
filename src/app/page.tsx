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
      
      {/* --- Background Remover Highlight Section --- */}
      <section className="py-16 sm:py-24 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
            
            {/* Text Content */}
            <div className="lg:pr-8">
              <div className="lg:max-w-lg">
                <span className="text-sm font-semibold leading-7 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  New Feature
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Instant Background Remover
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Isolate subjects and remove distracting backgrounds in seconds. Whether you're creating product mockups, refining profile pictures, or designing marketing assets, our AI-powered tool does the heavy lifting for you.
                </p>
                <div className="mt-8">
                  <a
                    href="/bg-remover" 
                    className="inline-flex rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                  >
                    Try Background Remover
                  </a>
                </div>
              </div>
            </div>
            
            {/* Image Presentation */}
            <div className="relative">
              {/* Decorative background blob/shape */}
              <div className="absolute -inset-y-16 -inset-x-8 -z-10 bg-slate-100/50 rounded-[3rem] transform rotate-3 sm:rotate-6 sm:scale-105" />
              
              <img
                src="/bg.png"
                alt="Background Remover Before and After"
                className="relative rounded-2xl shadow-2xl ring-1 ring-slate-900/10 object-cover w-full transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* --- Typing Test Highlight Section --- */}
      <section className="py-16 sm:py-24 overflow-hidden relative bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
            
            {/* Image Presentation (Reversed order on large screens for alternating layout) */}
            <div className="relative lg:order-first">
              <div className="absolute -inset-y-16 -inset-x-8 -z-10 bg-slate-50 rounded-[3rem] transform -rotate-3 sm:-rotate-6 sm:scale-105" />
              
              <img
                src="/typ.png"
                alt="Typing Speed Test Interface"
                className="relative rounded-2xl shadow-2xl ring-1 ring-slate-900/10 object-cover w-full transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>

            {/* Text Content */}
            <div className="lg:pl-8">
              <div className="lg:max-w-lg">
                <span className="text-sm font-semibold leading-7 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Skill Builder
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Professional Typing Test
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Improve your WPM (Words Per Minute) and typing accuracy with our interactive testing engine. Choose between rapid-fire speed drills and guided literature lessons to build muscle memory and track your progress.
                </p>
                <div className="mt-8">
                  <a
                    href="/typing-test" 
                    className="inline-flex rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors"
                  >
                    Test Your Speed
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4. Blogs & Resources */}
      <HelpfulGuides />

      {/* 3. About MyDocReady (Trust, Stats & Impact) */}
      <TrustImpact />
      
    </div>
  );
}