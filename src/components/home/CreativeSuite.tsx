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
  LucideIcon,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

type CardColor =
  | "indigo"
  | "violet"
  | "blue"
  | "emerald"
  | "teal"
  | "amber"
  | "rose"
  | "fuchsia";

interface ToolItem {
  Icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color: CardColor;
}

const TOOLS: ToolItem[] = [
  {
    Icon: FileText,
    title: "Resume Builder",
    description:
      "Create a professional resume with structured sections, clean layouts, and downloadable PDF output.",
    link: "/resume-maker",
    buttonText: "Build Resume",
    color: "indigo",
  },
  {
    Icon: Palette,
    title: "Image Editor",
    description:
      "Edit images with tools for background removal, adjustments, and other common image editing tasks.",
    link: "/image-edit",
    buttonText: "Edit Image",
    color: "fuchsia",
  },
  {
    Icon: Layout,
    title: "Presentation Maker",
    description:
      "Create presentations with editable slides and export them for projects, school, work, or presentations.",
    link: "/presentation-maker",
    buttonText: "Create Slides",
    color: "violet",
  },
  {
    Icon: FileImage,
    title: "Passport Photo Maker",
    description:
      "Create passport, visa, and ID-style photos using customizable image dimensions.",
    link: "/passport-photo",
    buttonText: "Create Photo",
    color: "blue",
  },
  {
    Icon: RefreshCcw,
    title: "File Converters",
    description:
      "Convert supported documents and images into commonly used file formats.",
    link: "/converter",
    buttonText: "Convert Files",
    color: "emerald",
  },
  {
    Icon: Calculator,
    title: "Financial Calculators",
    description:
      "Calculate loans, investments, taxes, and other everyday financial values.",
    link: "/calculators",
    buttonText: "Calculate",
    color: "teal",
  },
  {
    Icon: ScanLine,
    title: "Document Scanner",
    description:
      "Turn documents and receipts into clean digital files for everyday use.",
    link: "/scan-document",
    buttonText: "Scan Document",
    color: "amber",
  },
  {
    Icon: Wrench,
    title: "Resize by KB",
    description:
      "Resize and compress images to a target file size for online uploads and forms.",
    link: "/resize",
    buttonText: "Resize Image",
    color: "rose",
  },
  {
    Icon: Sparkles,
    title: "Signature Resizer",
    description:
      "Resize and prepare signature images for forms, applications, and documents.",
    link: "/resize-signature",
    buttonText: "Edit Signature",
    color: "rose",
  },
];

export default function CreativeSuite() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const container = scrollContainerRef.current;

    const scroll = () => {
      if (container && !isPaused) {
        const maxScroll =
          container.scrollWidth - container.clientWidth;

        if (maxScroll > 0) {
          container.scrollLeft += 0.5;

          if (container.scrollLeft >= maxScroll) {
            container.scrollLeft = 0;
          }
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
      id="more-tools"
      className="w-full py-16 sm:py-24 bg-white overflow-hidden scroll-mt-10"
      aria-labelledby="more-tools-heading"
    >
      <div className="max-w-4xl mx-auto mb-12 sm:mb-14 text-center px-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          More tools
        </p>

        <h2
          id="more-tools-heading"
          className="mt-2 text-3xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight"
        >
          Explore More Tools
        </h2>

        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Explore additional tools for documents, images, PDFs,
          signatures, presentations, and everyday tasks.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }

            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `,
        }}
      />

      <div className="relative w-full pb-8">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar px-6 items-stretch w-full cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {TOOLS.map((tool) => (
            <div
              key={tool.link}
              className="w-[300px] sm:w-[350px] shrink-0 h-full py-2"
            >
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

        <div
          className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        <div
          className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />
      </div>

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