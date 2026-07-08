"use client";

import React from 'react';
import Link from 'next/link';
import { 
  FileText, FileType, FileSpreadsheet, Grid, 
  Presentation, Layout, Image as ImageIcon, FileImage, 
  ShieldCheck, ArrowRight, Lock, Zap, CheckCircle2, HelpCircle
} from 'lucide-react';

export default function ConverterHub() {
  const tools = [
    {
      title: "Word to PDF",
      description: "Convert your DOC and DOCX files to secure, uneditable PDF documents.",
      icon: <FileText size={32} className="text-[#1b64da]" />,
      href: "/converter/word-to-pdf",
      color: "bg-blue-50/50 hover:border-[#1b64da]",
      shadow: "hover:shadow-blue-100"
    },
    {
      title: "PDF to Word",
      description: "Extract text from your PDF and turn it into an editable Word document.",
      icon: <FileType size={32} className="text-[#4f46e5]" />,
      href: "/converter/pdf-to-word",
      color: "bg-indigo-50/50 hover:border-[#4f46e5]",
      shadow: "hover:shadow-indigo-100"
    },
    {
      title: "Excel to PDF",
      description: "Make Excel spreadsheets easy to read by converting them to PDF documents.",
      icon: <FileSpreadsheet size={32} className="text-[#107c41]" />,
      href: "/converter/excel-to-pdf",
      color: "bg-emerald-50/50 hover:border-[#107c41]",
      shadow: "hover:shadow-emerald-100"
    },
    {
      title: "PDF to Excel",
      description: "Extract tables from PDF documents directly into clean, editable Excel spreadsheets.",
      icon: <Grid size={32} className="text-[#107c41]" />,
      href: "/converter/pdf-to-excel",
      color: "bg-green-50/50 hover:border-[#107c41]",
      shadow: "hover:shadow-green-100"
    },
    {
      title: "PowerPoint to PDF",
      description: "Convert your PPTX presentations to PDF format for easy sharing and viewing.",
      icon: <Presentation size={32} className="text-[#d83b01]" />,
      href: "/converter/powerpoint-to-pdf",
      color: "bg-orange-50/50 hover:border-[#d83b01]",
      shadow: "hover:shadow-orange-100"
    },
    {
      title: "PDF to PowerPoint",
      description: "Convert your PDF documents into structured, easy-to-edit PowerPoint slides.",
      icon: <Layout size={32} className="text-[#d83b01]" />,
      href: "/converter/pdf-to-powerpoint",
      color: "bg-amber-50/50 hover:border-[#d83b01]",
      shadow: "hover:shadow-amber-100"
    },
    {
      title: "JPG to PDF",
      description: "Convert and merge multiple JPG, JPEG, and PNG images into a single PDF.",
      icon: <ImageIcon size={32} className="text-[#e5322d]" />,
      href: "/converter/jpg-to-pdf",
      color: "bg-red-50/50 hover:border-[#e5322d]",
      shadow: "hover:shadow-red-100"
    },
    {
      title: "PDF to JPG",
      description: "Extract pages from your PDF and convert them into high-quality JPGs.",
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
        <div className="text-center space-y-4 mb-16 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 bg-green-100/80 text-green-700 px-5 py-2.5 rounded-full text-sm font-extrabold mb-4 shadow-sm border border-green-200">
            <ShieldCheck size={20} /> 100% Secure Client-Side Conversion
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#2a2a35] tracking-tight">
            The Ultimate Universal <br className="hidden md:block" /> Document Converter
          </h1>
          <p className="text-[#64748b] text-lg md:text-xl font-medium px-4 mt-4">
            Convert your files instantly. No data is sent to our servers. Everything happens privately, locally, and securely inside your web browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1400px] w-full animate-in fade-in duration-700">
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
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
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
                Traditional online file converters force you to upload your sensitive files (like tax returns, bank statements, or legal contracts) to a remote cloud server. Once uploaded, your data is processed on their hardware, leaving you vulnerable to data breaches or unauthorized data harvesting.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>MyDocReady changes the paradigm.</strong> We utilize advanced WebAssembly (Wasm) technology to run the conversion algorithms directly inside your web browser. Your files never leave your computer's RAM. We have no databases holding your files, guaranteeing absolute zero-trust privacy.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- QUICK FEATURES LIST --- */}
      <section className="bg-gray-900 py-16 text-white border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-4">
              <Zap className="w-10 h-10 text-yellow-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">Lightning Fast</h4>
              <p className="text-gray-400">Because there are no server uploads or download queues, conversions happen almost instantly on your local CPU.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">100% Free Forever</h4>
              <p className="text-gray-400">No premium paywalls, no daily file limits, and absolutely no watermarks placed on your final documents.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Layout className="w-10 h-10 text-blue-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">Lossless Quality</h4>
              <p className="text-gray-400">Our converters use high-fidelity algorithms to ensure text remains crisp and images retain their original DPI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          
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
              answer="Because the conversion happens locally on your device, the file size limit is dictated entirely by your computer or smartphone's available RAM. Modern devices can easily handle converting files upwards of 100MB instantly."
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
              answer="Absolutely. Our architecture is highly responsive. You can easily convert a photo taken on your iPhone into a PDF, or transform a downloaded email attachment from Word to PDF right from your mobile browser."
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