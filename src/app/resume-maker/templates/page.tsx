"use client";

import Link from "next/link";
import { FileText, CheckCircle2, ArrowRight, LayoutTemplate, Edit3, Download, HelpCircle } from "lucide-react";

// ============================================
// CONFIGURATION: FULL TEMPLATE DETAILS
// ============================================
const TEMPLATES = [
  {
    id: "sidebar-pro",
    title: "Two-Column Sidebar Pro",
    path: "/resume-maker/sidebar-pro", 
    variant: "sidebar",
    description: "A clean, modern two-column layout. Perfect for highlighting skills and keeping contact info visible on the left.",
    tags: ["ATS-Friendly", "Professional"]
  },
  {
    id: "classic-minimal",
    title: "Classic Minimalist",
    path: "/resume-maker/classic-minimal",
    variant: "minimal",
    description: "Traditional, single-column design. Highly readable and preferred by standard corporate recruiters.",
    tags: ["Classic", "Simple"]
  },
  {
    id: "right-executive",
    title: "Right-Sidebar Executive",
    path: "/resume-maker/right-executive",
    variant: "executive",
    description: "Focuses on experience on the left, with a distinct right sidebar for technical expertise and skills.",
    tags: ["Executive", "Modern"]
  },
  {
    id: "horizontal-grid",
    title: "Horizontal Row Grid",
    path: "/resume-maker/horizontal-grid",
    variant: "row-grid",
    description: "A structured, row-based approach that neatly sections out different parts of your career horizontally.",
    tags: ["Structured", "Clean"]
  },
  {
    id: "typographic-split",
    title: "Typographic Editorial",
    path: "/resume-maker/typographic-split",
    variant: "editorial",
    description: "An elegant, typography-driven layout with a wide left column. Great for writers, marketers, and analysts.",
    tags: ["Elegant", "Creative"]
  },
  {
    id: "timeline-portfolio",
    title: "Timeline Portfolio",
    path: "/resume-maker/timeline-portfolio",
    variant: "timeline",
    description: "Features a beautiful connected vertical timeline. Excellent for designers, managers, and product leads.",
    tags: ["Visual", "Timeline"]
  }
];

