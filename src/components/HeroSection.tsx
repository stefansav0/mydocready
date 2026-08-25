"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  FileText,
  ImageIcon,
  Calculator,
  ScanLine,
  FileImage,
  RefreshCcw,
  PenTool,
  Presentation,
  Sparkles,
} from "lucide-react";

interface ToolItem {
  name: string;
  link: string;
  category: string;
  keywords: string[];
  Icon: typeof Search;
}

const TOOLS_DATABASE: ToolItem[] = [
  {
    name: "Word to PDF Converter",
    link: "/converter/word-to-pdf",
    category: "Converter",
    keywords: ["word", "doc", "document", "pdf", "convert"],
    Icon: FileText,
  },
  {
    name: "PDF to Excel",
    link: "/converter/pdf-to-excel",
    category: "Converter",
    keywords: ["pdf", "excel", "xlsx", "spreadsheet", "convert"],
    Icon: RefreshCcw,
  },

  {
    name: "Converter",
    link: "/converter",
    category: "Converter",
    keywords: ["pdf", "excel", "xlsx", "spreadsheet", "convert"],
    Icon: RefreshCcw,
  },
  
  {
    name: "Passport Photo Maker",
    link: "/passport-photo",
    category: "Photo",
    keywords: ["passport", "visa", "id", "photo", "picture"],
    Icon: FileImage,
  },
  {
    name: "Smart Resume Builder",
    link: "/resume-maker",
    category: "Career",
    keywords: ["resume", "cv", "career", "job", "ats"],
    Icon: FileText,
  },
  {
    name: "Image Resizer",
    link: "/resize",
    category: "Image",
    keywords: ["resize", "image", "photo", "compress", "kb", "size"],
    Icon: ImageIcon,
  },
  {
    name: "Resize Signature",
    link: "/resize-signature",
    category: "Image",
    keywords: ["signature", "sign", "resize", "photo", "document"],
    Icon: PenTool,
  },
  {
    name: "Background Remover",
    link: "/bg-remover",
    category: "Image",
    keywords: ["background", "remove", "image", "photo", "transparent"],
    Icon: Sparkles,
  },
  {
    name: "Image Editor",
    link: "/image-edit",
    category: "Image",
    keywords: ["edit", "image", "photo", "editor", "design"],
    Icon: ImageIcon,
  },
  {
    name: "Image to Text",
    link: "/image-to-text",
    category: "OCR",
    keywords: ["image", "text", "ocr", "extract", "scan"],
    Icon: FileText,
  },
  {
    name: "Document Scanner",
    link: "/scan-document",
    category: "Documents",
    keywords: ["scan", "scanner", "document", "pdf", "receipt"],
    Icon: ScanLine,
  },
  {
    name: "ID Card Scanner",
    link: "/id-card-scan",
    category: "Documents",
    keywords: ["id", "card", "scan", "scanner", "document"],
    Icon: ScanLine,
  },
  {
    name: "Presentation Maker",
    link: "/presentation-maker",
    category: "Productivity",
    keywords: ["presentation", "ppt", "pptx", "slides", "powerpoint"],
    Icon: Presentation,
  },
  {
    name: "EMI Calculator",
    link: "/calculators/emi",
    category: "Finance",
    keywords: ["emi", "loan", "interest", "finance", "calculator"],
    Icon: Calculator,
  },
  {
    name: "SIP Calculator",
    link: "/calculators/sip",
    category: "Finance",
    keywords: ["sip", "investment", "mutual fund", "finance", "calculator"],
    Icon: Calculator,
  },
  {
    name: "Age Calculator",
    link: "/calculators/age",
    category: "Calculator",
    keywords: ["age", "date", "birthday", "calculator"],
    Icon: Calculator,
  },
  {
    name: "Bill Splitter",
    link: "/calculators/split",
    category: "Calculator",
    keywords: ["bill", "split", "expense", "people", "calculator"],
    Icon: Calculator,
  },
  {
    name: "GST Calculator",
    link: "/calculators/gst",
    category: "Finance",
    keywords: ["gst", "tax", "invoice", "finance", "calculator"],
    Icon: Calculator,
  },
  {
    name: "Typing Test",
    link: "/typing-test",
    category: "Productivity",
    keywords: ["typing", "speed", "wpm", "accuracy", "test"],
    Icon: PenTool,
  },
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return TOOLS_DATABASE.filter((tool) => {
      const searchableText = [
        tool.name,
        tool.category,
        ...tool.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    }).slice(0, 8);
  }, [searchQuery]);

  const showResults = searchQuery.trim().length > 0;

  return (
    <section
      className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:py-16"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        {/* HERO BANNER */}
        <div className="w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 px-6 py-14 text-center shadow-xl sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              Simple tools for everyday tasks
            </p>

            <h1
              id="hero-heading"
              className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Everything You Need for Your Documents
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-blue-50 sm:text-lg sm:leading-8">
              Create, edit, convert, and manage documents, PDFs, images,
              resumes, photos, and everyday digital files with simple online
              tools.
            </p>

            {/* Quick CTA */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/tools"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
              >
                Explore All Tools
                <ArrowRight
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/calculators"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
              >
                Browse Calculators
              </Link>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative z-30 -mt-6 w-full max-w-3xl sm:-mt-7">
          <label
            htmlFor="tool-search"
            className="sr-only"
          >
            Search MyDocReady tools
          </label>

          <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-shadow focus-within:shadow-2xl">
            <div
              className="flex shrink-0 items-center border-r border-slate-200 bg-slate-50 px-4 sm:px-5"
              aria-hidden="true"
            >
              <Search className="h-5 w-5 text-indigo-600 sm:h-6 sm:w-6" />
            </div>

            <input
              id="tool-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tools, calculators, converters..."
              autoComplete="off"
              spellCheck={false}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showResults}
              aria-controls={
                showResults ? "tool-search-results" : undefined
              }
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:px-5 sm:py-5 sm:text-lg"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mr-2 shrink-0 rounded-lg px-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          {/* SEARCH RESULTS */}
          {showResults && (
            <div
              id="tool-search-results"
              role="listbox"
              aria-label="Tool search results"
              className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              {filteredTools.length > 0 ? (
                <ul className="max-h-[28rem] overflow-y-auto py-2">
                  {filteredTools.map((tool) => {
                    const Icon = tool.Icon;

                    return (
                      <li
                        key={tool.link}
                        role="option"
                      >
                        <Link
                          href={tool.link}
                          onClick={() => setSearchQuery("")}
                          className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:outline-none sm:px-5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                            <Icon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-800 group-hover:text-indigo-700">
                              {tool.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {tool.category}
                            </p>
                          </div>

                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div
                  className="px-6 py-8 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <Search
                    className="mx-auto h-8 w-8 text-slate-300"
                    aria-hidden="true"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No tools found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try searching for a PDF, image, resume, calculator, or
                    document tool.
                  </p>

                  <Link
                    href="/tools"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Browse all tools
                    <ArrowRight
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SMALL SUPPORTING TEXT */}
        <p className="mt-5 text-center text-xs text-slate-500 sm:text-sm">
          Search by tool name, category, or task
        </p>
      </div>
    </section>
  );
}