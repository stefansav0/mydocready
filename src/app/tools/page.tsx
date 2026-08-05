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
  ShieldCheck,
} from "lucide-react";

const tools = [
  {
    title: "Passport Photo Maker",
    description: "Create passport-style portraits and prepare simple print layouts for documents.",
    href: "/passport-photo",
    category: "Photo",
    icon: Camera,
  },
  {
    title: "Resume Builder",
    description: "Build polished, structured resumes with clear sections and editable templates.",
    href: "/resume-maker",
    category: "Career",
    icon: FileText,
  },
  {
    title: "Image Editor",
    description: "Crop, adjust, and refine images for document and profile use.",
    href: "/image-edit",
    category: "Photo",
    icon: ImageIcon,
  },
  {
    title: "Insert into Document",
    description: "Place an image into a printable document layout with an easy workflow.",
    href: "/insert-doc",
    category: "Utility",
    icon: FileType,
  },
  {
    title: "Document Scanner",
    description: "Scan receipts, forms, and papers with automatic cleanup and PDF export.",
    href: "/scan-document",
    category: "Documents",
    icon: ScanLine,
  },
  {
    title: "File Converters",
    description: "Convert Word, PDF, Excel, JPG, and PowerPoint files in one place.",
    href: "/converter",
    category: "Documents",
    icon: ScanLine,
  },
  {
    title: "Presentation Maker",
    description: "Create simple presentation slides quickly with clean templates and layouts.",
    href: "/presentation-maker",
    category: "Design",
    icon: Presentation,
  },
  {
    title: "Resize by KB",
    description: "Resize images to a target file size for forms or online uploads.",
    href: "/resize",
    category: "Utility",
    icon: Wrench,
  },
  {
    title: "Signature Resizer",
    description: "Prepare signatures for forms, job portals, and official documents.",
    href: "/resize-signature",
    category: "Documents",
    icon: Sparkles,
  },
  {
    title: "Calculators",
    description: "Use financial and math calculators for planning, estimates, and comparisons.",
    href: "/calculators",
    category: "Planning",
    icon: Calculator,
  },
  {
    title: "EMI Calculator",
    description: "Estimate loan EMI payments with a simple, interactive calculator.",
    href: "/calculators/emi",
    category: "Planning",
    icon: Calculator,
  },
  {
    title: "SIP Calculator",
    description: "Estimate monthly investment growth and long-term savings outcomes.",
    href: "/calculators/sip",
    category: "Planning",
    icon: Calculator,
  },
  {
    title: "FD Calculator",
    description: "Compare fixed deposit growth and maturity values with ease.",
    href: "/calculators/fd",
    category: "Planning",
    icon: Calculator,
  },
  {
    title: "GST Calculator",
    description: "Estimate added tax values quickly for invoices and expense planning.",
    href: "/calculators/gst",
    category: "Planning",
    icon: Calculator,
  },
  {
    title: "Percentage Calculator",
    description: "Calculate percentages and simple rate-based values without extra setup.",
    href: "/calculators/percentage",
    category: "Planning",
    icon: Calculator,
  },
  {
    title: "Split Calculator",
    description: "Split shared expenses fairly across multiple people or budgets.",
    href: "/calculators/split",
    category: "Planning",
    icon: Calculator,
  },
  {
    title: "Tax Calculator",
    description: "Estimate simple tax values for personal planning and budgeting.",
    href: "/calculators/tax",
    category: "Planning",
    icon: Calculator,
  },
  {
    title: "Age Calculator",
    description: "Quickly calculate age values for forms and personal planning.",
    href: "/calculators/age",
    category: "Planning",
    icon: Calculator,
  },
];

const groupedTools = [
  {
    title: "Utilities",
    description: "Helpful helpers for resizing, signing, and formatting.",
    items: tools.filter((tool) => ["Resize by KB", "Signature Resizer"].includes(tool.title)),
  },
  {
    title: "Core tools",
    description: "Popular tools for docs, photos, and daily tasks.",
    items: tools.filter((tool) => ["Passport Photo Maker", "Resume Builder", "Image Editor", "Insert into Document", "File Converters", "Presentation Maker"].includes(tool.title)),
  },
  
  {
    title: "Calculators",
    description: "Planning tools for money, percentages, and simple math.",
    items: tools.filter((tool) => ["Calculators", "EMI Calculator", "SIP Calculator", "FD Calculator", "GST Calculator", "Percentage Calculator", "Split Calculator", "Tax Calculator", "Age Calculator"].includes(tool.title)),
  },
];

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
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          

          <div className="mx-auto max-w-3xl space-y-5 text-center">
            
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              All Tools
            </h1>
            <p className="text-lg leading-8 text-slate-600">
             Access all MyDocReady tools in one place. Create documents, edit PDFs,
resize images, generate passport photos, build resumes, and use
calculators.
            </p>
          </div>

          <div className="flex justify-center w-full">
  <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60">
    <label htmlFor="tools-search" className="sr-only">
      Search tools
    </label>

    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <Search className="h-5 w-5 text-indigo-500" />
      <input
        id="tools-search"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tools by name or category"
        className="w-full border-none bg-transparent text-base outline-none placeholder:text-slate-400"
      />
    </div>
  </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {filteredGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            <p className="text-lg font-semibold text-slate-800">No tools matched your search.</p>
            <p className="mt-2">Try a broader term such as “calculator”, “photo”, or “converter”.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{group.title}</h2>
                  <p className="mt-2 text-slate-600">{group.description}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.title}
                        href={tool.href}
                        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {tool.category}
                          </span>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-slate-900">{tool.title}</h3>
                        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{tool.description}</p>
                        <div className="mt-6 inline-flex items-center gap-2 font-semibold text-indigo-600 transition group-hover:gap-3">
                          Open tool
                          <ArrowRight className="h-4 w-4" />
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

      <section className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            Need something specific? Start from the homepage search and jump straight to the right tool.
          </div>
          <Link href="/" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
            Back to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
