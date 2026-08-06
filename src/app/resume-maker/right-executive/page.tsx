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

export default function ResumeMakerModern() {
  // ============================================
  // STATES PRE-FILLED WITH MODERN EXAMPLES
  // ============================================
  const [name, setName] = useState("PRIYA SHARMA");
  const [address, setAddress] = useState("H-42, Sector 62, Noida, UP 201301");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("priya.sharma.tech@gmail.com");
  const [objective, setObjective] = useState(
    "Innovative Software Engineer with 3+ years of experience specialized in building scalable web applications, designing RESTful APIs, and implementing robust state management architectures. Proven track record of refining platform processing cycles and leading collaborative cross-functional product sprints."
  );
  const [declaration, setDeclaration] = useState("I hereby declare that all the information stated above is accurate to the best of my knowledge.");

  // DYNAMIC SIDEBAR SECTIONS (Right Column)
  const [sidebarSections, setSidebarSections] = useState<CustomSection[]>([
    {
      id: "side-1",
      title: "Technical Expertise",
      content: "• ReactJS & Next.js\n• TypeScript & JavaScript\n• Node.js & Express\n• Tailwind CSS & UI Design\n• PostgreSQL & MongoDB\n• Git & CI/CD Pipelines\n• REST APIs & GraphQL\n• Agile Methodologies",
    },
    {
      id: "side-2",
      title: "Certifications",
      content: "• AWS Certified Cloud Practitioner\n• Meta Front-End Developer Certificate\n• Advanced Data Structures Mastery",
    },
    {
      id: "side-3",
      title: "Languages Spoken",
      content: "• English (Fluent)\n• Hindi (Native)",
    },
    {
      id: "side-4",
      title: "Interests & Projects",
      content: "• Technical Writing & Mentorship\n• Competitive Coding\n• UI/UX Interaction Design",
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      schoolName: "Delhi Technological University",
      schoolLocation: "New Delhi",
      degree: "B.Tech in Computer Science",
      fieldOfStudy: "Information Technology",
      graduationDate: "Graduated: July 2023",
      isEnrolled: false,
      description: "Graduated with Honors. Core coursework covered Algorithms design, Database Engineering, and Software Architecture methodologies."
    }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      jobTitle: "Senior Software Engineer",
      employer: "TechNova Solutions",
      city: "Noida",
      country: "India",
      startDate: "Aug 2024",
      endDate: "Present",
      isCurrent: true,
      description: "• Architected dynamic application routing engines utilizing Next.js Framework ecosystems.\n• Reduced asset bundles up to 35% by implementing lazy loading patterns and code splitting structures.\n• Mentored 4 junior engineers on architectural design principles and clean code workflows."
    },
    {
      id: "2",
      jobTitle: "Associate Developer",
      employer: "Quantum Systems Inc",
      city: "Gurugram",
      country: "India",
      startDate: "June 2023",
      endDate: "Jul 2024",
      isCurrent: false,
      description: "• Developed responsive, interactive operational dashboards using custom reusable React components.\n• Interfaced backend relational systems with frontend hooks reducing load times dramatically.\n• Contributed daily to cross-functional interface optimization pipelines."
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

  // Sidebar Custom Sections Handlers
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
  // DYNAMIC UNIQUE MODERN PREVIEW COMPONENT
  // ============================================
  const renderResumePreview = (innerRef?: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#1e293b] shadow-2xl flex flex-col overflow-hidden shrink-0 font-sans border border-slate-200"
      style={{ letterSpacing: "normal" }}
    >
      {/* MODERN INTEGRATED BANNER BLOCK */}
      <div className="w-full bg-[#1e293b] text-[#ffffff] px-8 pt-8 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-wide text-[#ffffff]">
            {name || "YOUR NAME"}
          </h1>
          <p className="text-[#38bdf8] text-[13px] uppercase font-bold tracking-widest mt-1.5">
            {experiences[0]?.jobTitle || "Professional Title"}
          </p>
        </div>
        <div className="text-right text-[11px] text-[#cbd5e1] space-y-0.5">
          <p>{email || "email@domain.com"}</p>
          <p>{phone || "00000-00000"}</p>
          <p>{address || "City, State Location"}</p>
        </div>
      </div>

      {/* HORIZONTAL ACCENT LINE */}
      <div className="w-full h-1.5 bg-[#0284c7]"></div>

      {/* SPLIT WRAPPER BODY PANEL */}
      <div className="w-full flex flex-row flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: CORE PROFESSIONAL TIMELINE (63% Width) */}
        <div className="w-[63%] p-8 flex flex-col gap-6 overflow-hidden">
          
          <div>
            <h2 className="text-[14px] font-bold text-[#0284c7] border-b border-[#e2e8f0] pb-1 uppercase tracking-wider mb-2.5">
              Professional Summary
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11.5px] text-justify whitespace-pre-wrap">
              {objective || "Write your core competitive profiling statement here."}
            </p>
          </div>

          <div>
            <h2 className="text-[14px] font-bold text-[#0284c7] border-b border-[#e2e8f0] pb-1 uppercase tracking-wider mb-3.5">
              Work Experience
            </h2>
            <div className="flex flex-col gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline font-bold text-[#1e293b]">
                    <span className="text-[13px] text-[#0f172a]">{exp.jobTitle || "Job Title"}</span>
                    <span className="text-[10.5px] font-medium text-[#64748b]">{exp.startDate || "Start"} – {exp.isCurrent ? "Present" : (exp.endDate || "End")}</span>
                  </div>
                  <div className="text-[#0284c7] font-semibold text-[11.5px] mt-0.5">
                    {exp.employer || "Company/Employer"} {exp.city && `| ${exp.city}`}
                  </div>
                  {exp.description && (
                    <p className="mt-1.5 text-[#334155] leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[14px] font-bold text-[#0284c7] border-b border-[#e2e8f0] pb-1 uppercase tracking-wider mb-3.5">
              Education & Academics
            </h2>
            <div className="flex flex-col gap-3">
              {educations.map((edu) => (
                <div key={edu.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline font-bold text-[#1e293b]">
                    <span className="text-[12.5px] text-[#0f172a]">{edu.degree || "Degree Description"}</span>
                    <span className="text-[10.5px] font-medium text-[#64748b]">{edu.graduationDate || "Graduation Year"}</span>
                  </div>
                  <div className="text-[#475569] font-medium mt-0.5">
                    {edu.schoolName} {edu.schoolLocation && `| ${edu.schoolLocation}`}
                  </div>
                  {edu.description && (
                    <p className="mt-1 text-[#475569] leading-relaxed whitespace-pre-wrap text-[10.5px]">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {declaration && (
            <div className="mt-auto pt-4 border-t border-[#f1f5f9]">
              <p className="text-[10px] text-[#64748b] italic whitespace-pre-wrap leading-normal">
                {declaration}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DYNAMIC SIDEBAR (37% Width) */}
        <div className="w-[37%] bg-[#f8fafc] border-l border-[#e2e8f0] p-6 flex flex-col gap-6">
          {sidebarSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-[13px] font-bold text-[#1e293b] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5">
                {sec.title}
              </h2>
              <p className="text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-100 overflow-x-hidden relative font-sans flex flex-col">
      
      {/* HIDDEN PRINT TARGET */}
      <div className="fixed top-0 left-[-9999px] -z-50 pointer-events-none">
        {renderResumePreview(resumeRef)}
      </div>
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Modern Layout <span className="text-sky-600">Builder</span>
        </h1>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="hidden lg:flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
        >
          {isDownloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </header>

      {/* DASHBOARD WORKSPACE PANELS GRID */}
      <div className="max-w-[1600px] w-full mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 lg:h-[85vh]">
        
        {/* INPUT COMPONENT BUILDERS CONTROLLERS PANEL */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 overflow-y-auto h-[70vh] lg:h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Personal Data</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Full Profile Name</label>
                <input type="text" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-slate-900 font-medium" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Current Contact Address</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-slate-900 h-24 resize-none" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Mobile Phone Line</label>
                <input type="text" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-slate-900" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Professional Email</label>
                <input type="email" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-slate-900" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Dynamic Sidebar Sections</h2>
            <p className="text-sm text-slate-500 mb-4">Customize the right-hand column. Add, rename, or remove blocks for Skills, Certifications, or Projects.</p>
            
            {/* DYNAMIC SIDEBAR BUILDER */}
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
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 uppercase font-semibold"
                      placeholder="e.g. SKILLS, LANGUAGES"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Content</label>
                    <textarea
                      value={sec.content}
                      onChange={(e) => handleSidebarSectionChange(sec.id, "content", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 h-28 resize-y text-sm"
                      placeholder="Enter the section details..."
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addSidebarSection}
                className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-bold py-2 px-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Sidebar Section
              </button>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Main Left Column Data</h2>

            <div className="space-y-8">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Professional Summary</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-slate-900 h-32 resize-y" value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>

              {/* DYNAMIC WORK TIMELINE PLACEMENT COMPONENT */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Work Experience</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company/Corporate Title</label>
                        <input type="text" value={exp.employer} onChange={(e) => handleExpChange(exp.id, "employer", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role Designation</label>
                        <input type="text" value={exp.jobTitle} onChange={(e) => handleExpChange(exp.id, "jobTitle", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">City</label>
                        <input type="text" value={exp.city} onChange={(e) => handleExpChange(exp.id, "city", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" placeholder="e.g. New York" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Country</label>
                        <input type="text" value={exp.country} onChange={(e) => handleExpChange(exp.id, "country", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => handleExpChange(exp.id, "startDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">End Date</label>
                        <input type="text" disabled={exp.isCurrent} value={exp.isCurrent ? "Present" : exp.endDate} onChange={(e) => handleExpChange(exp.id, "endDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none disabled:opacity-50 disabled:bg-slate-100" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                        <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-600 cursor-pointer">Active Ongoing Position</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Responsibilities / Key Items Achieved</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 h-32 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-bold py-2 px-1 transition-colors"><Plus className="w-4 h-4" /> Add Professional Block</button>
              </div>

              {/* DYNAMIC EDUCATION SECTION BUILDER ACCORDIONS */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Education Details</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">University / Institute</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location (City, Country)</label>
                        <input type="text" value={edu.schoolLocation} onChange={(e) => handleEduChange(edu.id, "schoolLocation", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Degree Received</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Graduation Year</label>
                        <input type="text" value={edu.graduationDate} onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Coursework Description</label>
                        <textarea value={edu.description} onChange={(e) => handleEduChange(edu.id, "description", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 h-20 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-bold py-2 px-1 transition-colors"><Plus className="w-4 h-4" /> Add Academic Node</button>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-600">Declaration Statement</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-slate-900 h-20 resize-y" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              </div>
            </div>
            <div className="h-24 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP INTERACTIVE DISPLAY CANVAS */}
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
              Build a sleek, modern, ATS-friendly resume in minutes. No design skills required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Edit3 className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Add Custom Sidebars</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Use the dashboard to enter your primary experience and fully customize the right-hand column. Add distinct sections for specific tech stacks, certifications, or hobbies.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <FileText className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Live Modern Preview</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Watch your resume build itself in real-time. The layout automatically handles spacing, alignment, and formatting to give you a polished, two-column visual edge.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Download className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Download PDF</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                When you're happy with your content, hit the download button. You’ll instantly receive a high-quality, print-ready PDF that looks perfect on both screens and paper.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-sky-600" />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I delete sidebar sections I don't need?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Yes! You can permanently remove any default sections you don't require (like Languages) by clicking the red trash can icon in the top right of each sidebar block.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I create my own categories?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Absolutely. Just click the "+ Add Sidebar Section" button in the left panel. You can name your new section anything you want, such as "Publications" or "Awards".
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Is the resulting PDF ATS-friendly?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Yes. This Modern template uses a clean, two-column layout that maintains straight textual hierarchy, making it highly readable for most standard Applicant Tracking Systems (ATS).
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Is my personal data saved on your servers?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    No. All the processing and PDF generation happens locally inside your web browser. We do not store, track, or upload your personal resume data to any external servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DISPLAY CONTROLS LAYER */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl p-4 rounded-xl font-bold flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" /> Preview & Download
        </button>
      </div>

      {/* MOBILE FULLSCREEN DIALOG VIEWPORTS */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shadow-sm">
            <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm">
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