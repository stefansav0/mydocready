"use client";

import Link from "next/link";
import { FileText, CheckCircle2, ArrowRight } from "lucide-react";

// ============================================
// CONFIGURATION: UPDATE YOUR ROUTE PATHS HERE
// ============================================
const TEMPLATES = [
  {
    id: "sidebar-pro",
    title: "Two-Column Sidebar Pro",
    path: "/resume-maker/sidebar-pro", 
    variant: "sidebar"
  },
  {
    id: "classic-minimal",
    title: "Classic Minimalist",
    path: "/resume-maker/classic-minimal",
    variant: "minimal"
  },
  {
    id: "right-executive",
    title: "Right-Sidebar Executive",
    path: "/resume-maker/right-executive",
    variant: "executive"
  },
  {
    id: "horizontal-grid",
    title: "Horizontal Row Grid",
    path: "/resume-maker/horizontal-grid",
    variant: "row-grid"
  },
  {
    id: "typographic-split",
    title: "Typographic Editorial",
    path: "/resume-maker/typographic-split",
    variant: "editorial"
  },
  {
    id: "timeline-portfolio",
    title: "Timeline Portfolio",
    path: "/resume-maker/timeline-portfolio",
    variant: "timeline"
  }
];

export default function HomeTemplatePicker() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      
      

      {/* HERO SECTION */}
      <section className="text-center pt-16 pb-12 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Choose a resume template
        </h1>
        <p className="text-slate-500 text-lg">
          Select a professional layout to start. You can easily customize it later.
        </p>
      </section>

      {/* TEMPLATE PICKER GRID */}
      <main className="max-w-[1200px] w-full mx-auto px-6 pb-24 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col group">
              
              {/* MINIATURE REALISTIC RESUME PREVIEW */}
              <div className="w-full h-[320px] bg-slate-100 flex items-center justify-center p-6 border-b border-slate-200 relative overflow-hidden">
                
                {/* The "A4 Paper" wrapper with realistic mini-text */}
                <div className="w-[180px] h-[254px] bg-white shadow-md overflow-hidden relative pointer-events-none border border-slate-200 transition-transform duration-300 group-hover:scale-105">
                  
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
                        </div>
                      </div>
                      <div className="w-[65%] p-4 flex flex-col">
                        <h2 className="text-[10px] font-black text-slate-800 uppercase leading-none mb-1">RAVI KUMAR</h2>
                        <span className="text-[4px] text-slate-500 mb-3">ravi@email.com • New Delhi, IN</span>
                        
                        <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5 mb-1.5">Profile</span>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-0.5"></div>
                        <div className="w-5/6 h-0.5 bg-slate-200 rounded mb-3"></div>
                        
                        <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5 mb-1.5">Experience</span>
                        <div className="w-1/2 h-1 bg-slate-300 rounded mb-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-0.5"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded mb-2"></div>
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
                        </div>
                        <div className="w-2/3 h-full flex flex-col gap-1.5 pl-1">
                          <span className="text-[4px] font-bold text-slate-800 uppercase border-b border-slate-800 pb-0.5 mb-0.5">Experience</span>
                          <div className="w-2/3 h-1 bg-slate-300 rounded mb-0.5"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-1"></div>
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
                          <div className="w-full h-0.5 bg-slate-200 rounded mb-2"></div>
                        </div>
                        <div className="w-[40%] h-full bg-slate-50 border-l border-slate-200 p-3 flex flex-col gap-2">
                          <span className="text-[5px] font-bold text-slate-800 uppercase border-b border-slate-300 pb-0.5">Expertise</span>
                          <div className="w-full h-0.5 bg-slate-300 rounded mt-1"></div>
                          <div className="w-3/4 h-0.5 bg-slate-300 rounded"></div>
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
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-[40%] h-full flex flex-col gap-2">
                          <span className="text-[5px] font-bold text-slate-900 uppercase border-b border-indigo-700 pb-0.5">Education</span>
                          <div className="w-full h-1 bg-slate-600 rounded mb-0.5 mt-1"></div>
                          <div className="w-full h-0.5 bg-slate-200 rounded"></div>
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
                          </div>
                          <div className="absolute top-10 left-[-2px] w-[3px] h-[3px] rounded-full bg-indigo-500"></div>
                          <div>
                            <div className="w-2/3 h-1 bg-slate-800 rounded mb-0.5 mt-2"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                        <div className="w-[40%] h-full flex flex-col gap-1.5">
                          <span className="text-[4.5px] font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5">Skills</span>
                          <div className="w-full h-0.5 bg-slate-400 rounded mb-0.5 mt-0.5"></div>
                          <div className="w-3/4 h-0.5 bg-slate-400 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* RESUME-NOW STYLE HOVER ACTION OVERLAY */}
                <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="bg-blue-600 text-white text-sm font-bold py-3 px-6 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Select template
                  </div>
                </div>

              </div>

              {/* CARD BOTTOM INFO & PERMANENT BUTTON */}
              <div className="p-6 pt-0 flex flex-col flex-1">
                <h3 className="text-[18px] font-bold text-slate-900">
                  {tmpl.title}
                </h3>
                
                {/* ALWAYS VISIBLE BUTTON FOR MOBILE COMPATIBILITY */}
                <Link 
                  href={tmpl.path} 
                  className="mt-auto w-full bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 text-sm font-bold py-3.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Choose this template <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}