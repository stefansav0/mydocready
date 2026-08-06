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

export default function ResumeMakerTypographic() {
  // ============================================
  // STATES PRE-FILLED WITH TYPOGRAPHIC EXAMPLES
  // ============================================
  const [name, setName] = useState("Your Name");
  const [address, setAddress] = useState("704, Windsor Towers, Hiranandani, Powai, Mumbai 400076");
  const [phone, setPhone] = useState("+91 0000000000");
  const [email, setEmail] = useState("yourgmail@gmail.com");
  const [objective, setObjective] = useState(
    "Senior Business Intelligence Architect and Analytics Director with over 6 years of expertise leading corporate data strategy initiatives. Specialized in cross-functional data pipeline modeling, predictive analytics architectures, and deploying visual reporting governance structures that convert complex enterprise data into clean, actionable revenue streams."
  );
  const [declaration, setDeclaration] = useState("I hereby declare that all the professional and academic records stated above are authentic and true.");

  // DYNAMIC SIDEBAR SECTIONS (Right Column - 38%)
  const [sidebarSections, setSidebarSections] = useState<CustomSection[]>([
    {
      id: "side-1",
      title: "Core Competencies",
      content: "• Business Intelligence & Analytics\n• Data Architecture & Modeling\n• Advanced SQL & Python Execution\n• Tableau & Power BI Governance\n• Cross-functional Strategy Sprints\n• Predictive Data Forecasting\n• ETL Pipeline Infrastructures\n• Executive Stakeholder Relations",
    },
    {
      id: "side-2",
      title: "Certifications",
      content: "• Certified Business Intelligence Professional (CBIP)\n• Snowflake Core Data Engineer Certificate\n• Google Advanced Cloud Data Analytics Badge",
    },
    {
      id: "side-3",
      title: "Languages Spoken",
      content: "• English (Native/Fluent Proficiency)\n• Hindi (Native Speaker)\n• Spanish (Basic Working Framework)",
    },
    {
      id: "side-4",
      title: "Interests & Research",
      content: "• Technical Mentorship Systems • Financial Market Analysis • Strategic Chess Formations",
    },
  ]);

  // DYNAMIC MAIN SECTIONS (Left Column - 62%)
  const [mainSections, setMainSections] = useState<CustomSection[]>([]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      schoolName: "Indian Institute of Technology (IIT)",
      schoolLocation: "Bombay, India",
      degree: "M.Tech in Data Science & Engineering",
      fieldOfStudy: "Applied Statistics",
      graduationDate: "Graduated: 2020",
      isEnrolled: false,
      description: "Graduated top 5% of class. Thesis specialized in optimizing computational matrix structures for multi-tenant analytical platforms."
    }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      jobTitle: "Lead Business Intelligence Architect",
      employer: "Apex Analytics Corporate Group",
      city: "Mumbai",
      country: "India",
      startDate: "Nov 2023",
      endDate: "Present",
      isCurrent: true,
      description: "• Spearheaded deployment of centralized analytical reporting architectures, reducing cross-department data parsing loops by 45%.\n• Designed scalable machine-learning models to forecast shifting customer lifecycles, protecting multi-million rupee revenue streams.\n• Directed data translation protocols for 4 separate engineering pipelines to secure unified reporting governance."
    },
    {
      id: "2",
      jobTitle: "Senior Data Operations Analyst",
      employer: "Vanguard Global Digital Matrix",
      city: "Bengaluru",
      country: "India",
      startDate: "May 2021",
      endDate: "Oct 2023",
      isCurrent: false,
      description: "• Architected dynamic data warehouse routing systems, shortening standard weekly extraction intervals down from 14 hours to 4 hours.\n• Interfaced localized reporting clusters with enterprise dashboard matrices to improve logistical clarity across branches.\n• Coordinated with business infrastructure pods to build responsive continuous analytics loops for live deployment strategies."
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
      { id: Date.now().toString(), title: "NEW MAIN SECTION", content: "" },
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
  // TYPOGRAPHIC ACCENT EDITORIAL TEMPLATE
  // ============================================
  const renderResumePreview = (innerRef?: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#0f172a] shadow-2xl p-10 flex flex-col overflow-hidden shrink-0 font-serif border border-slate-200"
      style={{ letterSpacing: "normal" }}
    >
      {/* MINIMAL HIGH-END TYPOGRAPHY HEADER */}
      <div className="w-full flex justify-between items-baseline mb-3">
        <div>
          <h1 className="text-4xl font-light tracking-wide text-[#0f172a]">
            {name || "YOUR NAME"}
          </h1>
          <p className="text-[#4338ca] text-[12px] uppercase font-bold tracking-widest mt-1 font-sans">
            {experiences[0]?.jobTitle || "Professional Title Placement"}
          </p>
        </div>
        <div className="text-right text-[11px] text-[#475569] space-y-0.5 font-sans font-medium">
          <p>{email || "name@example.com"}</p>
          <p>{phone || "+91 00000 00000"}</p>
          <p>{address || "City, State, Country Location"}</p>
        </div>
      </div>

      {/* TYPOGRAPHIC DECORATIVE SOLID ACCENT RULE */}
      <div className="w-full h-[3px] bg-[#4338ca] mb-6"></div>

      {/* ASYMMETRIC CONTENT WRAPPER */}
      <div className="w-full flex flex-row gap-8 flex-1 overflow-hidden">
        
        {/* LEFT MAIN PANE: PROFESSIONAL HISTORY & OBJECTIVE (62% Width) */}
        <div className="w-[62%] flex flex-col gap-6 overflow-hidden text-justify">
          <div>
            <h2 className="text-[13px] font-bold text-[#4338ca] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5 font-sans">
              Executive Profile
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11.5px] whitespace-pre-wrap">
              {objective || "Write your core competitive professional description summary statement here."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold text-[#4338ca] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-3.5 font-sans">
              Employment History
            </h2>
            <div className="flex flex-col gap-4.5">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-[11.5px] mb-4">
                  <div className="flex justify-between items-baseline font-bold text-[#0f172a]">
                    <span className="text-[13px] text-[#0f172a] font-bold">{exp.jobTitle || "Job Designation Title"}</span>
                    <span className="text-[10.5px] font-medium text-[#64748b] font-sans">{exp.startDate || "Start"} – {exp.isCurrent ? "Present" : (exp.endDate || "End")}</span>
                  </div>
                  <div className="text-[#4338ca] font-semibold text-[11px] font-sans mt-0.5">
                    {exp.employer || "Employer/Company Organization"} {exp.city && `| ${exp.city}`}
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

          {/* DYNAMIC LEFT MAIN SECTIONS */}
          {mainSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-[13px] font-bold text-[#4338ca] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5 font-sans">
                {sec.title}
              </h2>
              <p className="text-[#334155] leading-relaxed text-[11.5px] whitespace-pre-wrap">
                {sec.content}
              </p>
            </div>
          ))}

          {/* DECLARATION FIELD PANEL */}
          {declaration && (
            <div className="mt-auto pt-3 border-t border-[#f1f5f9]">
              <p className="text-[10.5px] text-[#64748b] italic whitespace-pre-wrap leading-relaxed">
                {declaration}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SUB PANE: INSTITUTIONAL & META CRITERIA (38% Width) */}
        <div className="w-[38%] flex flex-col gap-6 overflow-hidden">
          <div>
            <h2 className="text-[13px] font-bold text-[#0f172a] border-b-2 border-[#4338ca] pb-0.5 uppercase tracking-wider mb-3 font-sans">
              Education & Background
            </h2>
            <div className="flex flex-col gap-3.5">
              {educations.map((edu) => (
                <div key={edu.id} className="text-[11px] leading-normal">
                  <div className="flex justify-between items-baseline font-bold text-[#0f172a]">
                    <span className="text-[12px] text-[#0f172a] font-bold">{edu.degree || "Degree Title Standard"}</span>
                    <span className="text-[10px] font-medium text-[#64748b] font-sans">{edu.graduationDate || "Year"}</span>
                  </div>
                  <div className="text-[#475569] font-medium mt-0.5 text-[11px]">
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

          {/* DYNAMIC RIGHT SIDEBAR SECTIONS */}
          {sidebarSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-[13px] font-bold text-[#0f172a] border-b-2 border-[#4338ca] pb-0.5 uppercase tracking-wider mb-2.5 font-sans">
                {sec.title}
              </h2>
              <p className="text-[#334155] leading-loose text-[11px] font-medium whitespace-pre-wrap font-sans">
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
      
      {/* APPLICATION HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Typographic Editorial
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

      {/* DASHBOARD GRID PLACEMENT STAGE */}
      <div className="max-w-[1600px] w-full mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 lg:h-[85vh]">
        
        {/* LEFT COLUMN FIELDS CONTROLLER EDITOR PANEL */}
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
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 h-24 resize-none" value={address} onChange={(e) => setAddress(e.target.value)} />
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
            
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Dynamic Left Sections (Main)</h2>
            <p className="text-sm text-slate-500 mb-4">Add, rename, or delete sections that appear in the wide left column (e.g. Projects, Profile, Work History).</p>
            
            <div className="space-y-8">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Executive Profile Summary</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 h-32 resize-y" value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>

              {/* DYNAMIC EXPERIENCE PROGRESSION CHRONOLOGY CONFIG NODE */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Employment History</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company/Corporate Identifier</label>
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
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Responsibilities / Key Items Achieved</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-32 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold py-2 px-1 transition-colors"><Plus className="w-4 h-4" /> Add Professional Block</button>
              </div>

              {/* DYNAMIC LEFT MAIN SECTIONS */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
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
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Title</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleMainSectionChange(sec.id, "title", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase font-semibold text-slate-900"
                        placeholder="e.g. PUBLICATIONS, AWARDS"
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
                  <Plus className="w-4 h-4" /> Add Left Column Section
                </button>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-600">Declaration Statement</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-20 resize-y text-slate-900" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              </div>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Dynamic Right Sections (Sidebar)</h2>
            <p className="text-sm text-slate-500 mb-4">Add, rename, or delete sections that appear in the narrower right column (e.g. Education, Skills, Languages).</p>

            <div className="space-y-8">
              {/* DYNAMIC EDUCATION NODE BUILDER COMPONENT */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Education Details</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">University / Institute Name</label>
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
                  <Plus className="w-4 h-4" /> Add Right Column Section
                </button>
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
              Build an elegant, typography-focused editorial resume in minutes. No design skills required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Edit3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Add Custom Columns</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Use the left-hand dashboard to enter your info. You can add "Left Sections" for large text areas or "Right Sections" to populate the narrower technical column.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Live Formatting</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Watch your resume build itself in real-time. The layout automatically handles spacing, serif typography styling, and clean borders for a premium editorial look.
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
                    Yes! You can completely delete default sections like "Languages" or "Certifications" by clicking the red trash can icon inside the editor block.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I create my own categories?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Absolutely. Use the "+ Add Left Column Section" or "+ Add Right Column Section" buttons to create and name completely custom fields tailored to your career.
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
                    Yes. Despite its elegant visual nature, this template uses standard text layout rules and heading tags that modern Applicant Tracking Systems (ATS) can easily parse.
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
        <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl p-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
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