export default function HomeTemplatePicker() {
  return (
    <div className="min-h-screen bg-[#f4f6fa] text-gray-900 font-sans flex flex-col">
      
      {/* HERO SECTION */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <p className="text-indigo-600 font-medium text-sm italic mb-4">
          100% FREE to use!
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight mb-6 leading-[1.15]">
          Build Your Perfect Resume. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 border-b-4 border-indigo-600 pb-1">
            Select a Template
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Choose from our collection of professional, ATS-friendly layouts. You can easily customize sections, add your experience, and download a print-ready PDF in minutes.
        </p>
      </section>

      {/* TEMPLATE PICKER GRID */}
      <main className="max-w-[1200px] w-full mx-auto px-6 pb-24 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col group p-2">
              
              {/* MINIATURE REALISTIC FULL-PAGE PREVIEWS */}
              <div className="w-full h-[320px] bg-slate-50 rounded-t-[1.5rem] rounded-b-xl flex items-center justify-center p-6 border border-gray-100 relative overflow-hidden">
                
                {/* The "A4 Paper" wrapper fully populated */}
                <div className="w-[180px] h-[254px] bg-white shadow-md overflow-hidden relative pointer-events-none border border-slate-200 transition-transform duration-500 group-hover:scale-105">
                  
                  {/* 1. Sidebar Pro Realistic Preview */}
                  {tmpl.variant === "sidebar" && (
                    <div className="flex h-full w-full">
                      <div className="w-[35%] bg-[#d9dfe7] h-full flex flex-col items-center pt-5 px-3">
                        <div className="w-10 h-10 rounded-full bg-slate-400 border-[1.5px] border-white mb-3 shadow-sm"></div>
                        <div className="w-full flex flex-col gap-1 text-left">
                          <span className="text-[4px] font-bold text-slate-700 uppercase">Contact</span>
                          <div className="w-full h-0.5 bg-slate-400 rounded"></div>
                          <div className="w-4/5 h-0.5 bg-slate-400 rounded mb-2"></div>
                          <span className="text-[4px] font-bold text-slate-700 uppercase">Skills</span>
                          <div className="w-full h-0.5 bg-slate-400 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-400 rounded"></div>
                          <div className="w-5/6 h-0.5 bg-slate-400 rounded mb-2"></div>
                          <span className="text-[4px] font-bold text-slate-700 uppercase">Education</span>
                          <div className="w-full h-0.5 bg-slate-400 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-400 rounded mb-1"></div>
                          <div className="w-3/4 h-0.5 bg-slate-400 rounded"></div>
                        </div>
                      </div>
                      <div className="w-[65%] p-4 flex flex-col">
                        <h2 className="text-[10px] font-black text-slate-800 uppercase leading-none mb-1">RAVI KUMAR</h2>
                        <span className="text-[4px] text-slate-500 mb-3">ravi@email.com • New Delhi, IN</span>
                        
                        <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5 mb-1.5">Profile</span>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-0.5"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-0.5"></div>
                        <div className="w-5/6 h-0.5 bg-slate-200 rounded mb-3"></div>
                        
                        <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5 mb-1.5">Experience</span>
                        <div className="w-1/2 h-1 bg-slate-300 rounded mb-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-0.5"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-2"></div>
                        <div className="w-2/3 h-1 bg-slate-300 rounded mb-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-0.5"></div>
                        <div className="w-4/5 h-0.5 bg-slate-200 rounded mb-3"></div>

                        <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5 mb-1.5">Projects</span>
                        <div className="w-3/4 h-1 bg-slate-300 rounded mb-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-0.5"></div>
                      </div>
                    </div>
                  )}

                  {/* 2. Classic Minimal Realistic Preview */}
                  {tmpl.variant === "minimal" && (
                    <div className="flex flex-col h-full w-full p-5">
                      <div className="text-center w-full mb-2">
                        <h2 className="text-[12px] font-black text-slate-900 uppercase leading-none mb-1">ANOOP SINGH</h2>
                        <p className="text-[4px] text-slate-600">anoop@email.com • +91 00000 00000 • Gurugram, IN</p>
                      </div>
                      <div className="w-full border-t border-slate-800 mb-2"></div>
                      <div className="flex flex-1 gap-3">
                        <div className="w-1/3 h-full border-r border-slate-300 pr-2 flex flex-col gap-1.5">
                          <span className="text-[4px] font-bold text-slate-800 uppercase border-b border-slate-800 pb-0.5 mb-0.5">Profile</span>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-1"></div>
                          <span className="text-[4px] font-bold text-slate-800 uppercase border-b border-slate-800 pb-0.5 mb-0.5">Skills</span>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-5/6 h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-1"></div>
                          <span className="text-[4px] font-bold text-slate-800 uppercase border-b border-slate-800 pb-0.5 mb-0.5">Education</span>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-0.5"></div>
                          <div className="w-3/4 h-0.5 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-2/3 h-full flex flex-col gap-1.5 pl-1">
                          <span className="text-[4px] font-bold text-slate-800 uppercase border-b border-slate-800 pb-0.5 mb-0.5">Experience</span>
                          <div className="w-2/3 h-1 bg-slate-300 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-1"></div>
                          
                          <div className="w-1/2 h-1 bg-slate-300 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-1"></div>

                          <span className="text-[4px] font-bold text-slate-800 uppercase border-b border-slate-800 pb-0.5 mb-0.5 mt-1">Projects</span>
                          <div className="w-1/2 h-1 bg-slate-300 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Right Executive Realistic Preview */}
                  {tmpl.variant === "executive" && (
                    <div className="flex flex-col h-full w-full">
                      <div className="w-full bg-slate-900 px-5 py-4 flex flex-col justify-center">
                        <h2 className="text-[12px] font-black text-white uppercase leading-none mb-1">PRIYA SHARMA</h2>
                        <p className="text-[4px] text-sky-400 font-bold uppercase">Software Engineer</p>
                      </div>
                      <div className="w-full h-[2px] bg-sky-500"></div>
                      <div className="flex flex-1">
                        <div className="w-[60%] h-full p-4 flex flex-col gap-2">
                          <span className="text-[5px] font-bold text-sky-600 uppercase border-b border-slate-200 pb-0.5">Experience</span>
                          <div className="w-2/3 h-1 bg-slate-300 rounded mb-0.5 mt-1"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-5/6 h-0.5 bg-slate-200 rounded mb-2"></div>
                          
                          <div className="w-1/2 h-1 bg-slate-300 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-4/5 h-0.5 bg-slate-200 rounded mb-2"></div>

                          <span className="text-[5px] font-bold text-sky-600 uppercase border-b border-slate-200 pb-0.5">Education</span>
                          <div className="w-3/4 h-1 bg-slate-300 rounded mb-0.5 mt-1"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-[40%] h-full bg-slate-50 border-l border-slate-200 p-3 flex flex-col gap-2">
                          <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5">Expertise</span>
                          <div className="w-full h-0.5 bg-slate-300 rounded mt-1"></div>
                          <div className="w-3/4 h-0.5 bg-slate-300 rounded mb-2"></div>

                          <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5">Certifications</span>
                          <div className="w-full h-0.5 bg-slate-300 rounded mt-1"></div>
                          <div className="w-5/6 h-0.5 bg-slate-300 rounded mb-2"></div>

                          <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5">Languages</span>
                          <div className="w-2/3 h-0.5 bg-slate-300 rounded mt-1"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Horizontal Grid Realistic Preview */}
                  {tmpl.variant === "row-grid" && (
                    <div className="flex flex-col h-full w-full p-4 gap-1.5">
                      <div className="w-full mb-1">
                        <h2 className="text-[12px] font-black text-slate-900 uppercase leading-none mb-1">ROHAN MEHTA</h2>
                        <p className="text-[4px] text-teal-600 font-bold uppercase">Product Manager</p>
                      </div>
                      <div className="w-full flex border-t border-slate-200 pt-1.5">
                        <div className="w-[25%] text-[4.5px] font-bold text-slate-800 uppercase mt-0.5">Profile</div>
                        <div className="w-[75%] flex flex-col gap-0.5 ml-2 mt-0.5">
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-5/6 h-0.5 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                      <div className="w-full flex border-t border-slate-200 pt-1.5">
                        <div className="w-[25%] text-[4.5px] font-bold text-slate-800 uppercase mt-0.5">Experience</div>
                        <div className="w-[75%] flex flex-col gap-0.5 ml-2 mt-0.5">
                          <div className="w-2/3 h-1 bg-slate-400 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-1"></div>
                          <div className="w-2/3 h-1 bg-slate-400 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                      <div className="w-full flex border-t border-slate-200 pt-1.5">
                        <div className="w-[25%] text-[4.5px] font-bold text-slate-800 uppercase mt-0.5">Education</div>
                        <div className="w-[75%] flex flex-col gap-0.5 ml-2 mt-0.5">
                          <div className="w-3/4 h-1 bg-slate-400 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                      <div className="w-full flex border-t border-slate-200 pt-1.5">
                        <div className="w-[25%] text-[4.5px] font-bold text-slate-800 uppercase mt-0.5">Skills</div>
                        <div className="w-[75%] flex flex-col gap-0.5 ml-2 mt-0.5">
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Typographic Editorial Realistic Preview */}
                  {tmpl.variant === "editorial" && (
                    <div className="flex flex-col h-full w-full p-5">
                      <div className="w-full flex justify-between items-end mb-2">
                        <h2 className="text-[12px] font-light text-slate-900 uppercase leading-none">KABIR MALHOTRA</h2>
                        <p className="text-[4px] text-slate-500 text-right leading-tight">kabir@email.com<br/>Mumbai, India</p>
                      </div>
                      <div className="w-full h-[1.5px] bg-indigo-700 mb-3"></div>
                      <div className="flex flex-1 gap-4">
                        <div className="w-[60%] h-full flex flex-col gap-2">
                          <span className="text-[5px] font-bold text-indigo-700 uppercase border-b border-slate-200 pb-0.5">Experience</span>
                          <div className="w-2/3 h-1 bg-slate-800 rounded mb-0.5 mt-1"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-2"></div>
                          
                          <div className="w-1/2 h-1 bg-slate-800 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-3/4 h-0.5 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-[40%] h-full flex flex-col gap-2">
                          <span className="text-[5px] font-bold text-slate-900 uppercase border-b border-indigo-700 pb-0.5">Education</span>
                          <div className="w-full h-1 bg-slate-600 rounded mb-0.5 mt-1"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-2"></div>

                          <span className="text-[5px] font-bold text-slate-900 uppercase border-b border-indigo-700 pb-0.5">Skills</span>
                          <div className="w-full h-0.5 bg-slate-200 rounded mt-1"></div>
                          <div className="w-5/6 h-0.5 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Timeline Portfolio Realistic Preview */}
                  {tmpl.variant === "timeline" && (
                    <div className="flex flex-col h-full w-full p-5">
                      <div className="w-full text-center mb-2">
                        <h2 className="text-[12px] font-black text-slate-900 uppercase leading-none mb-1">NEHA KAPOOR</h2>
                        <p className="text-[4px] text-indigo-500 font-bold uppercase">Creative Director</p>
                      </div>
                      <div className="w-full h-[1px] bg-slate-200 mb-3"></div>
                      <div className="flex flex-1 gap-3">
                        <div className="w-[60%] h-full border-l-[1px] border-indigo-500 pl-2.5 flex flex-col gap-2 relative">
                          <div className="absolute top-1 left-[-2px] w-[3px] h-[3px] rounded-full bg-indigo-500"></div>
                          <div>
                            <span className="text-[4.5px] font-bold text-indigo-500 uppercase block mb-1">Experience</span>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-5/6 h-0.5 bg-slate-200 rounded mt-0.5"></div>
                          </div>
                          
                          <div className="absolute top-9 left-[-2px] w-[3px] h-[3px] rounded-full bg-indigo-500"></div>
                          <div className="mt-2">
                            <div className="w-2/3 h-1 bg-slate-800 rounded mb-0.5"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-4/5 h-0.5 bg-slate-200 rounded mt-0.5"></div>
                          </div>

                          <div className="absolute top-[4.5rem] left-[-2px] w-[3px] h-[3px] rounded-full bg-indigo-500"></div>
                          <div className="mt-2">
                            <div className="w-1/2 h-1 bg-slate-800 rounded mb-0.5"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                        <div className="w-[40%] h-full flex flex-col gap-1.5">
                          <span className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5">Skills</span>
                          <div className="w-full h-0.5 bg-slate-400 rounded mb-0.5 mt-0.5"></div>
                          <div className="w-3/4 h-0.5 bg-slate-400 rounded mb-2"></div>
                          
                          <span className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5">Education</span>
                          <div className="w-full h-1 bg-slate-400 rounded mb-0.5 mt-0.5"></div>
                          <div className="w-5/6 h-0.5 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* HOVER ACTION OVERLAY */}
                <div className="absolute inset-0 bg-indigo-900/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none rounded-t-[1.5rem] rounded-b-xl">
                  <div className="bg-indigo-600 text-white text-sm font-bold py-3 px-6 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Select template
                  </div>
                </div>

              </div>

              {/* CARD BOTTOM INFO & BUTTON */}
              <div className="p-6 pt-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#111827] mb-2">
                  {tmpl.title}
                </h3>
                
                {/* NEW FULL DETAILS TEXT */}
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                  {tmpl.description}
                </p>

                {/* NEW TEMPLATE METADATA TAGS */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tmpl.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 py-1 px-2.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link 
                  href={tmpl.path} 
                  className="mt-auto w-full bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-100 hover:border-indigo-600 text-sm font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  Choose this layout 
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
              
            </div>
          ))}
        </div>
      </main>

      {/* HOW IT WORKS & FAQ SECTION */}
      <div className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-[1200px] mx-auto py-16 px-6 lg:px-8">
          
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-[#111827] tracking-tight mb-4">
                How it Works
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Building a professional, industry-standard resume has never been easier. No design skills required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-3">1. Select a Layout</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Choose from our carefully crafted, ATS-friendly templates above. Whether you want a modern sidebar or a classic grid, we have you covered.
                </p>
              </div>
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-3">2. Edit Dynamic Sections</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Use the left-hand dashboard to enter your details. You can dynamically add, rename, or delete entire sections (like Skills or Projects) to fit your career.
                </p>
              </div>
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Download className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-3">3. Download PDF</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Watch your resume format automatically in real-time. When you are happy with the preview, click download to get your high-quality PDF instantly.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-black text-[#111827] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Are these templates free to use?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Yes! All of our templates are completely free. There are no hidden paywalls at the end, and we don't put watermarks on your downloaded PDF.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Are the resumes ATS-friendly?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Yes. Our layouts are designed using clean, text-based structures that Applicant Tracking Systems (ATS) can easily scan and parse.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Can I customize the sections?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Absolutely. Inside the builder, our new "Dynamic Sections" feature allows you to add custom categories (like Certifications, Publications, or Volunteer Work) or delete the ones you don't need.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Is my personal data safe?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      100% safe. All the data processing and PDF generation happens locally inside your web browser. We do not store, track, or save your resume data on external servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}