"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Upload, 
  Image as ImageIcon, 
  Camera,
  Users,
  Minimize,
  PenTool,
  CalendarDays,
  Presentation,
  FileText, 
  LucideIcon, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  BookOpen,
  Wand2,
  Briefcase,
  Banknote,
  MonitorPlay,
  RefreshCcw,
  Search,
  Receipt,
  ReceiptText,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Cpu,
  Award,
  Calculator,
  Wrench,
  Smartphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";

// Master list of tools for the search functionality
const TOOL_DIRECTORY = [
  { name: "Resume Builder", link: "/resume-maker", category: "Career" },
  { name: "Passport Photo Maker", link: "/passport-photo", category: "Photo" },
  { name: "Studio Image Editor", link: "/image-edit", category: "Creative" },
  { name: "Resize by KB", link: "/resize", category: "Utility" },
  { name: "Slide Maker", link: "/presentation-maker", category: "Career" },
  { name: "File Converters", link: "/converter", category: "Utility" },
  { name: "Insert into Document", link: "/insert-doc", category: "Utility" },
  { name: "Background Remover", link: "/passport-photo", category: "Photo" },
  { name: "Compress PDF", link: "/converter", category: "Utility" },
  { name: "JPG to PDF", link: "/converter/jpg-to-pdf", category: "Utility" },
  { name: "Calculator", link: "/calculators", category: "Utility" },
  { name: "Emi Calculator", link: "/calculators/emi", category: "Utility" },
  { name: "sip calculator", link: "/calculators/sip", category: "Utility" },
  { name: "FD Calculator", link: "/calculators/fd", category: "Utility" },
  { name: "GST Calculator", link: "/calculators/gst", category: "Utility" },
  { name: "Percentage Converter", link: "/calculators/percentage", category: "Utility" },
  { name: "Split Calculator", link: "/calculators/split", category: "Utility" },
  { name: "Tax Calculator", link: "/calculators/tax", category: "Utility" },
  { name: "Currency Converter", link: "/calculators/currency", category: "Utility" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on user search
  const filteredTools = TOOL_DIRECTORY.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-200 selection:text-indigo-900">
      
      {/* --- HERO SECTION --- */}
<section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 border-b border-slate-100 pt-20 pb-20 lg:pt-28 lg:pb-28">

  {/* Background Grid */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#94a3b810_1px,transparent_1px),linear-gradient(to_bottom,#94a3b810_1px,transparent_1px)] bg-[size:36px_36px]" />

  {/* Blur Decorations */}
  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-indigo-200/40 blur-[120px]" />
  <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-sky-200/30 blur-[120px]" />
  <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-violet-200/30 blur-[140px]" />

  <div className="relative max-w-6xl mx-auto px-6 text-center">

    {/* Small Badge */}
    

    {/* Heading */}
    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">

      Everything You Need

      <br />

      <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
        In One Smart Workspace
      </span>

    </h1>

    {/* Description */}
    <p className="mt-8 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-8">
      Create resumes, edit passport photos, resize signatures, convert PDFs,
      calculate EMI & SIP, build presentations, and use dozens of free online
      tools—all in one secure platform.
    </p>

    {/* Search */}
    <div className="mt-12 w-full max-w-2xl mx-auto relative">

      <div className="relative rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white overflow-hidden">

        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500 w-6 h-6" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 50+ tools (Resume Builder, Passport Photo, EMI Calculator...)"
          className="w-full bg-transparent py-5 pl-16 pr-6 text-lg outline-none placeholder:text-slate-400"
        />

      </div>

      {/* Dropdown */}
      {searchQuery && (
        <div className="absolute w-full mt-3 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50">

          {filteredTools.length > 0 ? (

            <ul className="max-h-80 overflow-y-auto py-2">

              {filteredTools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.link}
                    className="flex justify-between items-center px-6 py-4 hover:bg-indigo-50 transition"
                  >
                    <span className="font-medium text-slate-700">
                      {tool.name}
                    </span>

                    <span className="rounded-full bg-indigo-50 text-indigo-600 px-3 py-1 text-xs font-semibold">
                      {tool.category}
                    </span>

                  </Link>
                </li>
              ))}

            </ul>

          ) : (

            <div className="py-8 text-slate-500">
              No tools found.
            </div>

          )}

        </div>
      )}

    </div>

    {/* CTA */}
    <div className="mt-10">

      <a
        href="#primary-tools"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-white font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all"
      >
        Explore All Tools

        <ArrowRight className="w-5 h-5" />

      </a>

    </div>

    

  </div>

