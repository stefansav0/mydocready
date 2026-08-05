"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Newspaper } from "lucide-react";

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
    <section className="bg-gray-50 dark:bg-slate-950 py-10 px-4 sm:px-6 min-h-[70vh] font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* NEW HERO BANNER (Based on image_424645.jpg) */}
        <div className="w-full bg-gradient-to-r from-[#1c4ed8] to-[#3730a3] rounded-[24px] py-16 px-6 shadow-xl text-center flex flex-col items-center justify-center mb-10">
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 tracking-wide">
            Everything You Need for Your Documents
          </h1>
          
          <div className="text-white text-base sm:text-lg max-w-3xl flex flex-wrap justify-center items-center gap-x-1.5 gap-y-3 font-medium">
            <span>Create, edit, convert, and manage PDFs, applications,</span>
            <span className="flex items-center gap-1">
              government forms,
            </span>
            <span className="flex items-center gap-1">
              resumes, 
            </span>
            <span className="flex items-center gap-1">
              jobs applications,
            </span>
            <span>and more.</span>
            
            
          </div>
          
        </div>

        {/* SEARCH BAR & DROPDOWN (Positioned below the banner) */}
        <div className="w-full max-w-3xl relative z-20">
          <label htmlFor="tool-search" className="sr-only">Search Document Utilities</label>
          <div className="relative bg-white dark:bg-slate-900 shadow-xl border border-gray-300 dark:border-slate-700 flex items-center rounded-lg overflow-hidden">
            
            <div className="pl-6 pr-4 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-full py-5 flex items-center">
              <Search className="text-blue-600 w-6 h-6" />
            </div>

            <input
              id="tool-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, calculators, pdf converters..."
              className="w-full bg-transparent py-5 px-6 text-lg outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white font-medium"
              aria-controls={searchQuery ? "tool-search-results" : undefined}
              aria-autocomplete="list"
            />
          </div>

          {/* Search Dropdown Results */}
          {searchQuery && (
            <div id="tool-search-results" className="absolute w-full mt-2 bg-white dark:bg-slate-900 shadow-2xl border border-gray-200 dark:border-slate-700 rounded-lg text-left overflow-hidden" role="status" aria-live="polite">
              {filteredTools.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                  {filteredTools.map((tool) => (
                    <li key={tool.name}>
                      <Link href={tool.link} className="flex justify-between items-center px-6 py-4 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group">
                        <span className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600">
                          {tool.name}
                        </span>
                        <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm">
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

      </div>
    </section>
  );
}