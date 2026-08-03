"use client";

import React from 'react';
import Link from 'next/link';
import { 
  FileText, FileType, FileSpreadsheet, Grid, 
  Presentation, Layout, Image as ImageIcon, FileImage, 
  ShieldCheck, ArrowRight, Lock, Zap, CheckCircle2, HelpCircle
} from 'lucide-react';
import ConverterHubSeoContent from "@/components/ConverterHubSeoContent";

export default function ConverterHub() {
  const tools = [
    {
      title: "Word to PDF",
      description: "Convert DOC and DOCX files into PDF documents that preserve formatting for sharing or printing.",
      icon: <FileText size={32} className="text-[#1b64da]" />,
      href: "/converter/word-to-pdf",
      color: "bg-blue-50/50 hover:border-[#1b64da]",
      shadow: "hover:shadow-blue-100"
    },
    {
      title: "PDF to Word",
      description: "Extract text and structure from PDF documents into editable Word files.",
      icon: <FileType size={32} className="text-[#4f46e5]" />,
      href: "/converter/pdf-to-word",
      color: "bg-indigo-50/50 hover:border-[#4f46e5]",
      shadow: "hover:shadow-indigo-100"
    },
    {
      title: "Excel to PDF",
      description: "Turn Excel spreadsheets into printable PDF pages while keeping table layouts intact.",
      icon: <FileSpreadsheet size={32} className="text-[#107c41]" />,
      href: "/converter/excel-to-pdf",
      color: "bg-emerald-50/50 hover:border-[#107c41]",
      shadow: "hover:shadow-emerald-100"
    },
    {
      title: "PDF to Excel",
      description: "Extract tables and numeric data from PDFs into editable Excel spreadsheets.",
      icon: <Grid size={32} className="text-[#107c41]" />,
      href: "/converter/pdf-to-excel",
      color: "bg-green-50/50 hover:border-[#107c41]",
      shadow: "hover:shadow-green-100"
    },
    {
      title: "PowerPoint to PDF",
      description: "Render PPTX slides as a portable PDF file for review, sharing, or printing.",
      icon: <Presentation size={32} className="text-[#d83b01]" />,
      href: "/converter/powerpoint-to-pdf",
      color: "bg-orange-50/50 hover:border-[#d83b01]",
      shadow: "hover:shadow-orange-100"
    },
    {
      title: "PDF to PowerPoint",
      description: "Transform PDF pages into editable PowerPoint slide content with structure preserved.",
      icon: <Layout size={32} className="text-[#d83b01]" />,
      href: "/converter/pdf-to-powerpoint",
      color: "bg-amber-50/50 hover:border-[#d83b01]",
      shadow: "hover:shadow-amber-100"
    },
    {
      title: "JPG to PDF",
      description: "Combine JPG, JPEG, and PNG images into a single PDF file for document submission or storage.",
      icon: <ImageIcon size={32} className="text-[#e5322d]" />,
      href: "/converter/jpg-to-pdf",
      color: "bg-red-50/50 hover:border-[#e5322d]",
      shadow: "hover:shadow-red-100"
    },
    {
      title: "PDF to JPG",
      description: "Save PDF pages as JPG images for easier sharing, previewing, or publishing online.",
      icon: <FileImage size={32} className="text-[#e5322d]" />,
      href: "/converter/pdf-to-jpg",
      color: "bg-rose-50/50 hover:border-[#e5322d]",
      shadow: "hover:shadow-rose-100"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- HERO & GRID SECTION (Tools First) --- */}
      <section className="flex flex-col items-center py-20 px-6">
        <div className="text-center space-y-4 mb-16 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <h1 className="text-4xl md:text-5xl font-black text-[#2a2a35] tracking-tight">
            Document conversion tools for resumes,
            <br className="hidden md:block" /> forms, and application files
          </h1>
          <p className="text-[#64748b] text-lg md:text-xl font-medium px-4 mt-4">
            Transform DOC, PDF, Excel, and image files directly in your browser. Files are processed locally on your device, without requiring a server upload.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full animate-in fade-in duration-700">
          {tools.map((tool, index) => (
            <Link href={tool.href} key={index} className="h-full">
              <div className={`h-full p-8 rounded-3xl border-2 border-transparent bg-white shadow-sm transition-all duration-300 cursor-pointer group flex flex-col ${tool.color} ${tool.shadow} hover:shadow-xl hover:-translate-y-1`}>
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-3 tracking-tight">
                  {tool.title}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                  {tool.description}
                </p>
                <div className="flex items-center text-sm font-black text-gray-800 group-hover:translate-x-2 transition-transform duration-300">
                  Start Converting <ArrowRight size={18} className="ml-2 opacity-70 group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- SEO EDUCATIONAL CONTENT SECTION --- */}
      <section className="bg-white border-t border-gray-200 py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ConverterHubSeoContent />
          <div className="text-center w-full max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              Why Convert Your Documents?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Understanding the fundamental differences between editable document formats (like Word and Excel) and compiled formats (like PDF) is crucial for maintaining a professional digital workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Value Prop 1 */}
            <div>
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Preserve Formatting & Layouts</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Have you ever emailed a perfectly aligned Microsoft Word resume to a recruiter, only for them to open it on a Mac and see broken fonts and scattered margins? This happens because `.docx` files rely on the host computer's installed fonts and software rendering engine.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Converting a file to PDF (Portable Document Format) essentially "bakes" the document. It embeds the fonts, locks the margins, and ensures that the document looks <strong>exactly the same</strong> whether it is opened on a Windows PC, an iPhone, or printed on physical paper.
              </p>
            </div>

            {/* Value Prop 2 */}
            <div>
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Privacy of Client-Side Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Traditional online file converters often require you to upload sensitive documents—such as tax forms, bank statements, or contracts—to a remote server. After upload, the file is processed on that server, which can introduce additional exposure.
              </p>
              <p className="text-gray-600 leading-relaxed">
                MyDocReady uses WebAssembly (Wasm) technology to run conversion routines inside your browser. The service is designed so that files are processed locally on your device, and the platform does not retain stored copies on remote servers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- QUICK FEATURES LIST --- */}
      <section className="bg-gray-900 py-16 text-white border-y border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-4">
              <Zap className="w-10 h-10 text-yellow-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">Fast local conversion</h4>
              <p className="text-gray-400">With no server uploads or queued processing, conversions can complete quickly on your device.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">Free core tools</h4>
              <p className="text-gray-400">Use the main converters without premium paywalls or unexpected watermark restrictions on standard output.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Layout className="w-10 h-10 text-blue-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">High-fidelity output</h4>
              <p className="text-gray-400">Conversions are designed to preserve text clarity and image resolution while keeping file formatting consistent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="bg-gray-50 py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <div className="p-4 bg-white shadow-sm border border-gray-200 rounded-2xl text-indigo-600">
              <HelpCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-500 mt-2 text-lg">Everything you need to know about our document conversion tools.</p>
            </div>
          </div>

          <div className="grid gap-6">
            <FAQItem 
              question="Is there a file size limit for conversions?"
              answer="Because conversion happens locally on your device, the file size limit depends on your computer or mobile device's available RAM. Many modern devices can handle files above 100MB without issue, while smaller devices may have lower limits."
            />
            <FAQItem 
              question="Will extracting a PDF to Word keep my tables and images intact?"
              answer="Yes. Our PDF to Word and PDF to Excel converters utilize structural recognition. Instead of just dumping raw text, the algorithm attempts to map out bounding boxes to rebuild paragraphs, headers, and data tables as accurately as possible in the output .docx or .xlsx file."
            />
            <FAQItem 
              question="Do I need to install any software to use these tools?"
              answer="No. The entire MyDocReady suite is browser-based. Whether you are using Google Chrome, Safari, Firefox, or Edge, our WebAssembly modules run natively without requiring any plugins or desktop software installations."
            />
            <FAQItem 
              question="Can I use this converter on my mobile phone?"
              answer="Yes. The interface is designed to work on modern mobile browsers. You can convert a photo taken on an iPhone into a PDF or change a downloaded Word attachment into a PDF from your phone."
            />
          </div>

        </div>
      </section>

    </div>
  );
}

/* --- ISOLATED COMPONENTS --- */

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{question}</h3>
      <p className="text-base text-gray-600 leading-relaxed m-0">{answer}</p>
    </div>
  );
}