</section>

     {/* --- PREMIUM APP-BOX QUICK LINKS --- */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8 w-full">
  
  {/* Passport Photo */}
  <Link
    href="/passport-photo"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
      <Camera className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      Passport Photo
    </span>
  </Link>

  {/* Resize Photo */}
  <Link
    href="/resize"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-green-200 dark:hover:border-green-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
      <Minimize className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      Resize Image
    </span>
  </Link>

  {/* Resize Signature */}
  <Link
    href="/resize-signature"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
      <PenTool className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      Resize Signature
    </span>
  </Link>

  {/* AGE Calculator */}
  <Link
    href="/calculators/age"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
      <CalendarDays className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      Age Calculator
    </span>
  </Link>

  {/* Resume Builder */}
  <Link
    href="/resume-maker"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-rose-200 dark:hover:border-rose-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
      <Briefcase className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      Resume Builder
    </span>
  </Link>

  {/* Presentation Maker */}
  <Link
    href="/presentation-maker"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-cyan-200 dark:hover:border-cyan-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
      <Presentation className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      Slide Maker
    </span>
  </Link>

  {/* EMI Calculator */}
  <Link
    href="/calculators/emi"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
      <Banknote className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      EMI Calculator
    </span>
  </Link>

  {/* SIP Calculator */}
  <Link
    href="/calculators/sip"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-violet-200 dark:hover:border-violet-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
      <TrendingUp className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      SIP Calculator
    </span>
  </Link>

  {/* Bill Split */}
  <Link
    href="/calculators/split"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
      <Users className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      Bill Splitter
    </span>
  </Link>

  {/* GST Calculator */}
  <Link
    href="/calculators/gst"
    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-sky-200 dark:hover:border-sky-900/50 hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
      <Receipt className="w-6 h-6" />
    </div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
      GST Calculator
    </span>
  </Link>
  
</div>

      {/* --- CATEGORY 1: PRIMARY SUITE --- */}
      <section id="primary-tools" className="max-w-7xl mx-auto px-4 pt-20 pb-10 scroll-mt-10">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Essential Career & Image Tools</h2>
          <p className="text-slate-600 text-lg">Everything you need to land your dream job and prepare official application materials, optimized perfectly for modern standards.</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            Icon={Briefcase}
            title="Professional Resume Builder"
            description="Craft ATS-friendly resumes in minutes with our easy-to-use templates and automated formatting tools."
            link="/resume-maker"
            buttonText="Build My Resume"
            color="emerald"
          />
          <FeatureCard
            Icon={ImageIcon}
            title="Passport Photo Maker"
            description="Instantly crop your photo and change the background to white or blue to meet strict official application guidelines."
            link="/passport-photo"
            buttonText="Create Passport Photo"
            color="violet"
          />
          <FeatureCard
            Icon={Upload}
            title="Resize by Exact KB"
            description="Compress or resize your heavy image files to an exact KB size requirement using smart, lossless optimization."
            link="/resize"
            buttonText="Compress Image"
            color="indigo"
          />
        </div>
      </section>

      {/* --- CATEGORY 2: CREATIVE & DOCUMENT SUITE --- */}
      <section id="document-tools" className="max-w-7xl mx-auto px-4 pt-10 pb-20 scroll-mt-10">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Creative & Document Utilities</h2>
          <p className="text-slate-600 text-lg">Powerful in-browser utilities to design, edit, convert, and finalize your digital paperwork without downloading heavy software.</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            Icon={Wand2}
            title="Studio Image Editor"
            description="A complete browser-based studio. Color grade, apply presets, retouch skin, and use AI magic to perfect your photos."
            link="/image-edit"
            buttonText="Launch Editor"
            color="fuchsia"
          />
          <FeatureCard
            Icon={MonitorPlay}
            title="Slide & Pitch Maker"
            description="Generate beautiful presentation slides and professional pitch decks instantly with our intuitive slide editor."
            link="/presentation-maker"
            buttonText="Create Slides"
            color="amber"
          />
          <FeatureCard
            Icon={RefreshCcw}
            title="Universal Converters"
            description="Seamlessly convert your files between PDF, Word, JPG, and PNG formats without losing any original quality."
            link="/converter"
            buttonText="Convert Files"
            color="rose"
          />
          <FeatureCard
            Icon={FileText}
            title="Insert into Document"
            description="Place your photos securely into a standard A4 PDF layout and download instantly for official physical printing."
            link="/insert-doc"
            buttonText="Format A4 Doc"
            color="blue"
          />
        </div>
      </section>

      {/* ================= TRUST & IMPACT ================= */}
<section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">

  {/* Background Effects */}
  <div className="absolute inset-0">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[140px] rounded-full"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full"></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6">

    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      

      <h2 className="text-4xl md:text-5xl font-black leading-tight">
        Secure, Fast & Reliable
        <span className="block text-indigo-400">
          Document Services
        </span>
      </h2>

      <p className="mt-6 text-lg text-slate-300 leading-relaxed">
        MyDocReady helps users access government services, download official
        documents, convert PDFs, and manage important files with complete
        privacy and ease.
      </p>
    </div>

    {/* Stats */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

  {/* Card */}
  <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">

    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
      <Wrench className="w-8 h-8 text-indigo-400" />
    </div>

    <h3 className="text-5xl font-black text-indigo-400">
      35+
    </h3>

    <p className="mt-3 text-slate-300 font-medium">
      Free Document Tools
    </p>

  </div>

  {/* Card */}
  <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">

    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
      <Sparkles className="w-8 h-8 text-emerald-400" />
    </div>

    <h3 className="text-5xl font-black text-emerald-400">
      Fast
    </h3>

    <p className="mt-3 text-slate-300 font-medium">
      Easy Processing
    </p>

  </div>

  {/* Card */}
  <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">

    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/15 flex items-center justify-center">
      <Smartphone className="w-8 h-8 text-amber-400" />
    </div>

    <h3 className="text-5xl font-black text-amber-400">
      24/7
    </h3>

    <p className="mt-3 text-slate-300 font-medium">
      Online Access
    </p>

  </div>

  {/* Card */}
  <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">

    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/15 flex items-center justify-center">
      <ShieldCheck className="w-8 h-8 text-rose-400" />
    </div>

    <h3 className="text-5xl font-black text-rose-400">
      Secure
    </h3>

    <p className="mt-3 text-slate-300 font-medium">
      Privacy Focused
    </p>

  </div>

</div>
    {/* Bottom Trust Strip */}

    <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-8">

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        <div>

          <h3 className="text-2xl font-bold">
            Why users choose MyDocReady?
          </h3>

          <p className="text-slate-300 mt-2 max-w-2xl">
            Access essential government document services, PDF tools, and
            verification utilities in one place. Built for speed, security,
            and a smooth user experience across desktop and mobile devices.
          </p>

        </div>

        <div className="flex flex-wrap gap-4">

          <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 font-semibold">
            ✓ SSL Secure
          </span>

          <span className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-semibold">
            ✓ Mobile Friendly
          </span>

          <span className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 font-semibold">
            ✓ Fast Processing
          </span>

        </div>

      </div>

    </div>

  </div>

</section>

      {/* ================= EDUCATIONAL CONTENT ================= */}
<section className="bg-gradient-to-b from-slate-50 to-white py-24 border-y border-slate-200">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <div className="max-w-4xl mx-auto text-center mb-20">

      

      <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
        Everything You Need to Manage
        <span className="block text-indigo-600">
          Digital Documents with Confidence
        </span>
      </h2>

      <p className="mt-6 text-xl text-slate-600 leading-relaxed">
        Whether you're applying for a government service, preparing for a job,
        or organizing important documents, understanding the right process can
        save time and help avoid common mistakes.
      </p>

    </div>

    <div className="grid lg:grid-cols-3 gap-10">

      {/* Card 1 */}

      <article className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-10">

        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-8">
          <Briefcase className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-5">
          Create a Professional Resume
        </h3>

        <p className="text-slate-600 leading-8">
          A clear and well-structured resume helps employers quickly understand
          your education, skills, and experience. Keep formatting simple,
          organize information logically, and review your document before
          submitting applications.
        </p>

        <ul className="mt-6 space-y-3 text-slate-700">

          <li>✓ Simple and readable layout</li>
          <li>✓ Clear work experience</li>
          <li>✓ Accurate contact details</li>
          <li>✓ Easy PDF download</li>

        </ul>

      </article>

      {/* Card 2 */}

      <article className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-10">

        <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-8">
          <ImageIcon className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-5">
          Passport & ID Photo Guidelines
        </h3>

        <p className="text-slate-600 leading-8">
          Different government departments and institutions may have specific
          requirements for passport-size photos. Using the correct dimensions,
          background, and file size helps reduce the chance of application
          delays.
        </p>

        <ul className="mt-6 space-y-3 text-slate-700">

          <li>✓ Correct image dimensions</li>
          <li>✓ Clean background</li>
          <li>✓ Optimized file size</li>
          <li>✓ Suitable for online applications</li>

        </ul>

      </article>

      {/* Card 3 */}

      <article className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-10">

        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-8">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-5">
          Privacy & Secure Document Processing
        </h3>

        <p className="text-slate-600 leading-8">
          Personal documents often contain sensitive information. Always use
          trusted tools, avoid sharing confidential files unnecessarily, and
          check privacy policies before uploading important documents online.
        </p>

        <ul className="mt-6 space-y-3 text-slate-700">

          <li>✓ Privacy-focused tools</li>
          <li>✓ Secure processing</li>
          <li>✓ Easy-to-use interface</li>
          <li>✓ Fast document management</li>

        </ul>

      </article>

    </div>

    {/* Bottom Content */}

    <div className="mt-20 rounded-3xl bg-slate-900 text-white p-10 md:p-16">

      <div className="grid lg:grid-cols-2 gap-10 items-center">

        <div>

          <h3 className="text-3xl font-bold mb-6">
            Why Choose MyDocReady?
          </h3>

          <p className="text-slate-300 leading-8">
            MyDocReady brings together document tools, resume creation,
            government service guides, PDF utilities, image tools, and
            educational resources in one convenient platform. Our goal is to
            simplify everyday document-related tasks while providing a smooth
            and user-friendly experience across desktop and mobile devices.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div className="bg-white/10 rounded-2xl p-6">
            <h4 className="text-3xl font-black text-indigo-400">
              35+
            </h4>
            <p className="text-slate-300 mt-2">
              Document Tools
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6">
            <h4 className="text-3xl font-black text-emerald-400">
              Fast
            </h4>
            <p className="text-slate-300 mt-2">
              Easy Processing
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6">
            <h4 className="text-3xl font-black text-amber-400">
              Secure
            </h4>
            <p className="text-slate-300 mt-2">
              Privacy Focused
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6">
            <h4 className="text-3xl font-black text-rose-400">
              24/7
            </h4>
            <p className="text-slate-300 mt-2">
              Online Access
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>
</section>

      {/* --- HELPFUL GUIDES (BLOG) SECTION --- */}
      <section className="bg-white py-24 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <div className="p-4 bg-indigo-50 shadow-sm border border-indigo-100 rounded-2xl text-indigo-600">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Helpful Guides</h2>
              <p className="text-gray-500 mt-2 text-lg">Expert advice to help you master your digital paperwork and applications.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Guide 1 */}
            <Link href="/blog/write-an-ats-resume" className="group flex flex-col bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">How to write an ATS Resume</h3>
              <p className="text-gray-600 leading-relaxed mb-8 flex-1">Get past the robots and secure your interview.</p>
              <div className="flex items-center text-sm font-bold text-indigo-600">
                Read Article <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            {/* Guide 2 */}
            <Link href="/blog/common-mistakes-in-id-photos" className="group flex flex-col bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">Common Mistakes in ID Photos</h3>
              <p className="text-gray-600 leading-relaxed mb-8 flex-1">Learn what to avoid when submitting applications.</p>
              <div className="flex items-center text-sm font-bold text-indigo-600">
                Read Article <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            {/* Guide 3 */}
            <Link href="/blog/resize-photos-by-kb" className="group flex flex-col bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">How to Resize by exact KB</h3>
              <p className="text-gray-600 leading-relaxed mb-8 flex-1">A step-by-step guide to lossless compression.</p>
              <div className="flex items-center text-sm font-bold text-indigo-600">
                Read Article <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/blog" className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              View All Resources <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- EXPANDED FAQ SECTION --- */}
      <section className="bg-slate-50 py-24 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full mb-6">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600 mt-4 max-w-2xl leading-relaxed">
  Find answers to common questions about MyDocReady, including our document tools,
  privacy practices, supported file formats, and how to get the best results from
  our services.
</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <FAQItem
  question="Is MyDocReady free to use?"
  answer="Yes. Many of our document and image tools are available free of charge. Some features may change or expand over time, so we recommend checking individual tool pages for the latest information."
/>
            <FAQItem
  question="Do I need to create an account?"
  answer="Most tools can be used without creating an account. If a feature requires sign-in in the future, it will be clearly indicated before you use it."
/>
            <FAQItem
  question="How does MyDocReady protect my files?"
  answer="We prioritize user privacy and security. Some tools process files directly in your browser, while others may require secure server-side processing depending on the feature. Please refer to our Privacy Policy for complete details."
/>
            <FAQItem
  question="Can I create a professional resume with MyDocReady?"
  answer="Yes. Our Resume Builder helps you create clean, well-structured resumes suitable for online job applications. We recommend tailoring your resume to each job description for the best results."
/>
            <FAQItem
  question="Can I create passport-size photos for different applications?"
  answer="Yes. Our Passport Photo Maker helps you prepare photos suitable for many government services, educational institutions, and job applications. Always verify the exact requirements of the organization before submitting your application."
/>
            <FAQItem
  question="Can I resize images to a specific file size?"
  answer="Yes. Our image tools help you resize and optimize images to meet common size requirements such as 20KB, 50KB, 100KB, or other supported limits while maintaining good visual quality whenever possible."
/>
            <FAQItem
  question="Which file formats are supported?"
  answer="Depending on the selected tool, MyDocReady supports popular formats including PDF, JPG, JPEG, PNG, and other commonly used document and image formats."
/>
            <FAQItem
  question="Can I use MyDocReady on mobile devices?"
  answer="Yes. MyDocReady is fully responsive and works on smartphones, tablets, laptops, and desktop computers using modern web browsers."
/>
            <FAQItem
  question="Which web browsers are supported?"
  answer="For the best experience, we recommend using the latest versions of Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari."
/>
            <FAQItem
  question="How can I contact MyDocReady?"
  answer="If you have questions, suggestions, or experience technical issues, you can contact us through our Contact page. We value user feedback and continually improve our tools based on community suggestions."
/>
          </div>
        </div>
      </section>
      
      {/* --- FOOTER CTA --- */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 py-20">

  <div className="absolute inset-0 opacity-10">
    <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white blur-3xl"></div>
    <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white blur-3xl"></div>
  </div>

  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

    <h2 className="text-4xl md:text-5xl font-black text-white">
      Simplify Your Document Tasks
    </h2>

    <p className="mt-6 text-xl text-indigo-100 leading-relaxed">
      Create resumes, edit PDFs, resize images, prepare passport photos,
      and access useful document tools—all in one place.
    </p>

    <div className="flex flex-wrap justify-center gap-3 mt-8">

      <span className="bg-white/15 border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold">
        ✓ Easy to Use
      </span>

      <span className="bg-white/15 border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold">
        ✓ Mobile Friendly
      </span>

      <span className="bg-white/15 border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold">
        ✓ Privacy Focused
      </span>

      <span className="bg-white/15 border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold">
        ✓ 35+ Helpful Tools
      </span>

    </div>

    <a
      href="#primary-tools"
      className="inline-flex items-center mt-10 bg-white text-indigo-700 font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300"
    >
      Explore Free Tools
    </a>

  </div>

</section>

    </div>
  );
}

