"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Camera,
  FileText,
  Image as ImageIcon,
  Presentation,
  Search,
  Sparkles,
  Wrench,
  BookOpen,
  ScanLine,
  FileType,
} from "lucide-react";

const tools = [
  { title: "Passport Photo Maker", description: "Create passport-style portraits and prepare simple print layouts for documents.", href: "/passport-photo", category: "Photo", icon: Camera },
  { title: "Resume Builder", description: "Build polished, structured resumes with clear sections and editable templates.", href: "/resume-maker", category: "Career", icon: FileText },
  { title: "Image Editor", description: "Crop, adjust, and refine images for document and profile use.", href: "/image-edit", category: "Photo", icon: ImageIcon },
  { title: "Insert into Document", description: "Place an image into a printable document layout with an easy workflow.", href: "/insert-doc", category: "Utility", icon: FileType },
  { title: "Document Scanner", description: "Scan receipts, forms, and papers with automatic cleanup and PDF export.", href: "/scan-document", category: "Documents", icon: ScanLine },
  { title: "File Converters", description: "Convert Word, PDF, Excel, JPG, and PowerPoint files in one place.", href: "/converter", category: "Documents", icon: ScanLine },
  { title: "Presentation Maker", description: "Create simple presentation slides quickly with clean templates and layouts.", href: "/presentation-maker", category: "Design", icon: Presentation },
  { title: "Resize by KB", description: "Resize images to a target file size for forms or online uploads.", href: "/resize", category: "Utility", icon: Wrench },
  { title: "Signature Resizer", description: "Prepare signatures for forms, job portals, and official documents.", href: "/resize-signature", category: "Documents", icon: Sparkles },
  { title: "Calculators", description: "Use financial and math calculators for planning, estimates, and comparisons.", href: "/calculators", category: "Planning", icon: Calculator },
  { title: "EMI Calculator", description: "Estimate loan EMI payments with a simple, interactive calculator.", href: "/calculators/emi", category: "Planning", icon: Calculator },
  { title: "SIP Calculator", description: "Estimate monthly investment growth and long-term savings outcomes.", href: "/calculators/sip", category: "Planning", icon: Calculator },
  { title: "FD Calculator", description: "Compare fixed deposit growth and maturity values with ease.", href: "/calculators/fd", category: "Planning", icon: Calculator },
  { title: "GST Calculator", description: "Estimate added tax values quickly for invoices and expense planning.", href: "/calculators/gst", category: "Planning", icon: Calculator },
  { title: "Percentage Calculator", description: "Calculate percentages and simple rate-based values without extra setup.", href: "/calculators/percentage", category: "Planning", icon: Calculator },
  { title: "Split Calculator", description: "Split shared expenses fairly across multiple people or budgets.", href: "/calculators/split", category: "Planning", icon: Calculator },
  { title: "Tax Calculator", description: "Estimate simple tax values for personal planning and budgeting.", href: "/calculators/tax", category: "Planning", icon: Calculator },
  { title: "Age Calculator", description: "Quickly calculate age values for forms and personal planning.", href: "/calculators/age", category: "Planning", icon: Calculator },
  { title: "Word to PDF", description: "Convert Word documents to PDF format for easy sharing and printing.", href: "/converter/word-to-pdf", category: "Converter", icon: FileText },
  { title: "PDF to Word", description: "Convert PDF files to editable Word documents while preserving formatting.", href: "/converter/pdf-to-word", category: "Converter", icon: FileText },
  { title: "Excel to PDF", description: "Convert Excel spreadsheets to PDF format for easy sharing and printing.", href: "/converter/excel-to-pdf", category: "Converter", icon: FileText },
  { title: "PDF to Excel", description: "Convert PDF files to editable Excel spreadsheets while preserving data structure.", href: "/converter/pdf-to-excel", category: "Converter", icon: FileText },
  { title: "PowerPoint to PDF", description: "Convert PowerPoint presentations to PDF format for easy sharing and printing.", href: "/converter/powerpoint-to-pdf", category: "Converter", icon: FileText },
  { title: "PDF to PowerPoint", description: "Convert PDF files to editable PowerPoint presentations while preserving layout.", href: "/converter/pdf-to-powerpoint", category: "Converter", icon: FileText },
  { title: "JPG to PDF", description: "Convert JPG images to PDF format for easy sharing and printing.", href: "/converter/jpg-to-pdf", category: "Converter", icon: FileText },
  { title: "PDF to JPG", description: "Convert PDF files to JPG images while preserving quality and layout.", href: "/converter/pdf-to-jpg", category: "Converter", icon: FileText },
];

