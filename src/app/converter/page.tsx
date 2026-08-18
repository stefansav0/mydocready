"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  FileType,
  FileSpreadsheet,
  Grid,
  Presentation,
  Layout,
  Image as ImageIcon,
  FileImage,
} from "lucide-react";

import ConverterHubSeoContent from "@/components/ConverterHubSeoContent";

const tools = [
  {
    title: "Word to PDF",
    description:
      "Convert DOC and DOCX files into PDF documents while preserving formatting for sharing, printing, or storage.",
    icon: FileText,
    href: "/converter/word-to-pdf",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "PDF to Word",
    description:
      "Convert PDF documents into editable Word files for easier text editing and document management.",
    icon: FileType,
    href: "/converter/pdf-to-word",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Excel to PDF",
    description:
      "Convert Excel spreadsheets into PDF documents for easier sharing, printing, and submission.",
    icon: FileSpreadsheet,
    href: "/converter/excel-to-pdf",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "PDF to Excel",
    description:
      "Convert PDF tables and data into editable Excel spreadsheets for further analysis and editing.",
    icon: Grid,
    href: "/converter/pdf-to-excel",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "PowerPoint to PDF",
    description:
      "Convert PowerPoint presentations into PDF files for convenient sharing, viewing, and printing.",
    icon: Presentation,
    href: "/converter/powerpoint-to-pdf",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "PDF to PowerPoint",
    description:
      "Convert PDF pages into PowerPoint presentations for editing and presentation workflows.",
    icon: Layout,
    href: "/converter/pdf-to-powerpoint",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "JPG to PDF",
    description:
      "Convert JPG, JPEG, and PNG images into PDF files for document submission, sharing, and storage.",
    icon: ImageIcon,
    href: "/converter/jpg-to-pdf",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "PDF to JPG",
    description:
      "Convert PDF pages into JPG images for easier sharing, previews, and image-based workflows.",
    icon: FileImage,
    href: "/converter/pdf-to-jpg",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

const faqs = [
  {
    question: "Is there a file size limit for conversions?",
    answer:
      "The supported file size depends on the specific converter and the resources available on your device. Large files may require more memory and processing time, especially when working with complex documents.",
  },
  {
    question: "Will PDF to Word keep my tables and images intact?",
    answer:
      "The converter attempts to preserve the structure of the original PDF, including text, tables, and images. However, the final result can vary depending on the PDF's layout, fonts, scanned content, and overall complexity.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No. MyDocReady's converter tools are designed to work through your web browser, so you can use them without installing traditional desktop conversion software.",
  },
  {
    question: "Can I use the converters on my mobile phone?",
    answer:
      "Yes. The converter pages are designed to work on modern mobile browsers as well as desktop and tablet devices. Your available device memory and browser capabilities can affect processing performance.",
  },
];

export default function ConverterHub() {
  return (
    <div className="min-h-screen bg-[#f4f6fa] font-sans">
      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 pb-16 pt-16 sm:px-6 lg:flex-row lg:px-8 lg:pt-24">
        {/* Hero Content */}
        <div className="w-full text-left lg:w-3/5">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            Online Document Converters
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            Convert Documents.
            <br className="hidden md:block" />

            <span className="mt-2 inline-block border-b-4 border-purple-700 bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text pb-1 text-transparent">
              Fast, Simple & Secure
            </span>

            <br className="hidden md:block" />

            in Seconds.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
            Convert Word, PDF, Excel, PowerPoint, and image files using
            convenient online document tools. Choose a converter below to get
            started.
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="relative mt-12 flex w-full items-center justify-center lg:mt-0 lg:w-2/5 lg:justify-end">
          {/* Background Glow */}
          <div
            aria-hidden="true"
            className="absolute h-56 w-56 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-200 opacity-40 blur-3xl sm:h-72 sm:w-72"
          />

          <Image
            src="/docu.png"
            alt="Document conversion illustration"
            width={500}
            height={500}
            priority
            className="relative z-10 h-auto w-64 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105 sm:w-80 lg:w-full"
          />
        </div>
      </section>

      {/* =========================
          CONVERTER GRID
      ========================== */}
      <section
        aria-labelledby="converter-tools-heading"
        className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <h2
            id="converter-tools-heading"
            className="text-2xl font-bold text-[#111827] sm:text-3xl"
          >
            File Converters
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Select a converter to transform your documents into the format you
            need.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.href}
                href={tool.href}
                aria-label={`Open ${tool.title} converter`}
                className="group flex h-full flex-col rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {/* Icon */}
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${tool.bgColor} ${tool.color} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    className="h-7 w-7"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-xl font-bold text-[#111827] transition-colors group-hover:text-purple-700">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="flex-1 pr-2 text-sm leading-relaxed text-gray-500">
                  {tool.description}
                </p>

                {/* CTA */}
                <div className="mt-5 text-sm font-semibold text-indigo-600">
                  Use Converter →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================
          SEO CONTENT
      ========================== */}
      <ConverterHubSeoContent />

      {/* =========================
          FAQ SECTION
      ========================== */}
      <section
        aria-labelledby="converter-faq-heading"
        className="bg-gray-50 py-20 sm:py-24"
      >
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* FAQ Heading */}
          <div className="mb-12 flex flex-col items-center gap-4 text-center sm:mb-16">
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              FAQ
            </span>

            <div>
              <h2
                id="converter-faq-heading"
                className="text-3xl font-black text-gray-900 sm:text-4xl"
              >
                Frequently Asked Questions
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
                Everything you need to know about MyDocReady document
                conversion tools.
              </p>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="grid gap-5">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   FAQ ITEM
========================= */

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md sm:p-8">
      <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl">
        {question}
      </h3>

      <p className="m-0 text-base leading-7 text-gray-600">{answer}</p>
    </article>
  );
}