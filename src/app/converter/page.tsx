"use client";

import React from 'react';
import Link from 'next/link';
import { FileText, Image as ImageIcon, FileImage, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ConverterHub() {
  const tools = [
    {
      title: "Word to PDF",
      description: "Convert your DOCX files to secure, uneditable PDF documents.",
      icon: <FileText size={32} className="text-blue-500" />,
      href: "/converter/word-to-pdf",
      color: "bg-blue-50 hover:border-blue-300"
    },
    {
      title: "Image to PDF",
      description: "Combine JPG, PNG, or WebP images into a single PDF document.",
      icon: <ImageIcon size={32} className="text-purple-500" />,
      href: "/converter/image-to-pdf",
      color: "bg-purple-50 hover:border-purple-300"
    },
    {
      title: "PDF to JPG",
      description: "Extract pages from your PDF and convert them into high-quality JPGs.",
      icon: <FileImage size={32} className="text-orange-500" />,
      href: "/converter/pdf-to-jpg",
      color: "bg-orange-50 hover:border-orange-300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900 flex flex-col items-center py-20">
      
      <div className="text-center space-y-4 mb-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-sm border border-green-200">
          <ShieldCheck size={18} /> 100% Secure Client-Side Conversion
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Document Converters</h1>
        <p className="text-gray-500 text-lg">
          Convert your files instantly. No data is sent to our servers. Everything happens privately inside your browser.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {tools.map((tool, index) => (
          <Link href={tool.href} key={index}>
            <div className={`p-8 rounded-3xl border-2 border-transparent bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer group ${tool.color}`}>
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{tool.title}</h2>
              <p className="text-gray-500 mb-6">{tool.description}</p>
              <div className="flex items-center text-sm font-bold text-gray-800 group-hover:translate-x-2 transition-transform">
                Start Converting <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}