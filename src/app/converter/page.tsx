"use client";

import React from 'react';
import Link from 'next/link';
import { 
  FileText, FileType, FileSpreadsheet, Grid, 
  Presentation, Layout, Image as ImageIcon, FileImage, 
  ShieldCheck, ArrowRight 
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
    <div className="min-h-screen bg-[#f8f9fa] p-6 font-sans text-gray-900 flex flex-col items-center py-20">
      
      {/* Header Section */}
      <div className="text-center space-y-4 mb-16 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex items-center gap-2 bg-green-100/80 text-green-700 px-5 py-2.5 rounded-full text-sm font-extrabold mb-4 shadow-sm border border-green-200">
          <ShieldCheck size={20} /> 100% Secure Client-Side Conversion
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#2a2a35] tracking-tight">
          Every tool you need to work with PDFs.
        </h1>
        <p className="text-[#64748b] text-lg md:text-xl font-medium px-4">
          Convert your files instantly. No data is sent to our servers. Everything happens privately, locally, and securely inside your browser.
        </p>
      </div>

      {/* Grid of Tools */}
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
      
      {/* Footer / Trust Badge */}
      <div className="mt-20 text-center text-gray-400 font-medium text-sm flex flex-col items-center gap-2">
        <p>Built with modern web technologies. Processing happens entirely on your device.</p>
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          All systems operational
        </div>
      </div>

    </div>
  );
}