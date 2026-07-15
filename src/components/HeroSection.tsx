"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, TrendingUp, FileText, Crop, Calculator } from "lucide-react";

// Mock database for the search functionality
const TOOLS_DATABASE = [
  { name: "Word to PDF Converter", link: "/converter/word-to-pdf", category: "Converter" },
  { name: "Passport Photo Maker", link: "/passport-photo", category: "Creator" },
  { name: "Smart Resume Builder", link: "/resume-maker", category: "Career" },
  { name: "Image Resizer", link: "/resize", category: "Editing" },
  { name: "EMI Calculator", link: "/calculators/emi", category: "Finance" },
  { name: "PDF to Excel", link: "/converter/pdf-to-excel", category: "Converter" },
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = TOOLS_DATABASE.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 pt-16 pb-24 lg:pt-24 lg:pb-32 font-sans">
      
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

      {/* Subtle Red/Gray Accents */}
      <div className="absolute -top-40 right-0 w-[800px] h-[800px] rounded-full bg-red-50 dark:bg-red-900/10 blur-[150px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gray-100 dark:bg-slate-900 blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
       

        {/* Editorial Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-[5rem] font-black tracking-tight text-gray-900 dark:text-white leading-[1.05]">
          Master Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 border-b-4 border-blue-600 pb-2 inline-block mt-2">
            Document Workflow.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-8 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-medium leading-relaxed">
          The ultimate verification engine for government forms, job applications, and personal paperwork. Fast, private, and rigorously formatted.
        </p>

        {/* Core Quick Links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#primary-tools"
            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
          >
            Start Processing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white transition-colors"
          >
            Browse Directory
          </Link>
        </div>

        {/* Search Interface */}
        <div className="mt-16 w-full max-w-3xl relative z-20">
          <label htmlFor="tool-search" className="sr-only">Search Document Utilities</label>
          <div className="relative bg-white dark:bg-slate-900 shadow-2xl border border-gray-300 dark:border-slate-700 flex items-center">
            
            <div className="pl-6 pr-4 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-full py-5 flex items-center">
              <Search className="text-red-600 w-5 h-5" />
            </div>

            <input
              id="tool-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50+ tools for resumes, passports, PDFs..."
              className="w-full bg-transparent py-5 px-6 text-lg outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white font-medium"
              aria-controls={searchQuery ? "tool-search-results" : undefined}
              aria-autocomplete="list"
            />
          </div>

          {/* Search Dropdown Results */}
          {searchQuery && (
            <div id="tool-search-results" className="absolute w-full mt-2 bg-white dark:bg-slate-900 shadow-2xl border border-gray-200 dark:border-slate-700 text-left" role="status" aria-live="polite">
              {filteredTools.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                  {filteredTools.map((tool) => (
                    <li key={tool.name}>
                      <Link href={tool.link} className="flex justify-between items-center px-6 py-4 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group">
                        <span className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-600">
                          {tool.name}
                        </span>
                        <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                          {tool.category}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 text-sm font-medium">
                  No utilities found matching "{searchQuery}". Try browsing the directory.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Icons Row */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-slate-800 w-full flex justify-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-6 h-6 text-gray-800 dark:text-gray-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">PDF Engines</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Crop className="w-6 h-6 text-gray-800 dark:text-gray-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Image Edit</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Calculator className="w-6 h-6 text-gray-800 dark:text-gray-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Calculators</span>
          </div>
        </div>

      </div>
    </section>
  );
}