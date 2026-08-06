"use client";

import React, { useState, useRef } from "react";
import { Eye, Download, X, Plus, Trash2, FileText, Edit3, HelpCircle, CheckCircle2 } from "lucide-react";

// ============================================
// TYPES
// ============================================
type Experience = {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

type Education = {
  id: string;
  schoolName: string;
  schoolLocation: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
  isEnrolled: boolean;
  description: string;
};

type CustomSection = {
  id: string;
  title: string;
  content: string;
};

export default function ResumeMakerTimeline() {
  // ============================================
  // STATES PRE-FILLED WITH PORTFOLIO EXAMPLES
  // ============================================
  const [name, setName] = useState("NEHA KAPOOR");
  const [address, setAddress] = useState("A-12, Green Park, New Delhi, Delhi 110016");
  const [phone, setPhone] = useState("+91 99999 88888");
  const [email, setEmail] = useState("neha.kapoor.design@gmail.com");
  const [objective, setObjective] = useState(
    "Award-winning Creative Design Director with 6+ years of experience leading multi-disciplinary squads to build immersive brand ecosystems, digital products, and interactive marketing campaigns. Expert in user-centric layout theory, visual strategy blueprints, and cross-functional design-to-development pipeline management."
  );
  const [declaration, setDeclaration] = useState("I hereby declare that all the information provided above is authentic and correct.");

  // DYNAMIC SIDEBAR SECTIONS (Right Column)
  const [sidebarSections, setSidebarSections] = useState<CustomSection[]>([
    {
      id: "side-1",
      title: "Technical Matrix",
      content: "• UI/UX Strategy & Wireframing\n• Brand Identity Systems\n• Typography & Motion Graphics\n• Adobe Creative Suite Mastery\n• Figma Platform Architecture\n• Front-End Layout Standards\n• Leadership & Client Pitching",
    },
    {
      id: "side-2",
      title: "Credentials",
      content: "• Human-Computer Interaction (HCI) Certificate – Interaction Design Foundation\n• Advanced Visual Design Architecture – National Institute of Design\n• Certified Scrum Product Owner (CSPO)",
    },
    {
      id: "side-3",
      title: "Languages Spoken",
      content: "• English (Native Proficiency)\n• Hindi (Native Speaker)\n• Punjabi (Conversational)",
    },
    {
      id: "side-4",
      title: "Affiliations",
      content: "• Modern Abstract Painting • Photography & Travel Journalism • Mentoring Aspiring Designers",
    },
  ]);

  // DYNAMIC MAIN SECTIONS (Left Column - Attached to Timeline)
  const [mainSections, setMainSections] = useState<CustomSection[]>([]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      schoolName: "National Institute of Fashion Technology (NIFT)",
      schoolLocation: "New Delhi, India",
      degree: "Master of Design (M.Des)",
      fieldOfStudy: "Visual Communications",
      graduationDate: "Graduated: 2020",
      isEnrolled: false,
      description: "Graduated with the 'Best Design Portfolio' award. Focused research on interactive spatial communication models and corporate identity frameworks."
    }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      jobTitle: "Creative Design Director",
      employer: "Vivid Studio Labs",
      city: "New Delhi",
      country: "India",
      startDate: "Mar 2024",
      endDate: "Present",
      isCurrent: true,
      description: "• Spearheaded creative directional updates for 14 primary client portfolios, scaling user engagement by 55%.\n• Built and managed a robust shared design system library inside Figma, compressing production cycles by 40%.\n• Supervised an active cross-functional team of 12 UI/UX designers, copywriters, and motion animators."
    },
    {
      id: "2",
      jobTitle: "Senior Brand UI Specialist",
      employer: "Spectrum Digital Agency",
      city: "Gurugram",
      country: "India",
      startDate: "June 2021",
      endDate: "Feb 2024",
      isCurrent: false,
      description: "• Orchestrated interactive frontend component mockups for high-traffic media portals across regions.\n• Coordinated alongside product managers to map user behavior journeys and implement layout enhancements.\n• Spearheaded high-stakes interactive mockups for prospective clients, securing premium multi-year accounts."
    }
  ]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // ============================================
  // HANDLERS
  // ============================================
  const downloadPDF = async () => {
    const input = resumeRef.current;
    if (!input) return;

    setIsDownloading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);
      const canvas = await html2canvas(input, {
        scale: 2, 
        useCORS: true,
        logging: false,
        scrollY: 0,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${name ? name.replace(/\s+/g, "_") : "My"}_Resume.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Sidebar Custom Sections Handlers (Right Column)
  const handleSidebarSectionChange = (id: string, field: keyof CustomSection, value: string) => {
    setSidebarSections(
      sidebarSections.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };
  const addSidebarSection = () => {
    setSidebarSections([
      ...sidebarSections,
      { id: Date.now().toString(), title: "NEW SIDEBAR SECTION", content: "" },
    ]);
  };
  const removeSidebarSection = (id: string) => {
    setSidebarSections(sidebarSections.filter((sec) => sec.id !== id));
  };

  // Main Custom Sections Handlers (Left Column)
  const handleMainSectionChange = (id: string, field: keyof CustomSection, value: string) => {
    setMainSections(
      mainSections.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };
  const addMainSection = () => {
    setMainSections([
      ...mainSections,
      { id: Date.now().toString(), title: "NEW TIMELINE SECTION", content: "" },
    ]);
  };
  const removeMainSection = (id: string) => {
    setMainSections(mainSections.filter((sec) => sec.id !== id));
  };

  const handleEduChange = (id: string, field: keyof Education, value: any) => {
    setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };
  const addEducation = () => setEducations([...educations, { id: Date.now().toString(), schoolName: "", schoolLocation: "", degree: "", fieldOfStudy: "", graduationDate: "", isEnrolled: false, description: "" }]);
  const removeEducation = (id: string) => setEducations(educations.filter(edu => edu.id !== id));

  const handleExpChange = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };
  const addExperience = () => setExperiences([...experiences, { id: Date.now().toString(), jobTitle: "", employer: "", city: "", country: "", startDate: "", endDate: "", isCurrent: false, description: "" }]);
  const removeExperience = (id: string) => setExperiences(experiences.filter(exp => exp.id !== id));

  // ============================================
  // SLEEK TIMELINE PORTFOLIO LAYOUT COMPONENT
  // ============================================
  const renderResumePreview = (innerRef?: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#1e293b] shadow-2xl p-10 flex flex-col overflow-hidden shrink-0 font-sans border border-slate-200"
      style={{ letterSpacing: "normal" }}
    >
      {/* MINIMALIST IMPACT CENTERED HEADER */}
      <div className="w-full text-center mb-6">
        <h1 className="text-[42px] font-black tracking-tight text-[#0f172a] leading-none mb-2">
          {name || "YOUR NAME"}
        </h1>
        <p className="text-[#6366f1] text-[13px] uppercase font-bold tracking-widest font-sans mb-3">
          {experiences[0]?.jobTitle || "Professional Field Placement"}
        </p>
        <div className="flex flex-row justify-center items-center gap-6 text-[11.5px] text-[#475569] font-medium">
          <p>Email: {email || "your.email@domain.com"}</p>
          <p>•</p>
          <p>Phone: {phone || "+91 00000 00000"}</p>
          <p>•</p>
          <p>{address || "City, State Location"}</p>
        </div>
      </div>

      {/* DOUBLE DECORATIVE HORIZONTAL ACCENT BREAK */}
      <div className="w-full h-[1px] bg-[#e2e8f0] mb-6"></div>

      {/* TIMELINE ARCHITECTURE SPLIT LAYOUT BODY */}
      <div className="w-full flex flex-row gap-8 flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: ACTIVE INTEGRATED CHRONOLOGY (64% Width) */}
        <div className="w-[64%] flex flex-col gap-6 overflow-hidden">
          
          {/* PROFILE CORE */}
          <div className="relative pl-6 border-l-2 border-[#6366f1]">
            <div className="absolute top-1.5 left-[-6px] w-[10px] h-[10px] bg-[#6366f1] rounded-full"></div>
            <h2 className="text-[13px] font-extrabold text-[#6366f1] uppercase tracking-wider mb-2 font-sans">
              Summary Statement
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11.5px] text-justify whitespace-pre-wrap">
              {objective || "Write your core competitive professional description profiling here."}
            </p>
          </div>

          {/* CHRONOLOGICAL EXPERIENCE TIMELINE */}
          <div className="relative pl-6 border-l-2 border-[#6366f1]">
            <div className="absolute top-1.5 left-[-6px] w-[10px] h-[10px] bg-[#6366f1] rounded-full"></div>
            <h2 className="text-[13px] font-extrabold text-[#6366f1] uppercase tracking-wider mb-3.5 font-sans">
              Professional Timeline
            </h2>
            <div className="flex flex-col gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-[11.5px] relative">
                  {/* Internal Sub-node indicator bullet dot */}
                  <div className="absolute top-[5px] left-[-30px] w-2 h-2 bg-[#cbd5e1] rounded-full border border-[#ffffff]"></div>
                  <div className="flex justify-between items-baseline font-bold text-[#0f172a]">
                    <span className="text-[13px] font-extrabold text-[#0f172a]">{exp.jobTitle || "Job Designation Role"}</span>
                    <span className="text-[10.5px] font-medium text-[#64748b] font-sans">{exp.startDate || "Start"} – {exp.isCurrent ? "Present" : (exp.endDate || "End")}</span>
                  </div>
                  <div className="text-[#4f46e5] font-semibold text-[11.5px] mt-0.5 font-sans">
                    {exp.employer || "Company Enterprise"} {exp.city && `| ${exp.city}`}
                  </div>
                  {exp.description && (
                    <p className="mt-1.5 text-[#334155] leading-relaxed whitespace-pre-wrap text-[11px]">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC LEFT TIMELINE SECTIONS */}
          {mainSections.map((sec) => (
            <div key={sec.id} className="relative pl-6 border-l-2 border-[#6366f1]">
              <div className="absolute top-1.5 left-[-6px] w-[10px] h-[10px] bg-[#6366f1] rounded-full"></div>
              <h2 className="text-[13px] font-extrabold text-[#6366f1] uppercase tracking-wider mb-2 font-sans">
                {sec.title}
              </h2>
              <p className="text-[#334155] leading-relaxed text-[11.5px] whitespace-pre-wrap">
                {sec.content}
              </p>
            </div>
          ))}

          {/* DECLARATION POSITIONING AT BOTTOM (Continues Timeline) */}
          {declaration && (
            <div className="relative pl-6 border-l-2 border-[#6366f1] pt-2 flex-1">
              <div className="absolute top-3.5 left-[-6px] w-[10px] h-[10px] bg-[#cbd5e1] rounded-full"></div>
              <p className="text-[10px] text-[#64748b] italic whitespace-pre-wrap leading-normal">
                {declaration}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INSTITUTIONAL ATTRIBUTES PANEL (36% Width) */}
        <div className="w-[36%] flex flex-col gap-5 overflow-hidden">
          
          {/* ACADEMIC NODES */}
          <div>
            <h2 className="text-[13px] font-extrabold text-[#0f172a] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5 font-sans">
              Academic Nodes
            </h2>
            <div className="flex flex-col gap-3.5">
              {educations.map((edu) => (
                <div key={edu.id} className="text-[11px] leading-snug">
                  <p className="font-extrabold text-[#0f172a] text-[12px]">{edu.degree || "Degree Title Standard"}</p>
                  <p className="text-[#475569] font-semibold mt-0.5 text-[11px] font-sans">{edu.schoolName}</p>
                  <p className="text-[#64748b] text-[10px] mt-0.5 font-medium font-sans">{edu.graduationDate || "Year Passed"}</p>
                  {edu.description && (
                    <p className="mt-1 text-[#475569] text-[10.5px] leading-relaxed whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC RIGHT SIDEBAR SECTIONS */}
          {sidebarSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-[13px] font-extrabold text-[#0f172a] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5 font-sans">
                {sec.title}
              </h2>
              <p className="text-[#334155] leading-relaxed text-[11px] font-medium whitespace-pre-wrap font-sans">
                {sec.content}
              </p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 overflow-x-hidden relative font-sans flex flex-col">
      
      {/* HIDDEN PRINT TARGET STORAGE */}
      <div className="fixed top-0 left-[-9999px] -z-50 pointer-events-none">
        {renderResumePreview(resumeRef)}
      </div>
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Timeline Portfolio <span className="text-indigo-600">Builder</span>
        </h1>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="hidden lg:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
        >
          {isDownloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </header>

      {/* DASHBOARD GRID PLACEMENT CONTAINER */}
      <div className="max-w-[1600px] w-full mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 lg:h-[85vh]">
        
        {/* INPUT PANEL FIELD EDITOR MODULE */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 overflow-y-auto h-[70vh] lg:h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Personal Identifiers</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Full Profile Name</label>
                <input type="text" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Current Contact Address Line</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-24 resize-none text-slate-900" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Mobile Phone Line</label>
                <input type="text" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Professional Email</label>
                <input type="email" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Dynamic Sidebar Sections (Right)</h2>
            <p className="text-sm text-slate-500 mb-4">Add, rename, or delete sections that appear in the right-hand column (e.g. Skills, Certifications, Languages).</p>

            {/* DYNAMIC RIGHT SIDEBAR BUILDER */}
            <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
              {sidebarSections.map((sec) => (
                <div key={sec.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                  <button
                    onClick={() => removeSidebarSection(sec.id)}
                    className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Sidebar Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleSidebarSectionChange(sec.id, "title", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase font-semibold text-slate-900"
                      placeholder="e.g. SKILLS, LANGUAGES"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Content</label>
                    <textarea
                      value={sec.content}
                      onChange={(e) => handleSidebarSectionChange(sec.id, "content", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-28 resize-y text-sm text-slate-900"
                      placeholder="Enter the section details..."
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addSidebarSection}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold py-2 px-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Sidebar Section
              </button>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Main Timeline Sections (Left)</h2>

            <div className="space-y-8">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Summary Objective Statement</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-32 resize-y text-slate-900" value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>

              {/* DYNAMIC EXPERIENCE PROGRESSION CHRONOLOGY CONFIG NODE */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Professional Experience Timeline</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company/Corporate Title</label>
                        <input type="text" value={exp.employer} onChange={(e) => handleExpChange(exp.id, "employer", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role Designation Title</label>
                        <input type="text" value={exp.jobTitle} onChange={(e) => handleExpChange(exp.id, "jobTitle", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">City</label>
                        <input type="text" value={exp.city} onChange={(e) => handleExpChange(exp.id, "city", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. New York" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Country</label>
                        <input type="text" value={exp.country} onChange={(e) => handleExpChange(exp.id, "country", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => handleExpChange(exp.id, "startDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">End Date</label>
                        <input type="text" disabled={exp.isCurrent} value={exp.isCurrent ? "Present" : exp.endDate} onChange={(e) => handleExpChange(exp.id, "endDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-slate-100" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-600 cursor-pointer">Active Ongoing Position</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Responsibilities / Key Accomplishments</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-28 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold py-2 px-1 transition-colors"><Plus className="w-4 h-4" /> Add Professional Block</button>
              </div>

              {/* DYNAMIC LEFT TIMELINE SECTIONS */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <p className="text-sm text-slate-500 mb-2">Add custom sections that will automatically attach to the vertical timeline axis below Experience (e.g. Projects, Awards).</p>
                {mainSections.map((sec) => (
                  <div key={sec.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button
                      onClick={() => removeMainSection(sec.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Main Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Timeline Section Title</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleMainSectionChange(sec.id, "title", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase font-semibold text-slate-900"
                        placeholder="e.g. PROJECTS, AWARDS"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Content</label>
                      <textarea
                        value={sec.content}
                        onChange={(e) => handleMainSectionChange(sec.id, "content", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-28 resize-y text-sm text-slate-900"
                        placeholder="Enter the section details..."
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addMainSection}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold py-2 px-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Timeline Section
                </button>
              </div>

              {/* DYNAMIC EDUCATION TIMELINE CONFIGURE ENGINE ACCORDION */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Academic Education Details</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">University / Institute School Name</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location</label>
                        <input type="text" value={edu.schoolLocation} onChange={(e) => handleEduChange(edu.id, "schoolLocation", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Degree Received Title</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Graduation Passing Year</label>
                        <input type="text" value={edu.graduationDate} onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Coursework Description</label>
                        <textarea value={edu.description} onChange={(e) => handleEduChange(edu.id, "description", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-20 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold py-2 px-1 transition-colors"><Plus className="w-4 h-4" /> Add Academic Node</button>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-600">Declaration Statement text</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-20 resize-y text-slate-900" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              </div>
            </div>
            <div className="h-20 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP COMPONENT WORKSPACE CANVAS DISPLAY PANEL */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-100 rounded-3xl overflow-auto border border-slate-200 shadow-inner relative items-start justify-center p-8 custom-scrollbar h-[70vh] lg:h-full">
          <div className="origin-top scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9] transition-transform duration-300 flex justify-center shadow-2xl">
            {renderResumePreview()}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS & FAQ SECTION */}
      <div className="max-w-[1200px] mx-auto py-16 px-6 lg:px-8 mt-10">
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
              How it Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Build an interactive, ATS-friendly timeline portfolio resume in minutes. No design skills required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Edit3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Add Custom Sections</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Use the left-hand dashboard to enter your info. You can add "Timeline Sections" to attach new blocks to the main vertical axis, or "Sidebar Sections" to populate the right column.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Live Formatting</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Watch your resume build itself in real-time. The layout automatically handles the spacing, timeline nodes, and vertical tracking line to ensure a sleek presentation.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Download className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Download PDF</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                When you're happy with your design, hit the download button to instantly receive your high-quality, print-ready PDF file securely.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I delete default sections?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Yes! You can completely delete default sidebar sections like "Languages" or "Affiliations" by clicking the red trash can icon inside the editor block.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I create my own timeline categories?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Absolutely. Use the "+ Add Timeline Section" button. Whatever you add here will be formatted identically to your experience blocks, connecting directly to the vertical timeline.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Is the resulting PDF ATS-friendly?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Yes. Despite its highly visual nature, this template uses standard left-to-right text reading blocks that modern Applicant Tracking Systems (ATS) can easily parse.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Is my personal data saved on your servers?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    No. All processing and PDF generation happens locally inside your web browser. We do not store, track, or save your personal resume data on external servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ACTIONS SELECTION FLOATING TRIGGERS */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl p-4 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <Eye className="w-5 h-5" /> Preview & Download
        </button>
      </div>

      {/* MOBILE OVERLAY INTERACTION FULL MODALS */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shadow-sm">
            <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm disabled:opacity-50">
              {isDownloading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
              {isDownloading ? "Saving..." : "Save PDF"}
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-100 custom-scrollbar">
            <div className="origin-top scale-[0.45] sm:scale-[0.6] transition-transform shadow-xl">
              {renderResumePreview()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}