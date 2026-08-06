"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FileText, FileType, FileSpreadsheet, Grid, 
  Presentation, Layout, Image as ImageIcon, FileImage, 
  
} from 'lucide-react';
import ConverterHubSeoContent from "@/components/ConverterHubSeoContent";

export default function ConverterHub() {
  const tools = [
    {
      title: "Word to PDF",
      description: "Convert DOC and DOCX files into PDF documents that preserve formatting for sharing or printing.",
      icon: FileText,
      href: "/converter/word-to-pdf",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "PDF to Word",
      description: "Extract text and structure from PDF documents into editable Word files.",
      icon: FileType,
      href: "/converter/pdf-to-word",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Excel to PDF",
      description: "Turn Excel spreadsheets into printable PDF pages while keeping table layouts intact.",
      icon: FileSpreadsheet,
      href: "/converter/excel-to-pdf",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "PDF to Excel",
      description: "Extract tables and numeric data from PDFs into editable Excel spreadsheets.",
      icon: Grid,
      href: "/converter/pdf-to-excel",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "PowerPoint to PDF",
      description: "Render PPTX slides as a portable PDF file for review, sharing, or printing.",
      icon: Presentation,
      href: "/converter/powerpoint-to-pdf",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "PDF to PowerPoint",
      description: "Transform PDF pages into editable PowerPoint slide content with structure preserved.",
      icon: Layout,
      href: "/converter/pdf-to-powerpoint",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "JPG to PDF",
      description: "Combine JPG, JPEG, and PNG images into a single PDF file for document submission or storage.",
      icon: ImageIcon,
      href: "/converter/jpg-to-pdf",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "PDF to JPG",
      description: "Save PDF pages as JPG images for easier sharing, previewing, or publishing online.",
      icon: FileImage,
      href: "/converter/pdf-to-jpg",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fa] font-sans">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-3/5 text-left">
         
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight mb-6 leading-[1.15]">
            Convert Documents. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 border-b-4 border-purple-700 pb-1">
              Fast, Secure, Local
            </span> <br className="hidden md:block" />
            in Seconds.
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-xl leading-relaxed">
            Transform DOC, PDF, Excel, and image files directly in your browser. Files are processed locally on your device, without requiring a server upload, ensuring your data stays private.
          </p>
        </div>
        
        {/* Illustration Area */}
        <div className="flex w-full mt-12 md:mt-0 md:w-2/5 justify-center md:justify-end relative items-center">
           {/* Subtle background glow behind the image */}
           <div className="absolute w-56 h-56 md:w-72 md:h-72 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full opacity-40 blur-3xl -z-10"></div>
           
           {/* Document Converter Image (You can add a convert.png to your public folder) */}
           {/* Fallback to a placeholder div if image is missing, but setup is ready for your image */}
           <Image 
             src="/docu.png" 
             alt="Document Converter Illustration" 
             width={500} 
             height={500} 
             className="object-contain w-64 sm:w-80 md:w-full drop-shadow-xl z-10 hover:scale-105 transition-transform duration-500"
             priority
           />
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-bold text-[#111827] mb-8">File Converters</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link 
                key={index} 
                href={tool.href}
                className="group bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${tool.bgColor} ${tool.color}`}>
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>
                
                {/* Text Content */}
                <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-purple-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed pr-2">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
      
      {/* SEO Content (If you render it visually, place it here, otherwise it stays imported above) */}
      {/* <ConverterHubSeoContent /> */}

    <ConverterHubSeoContent />

     

      

      {/* --- FAQ SECTION --- */}
      <section className="bg-gray-50 py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            
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