// Dynamically group tools instead of hardcoding names
const groupedTools = [
  {
    title: "Document Utilities",
    description: "Helpful helpers for resizing, signing, scanning, and formatting.",
    items: tools.filter((tool) => ["Utility", "Documents"].includes(tool.category) && !tool.href.includes("/converter/")),
  },
  {
    title: "Core Tools & Editors",
    description: "Popular tools for creating docs, photos, and presentations.",
    items: tools.filter((tool) => ["Photo", "Career", "Design"].includes(tool.category)),
  },
  
  {
    title: "File Converters",
    description: "Convert files between formats for documents, spreadsheets, and images.",
    items: tools.filter((tool) => tool.category === "Converter" || tool.title === "File Converters"),
  },
  {
    title: "Calculators",
    description: "Planning tools for money, percentages, and simple math.",
    items: tools.filter((tool) => tool.category === "Planning"),
  },
];

// Helper to assign a specific color theme based on category
const getCategoryColors = (category: string) => {
  switch (category) {
    case "Photo": return "bg-pink-50 text-pink-600";
    case "Career": return "bg-blue-50 text-blue-600";
    case "Utility": return "bg-slate-100 text-slate-600";
    case "Documents": return "bg-indigo-50 text-indigo-600";
    case "Design": return "bg-orange-50 text-orange-600";
    case "Planning": return "bg-emerald-50 text-emerald-600";
    case "Converter": return "bg-purple-50 text-purple-600";
    default: return "bg-gray-50 text-gray-600";
  }
};

export default function ToolsPage() {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return groupedTools;

    return groupedTools
      .map((group) => ({
        ...group,
        items: group.items.filter((tool) => {
          const haystack = `${tool.title} ${tool.description} ${tool.category}`.toLowerCase();
          return haystack.includes(term);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <main className="min-h-screen bg-[#f4f6fa] font-sans text-gray-900">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight mb-6 leading-[1.15]">
          All Tools
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Access all MyDocReady tools in one place. Create documents, edit PDFs, resize images, generate passport photos, build resumes, and use financial calculators.
        </p>

        {/* Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
          </div>
          <input
            id="tools-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools by name (e.g., 'PDF', 'Resume', 'Tax')..."
            className="block w-full pl-12 pr-4 py-4 rounded-full border-0 ring-1 ring-gray-200 bg-white text-lg shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filteredGroups.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 max-w-2xl mx-auto">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-[#111827]">No tools matched your search.</p>
            <p className="mt-2 text-md">Try a broader term such as "calculator", "photo", or "converter".</p>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#111827]">{group.title}</h2>
                  <p className="mt-2 text-gray-500">{group.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((tool) => {
                    const Icon = tool.icon;
                    const colorStyles = getCategoryColors(tool.category);

                    return (
                      <Link
                        key={tool.title}
                        href={tool.href}
                        className="group bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorStyles} transition-transform duration-300 group-hover:scale-110`}>
                            <Icon className="h-7 w-7" strokeWidth={2} />
                          </div>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                            {tool.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-purple-700 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed pr-2 flex-1">
                          {tool.description}
                        </p>
                        
                        <div className="mt-6 flex items-center font-bold text-sm text-gray-400 group-hover:text-purple-600 transition-colors">
                          Open Tool
                          <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Helper */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Can't find what you need? Browse by category or search above.
          </div>
          <Link href="/" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
            Back to homepage &rarr;
          </Link>
        </div>
      </section>

    </main>
  );
}