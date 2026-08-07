"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FileImage,
  FileText,
  RefreshCcw,
  ScanLine,
  Calculator,
  Layout,
  Palette,
  Sparkles,
  Wrench,
  ArrowRight,
  LucideIcon
} from "lucide-react";
import FeatureCard from "./FeatureCard";

// Explicitly define the allowed colors from your FeatureCard component
type CardColor = "indigo" | "violet" | "blue" | "emerald" | "teal" | "amber" | "rose" | "fuchsia";

// Define the interface for your tools to enforce strict typing
interface ToolItem {
  Icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color: CardColor;
}

// Complete list of all tools in your suite with corrected strict colors
const TOOLS: ToolItem[] = [
  {
    Icon: FileText,
    title: "Resume Builder",
    description: "Build polished, structured resumes with clear sections and ATS-friendly editable templates.",
    link: "/resume-maker",
    buttonText: "Build Resume",
    color: "indigo"
  },
  {
    Icon: Palette,
    title: "Studio Pro Editor",
    description: "Transform your images with neural BG removal, local spot healing, color correction, and text layers.",
    link: "/image-edit",
    buttonText: "Edit Image",
    color: "fuchsia" // Changed from purple
  },
  {
    Icon: Layout,
    title: "Presentation Maker",
    description: "Create stunning presentations and export them as native PowerPoint (PPTX) files instantly.",
    link: "/presentation-maker",
    buttonText: "Create Slides",
    color: "violet"
  },
  {
    Icon: FileImage,
    title: "Passport Photo Maker",
    description: "Create passport, visa, and ID photos with standard sizes ready for printing or online applications.",
    link: "/passport-photo",
    buttonText: "Create Photo",
    color: "blue"
  },
  {
    Icon: RefreshCcw,
    title: "File Converters",
    description: "Convert PDF, Word, Excel, PowerPoint, and image files into the format you need securely.",
    link: "/converter",
    buttonText: "Convert Files",
    color: "emerald"
  },
  {
    Icon: Calculator,
    title: "Financial Calculators",
    description: "Use smart financial and math calculators for investments, taxes, loans, and everyday budgeting.",
    link: "/calculators",
    buttonText: "Calculate",
    color: "teal"
  },
  {
    Icon: ScanLine,
    title: "Document Scanner",
    description: "Scan receipts, forms, and papers with automatic cleanup and high-quality PDF export.",
    link: "/scan-document",
    buttonText: "Scan Now",
    color: "amber"
  },
  {
    Icon: Wrench,
    title: "Resize by KB",
    description: "Easily compress and resize images to a target file size for forms or online uploads.",
    link: "/resize",
    buttonText: "Resize Image",
    color: "rose" // Changed from orange
  },
  {
    Icon: Sparkles,
    title: "Signature Resizer",
    description: "Prepare and extract clean signatures for forms, job portals, and official documents.",
    link: "/resize-signature",
    buttonText: "Edit Signature",
    color: "rose" // Changed from pink
  }
];

export default function CreativeSuite() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // We duplicate the array multiple times so the manual scrolling and auto-looping feels infinite
  const scrollItems = [...TOOLS, ...TOOLS, ...TOOLS];

  // Smart Auto-Scroll Engine
  useEffect(() => {
    let animationFrameId: number;
    const container = scrollContainerRef.current;

    const scroll = () => {
      if (container && !isPaused) {
        container.scrollLeft += 1; // Adjust this number to change auto-scroll speed

        // Seamless infinite loop magic:
        // If we've scrolled past one full set of the original items, snap back seamlessly
        const singleSetWidth = container.scrollWidth / 3;
        if (container.scrollLeft >= singleSetWidth) {
          container.scrollLeft -= singleSetWidth;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  return (
    <section
      id="document-tools"
      className="w-full py-24 bg-white overflow-hidden scroll-mt-10"
    >
      <div className="max-w-4xl mx-auto mb-14 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          All the Tools You Need
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Prepare documents, edit photos, build resumes, convert files, and calculate finances with our powerful, completely free suite of browser-based tools.
        </p>
      </div>

      {/* Hide Scrollbar via CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `
      }} />

      {/* Auto-Sliding & Swipeable Container */}
      <div className="relative w-full pb-8">
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar px-6 items-stretch w-full cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {scrollItems.map((tool, index) => (
            <div key={index} className="w-[300px] sm:w-[350px] shrink-0 h-full py-2">
              <div className="h-full transform transition-transform duration-300 hover:-translate-y-2">
                <FeatureCard
                  Icon={tool.Icon}
                  title={tool.title}
                  description={tool.description}
                  link={tool.link}
                  buttonText={tool.buttonText}
                  color={tool.color}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Left & Right fade gradients for a smooth visual edge */}
        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      </div>

      {/* View All Button */}
      <div className="mt-8 text-center px-4">
        <Link 
          href="/tools" 
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 group"
        >
          View All Tools 
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}