/* --- COMPONENTS --- */

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color: "indigo" | "violet" | "blue" | "emerald" | "amber" | "rose" | "teal" | "fuchsia";
}

function FeatureCard({ Icon, title, description, link, buttonText, color }: FeatureCardProps) {
  // Richer color mapping for better UI depth
  const colorStyles = {
    indigo: "bg-indigo-50/50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white border-indigo-100 group-hover:shadow-indigo-200",
    violet: "bg-violet-50/50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white border-violet-100 group-hover:shadow-violet-200",
    fuchsia: "bg-fuchsia-50/50 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white border-fuchsia-100 group-hover:shadow-fuchsia-200",
    blue: "bg-blue-50/50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white border-blue-100 group-hover:shadow-blue-200",
    emerald: "bg-emerald-50/50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white border-emerald-100 group-hover:shadow-emerald-200",
    amber: "bg-amber-50/50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white border-amber-100 group-hover:shadow-amber-200",
    rose: "bg-rose-50/50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white border-rose-100 group-hover:shadow-rose-200",
    teal: "bg-teal-50/50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white border-teal-100 group-hover:shadow-teal-200",
  };

  return (
    <div className="group bg-white border border-slate-200 shadow-sm rounded-3xl p-8 hover:shadow-2xl hover:border-transparent hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-300 ${colorStyles[color]} relative z-10`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{title}</h3>
      <p className="text-base text-slate-500 mb-8 flex-1 leading-relaxed relative z-10">{description}</p>
      <Link
        href={link}
        className="inline-flex justify-center items-center w-full bg-slate-50 text-slate-700 text-sm font-bold border border-slate-200 px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 relative z-10"
      >
        {buttonText}
      </Link>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 h-full flex flex-col text-left">
      <h3 className="text-lg font-bold text-slate-900 mb-3">{question}</h3>
      <p className="text-base text-slate-600 leading-relaxed flex-1">{answer}</p>
    </div>
  );
}