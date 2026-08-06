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

export default function ResumeMakerRowGrid() {
  // ============================================
  // STATES PRE-FILLED WITH CREATIVE EXAMPLES
  // ============================================
  const [name, setName] = useState("ROHAN MEHTA");
  const [address, setAddress] = useState("402, Supreme Heights, Powai, Mumbai 400076");
  const [phone, setPhone] = useState("+91 91234 56789");
  const [email, setEmail] = useState("rohan.mehta.pjm@gmail.com");
  const [declaration, setDeclaration] = useState("I hereby declare that all information presented in this record is completely true and correct.");

  // DYNAMIC CUSTOM SECTIONS (Row-based)
  // Note: The first item in this array will be placed above Experience. The rest will go below Education.
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    {
      id: "sec-1",
      title: "ABOUT ME",
      content: "Data-driven Product Project Manager with 5+ years of experience leading cross-functional teams to build, scale, and optimize consumer-facing software solutions. Expert in backlog grooming, continuous development sprints, and bridging communication gaps between business development and technical implementation squads.",
    },
    {
      id: "sec-2",
      title: "CORE SKILLS",
      content: "• Agile & Scrum Frameworks  • Product Roadmap Design  • User Analytics & KPI Tracking  • SQL & Tableau Reporting  • JIRA & Confluence Management  • Cross-functional Leadership  • A/B Testing Architectures  • UI/UX Optimization Sprints",
    },
    {
      id: "sec-3",
      title: "CREDENTIALS",
      content: "• Certified Scrum Product Owner (CSPO) – Scrum Alliance\n• Product Management Executive Certificate – Product School\n• Google Advanced Data Analytics Professional Badge",
    },
    {
      id: "sec-4",
      title: "LANGUAGES",
      content: "• English (Bilingual Proficiency)  • Hindi (Native)  • Marathi (Conversational)",
    },
    {
      id: "sec-5",
      title: "INTERESTS",
      content: "• Mentoring Junior Product Managers • Organizing Tech Hackathons • Strategy Board Games",
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      schoolName: "Indian Institute of Management (IIM)",
      schoolLocation: "Indore, India",
      degree: "MBA - Post Graduate Program in Management",
      fieldOfStudy: "Marketing & Strategy",
      graduationDate: "Batch of 2021",
      isEnrolled: false,
      description: "Specialized in Digital Product Marketing Strategy and Operational Analytics. Secured 2nd place in the National Annual Case Study Challenge."
    }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      jobTitle: "Product Project Manager",
      employer: "FinTech Pulse Systems",
      city: "Mumbai",
      country: "India",
      startDate: "Nov 2023",
      endDate: "Present",
      isCurrent: true,
      description: "• Directed lifecycle features for digital wallet updates, increasing active monthly user retention by 22%.\n• Managed comprehensive user behavior maps to reorganize drop-off transaction routes across platforms.\n• Synced product deliverables across 3 distributed engineering groups using automated delivery metrics."
    },
    {
      id: "2",
      jobTitle: "Associate Project Lead",
      employer: "EduSphere Digital Labs",
      city: "Bengaluru",
      country: "India",
      startDate: "May 2021",
      endDate: "Oct 2023",
      isCurrent: false,
      description: "• Coordinated multi-tier rollout sprints for cloud learning systems serving over 100k active subscribers.\n• Implemented continuous feedback tracking methods reducing reported platform errors by 40% in 6 months.\n• Partnered with creative UI designers to deploy micro-interaction workflows improving signup conversion rates."
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

  // Custom Sections Handlers
  const handleCustomSectionChange = (id: string, field: keyof CustomSection, value: string) => {
    setCustomSections(
      customSections.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };
  const addCustomSection = () => {
    setCustomSections([
      ...customSections,
      { id: Date.now().toString(), title: "NEW ROW SECTION", content: "" },
    ]);
  };
  const removeCustomSection = (id: string) => {
    setCustomSections(customSections.filter((sec) => sec.id !== id));
  };

  // Education Handlers
  const handleEduChange = (id: string, field: keyof Education, value: any) => {
    setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };
  const addEducation = () => setEducations([...educations, { id: Date.now().toString(), schoolName: "", schoolLocation: "", degree: "", fieldOfStudy: "", graduationDate: "", isEnrolled: false, description: "" }]);
  const removeEducation = (id: string) => setEducations(educations.filter(edu => edu.id !== id));

  // Experience Handlers
  const handleExpChange = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };
  const addExperience = () => setExperiences([...experiences, { id: Date.now().toString(), jobTitle: "", employer: "", city: "", country: "", startDate: "", endDate: "", isCurrent: false, description: "" }]);
  const removeExperience = (id: string) => setExperiences(experiences.filter(exp => exp.id !== id));

  // ============================================
  // ROW-BASED ACCENT GRID TEMPLATE
  // ============================================
  const renderResumePreview = (innerRef?: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#1e293b] shadow-2xl p-10 flex flex-col overflow-hidden shrink-0 font-sans border border-slate-200"
      style={{ letterSpacing: "normal" }}
    >
      {/* ASYMMETRIC TOP HEADER SECTION */}
      <div className="w-full flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#0f172a]">
            {name || "YOUR NAME"}
          </h1>
          <p className="text-[#0d9488] font-bold text-sm uppercase tracking-wider mt-1">
            {experiences[0]?.jobTitle || "Professional Field Placement"}
          </p>
        </div>
        <div className="text-right text-[11.5px] text-[#475569] space-y-0.5 font-medium">
          <p className="flex items-center justify-end gap-1">{email || "your.email@domain.com"}</p>
          <p>{phone || "+91 00000 00000"}</p>
          <p>{address || "City, State, Country Address Location"}</p>
        </div>
      </div>

      {/* HORIZONTAL GRID SECTION BLOCKS */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* ROW 1: TOP DYNAMIC SECTION (Usually About Me) */}
        {customSections.length > 0 && (
          <div className="w-full flex py-4 border-t border-[#e2e8f0]">
            <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
              {customSections[0].title}
            </div>
            <div className="w-[78%] text-[#334155] leading-relaxed text-[11.5px] text-justify whitespace-pre-wrap">
              {customSections[0].content}
            </div>
          </div>
        )}

        {/* ROW 2: CORE EXPERIENCE MATRIX */}
        <div className="w-full flex py-4 border-t border-[#e2e8f0]">
          <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
            Experience
          </div>
          <div className="w-[78%] flex flex-col gap-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="text-[11px] leading-normal">
                <div className="flex justify-between items-baseline font-bold text-[#0f172a]">
                  <span className="text-[13px] font-extrabold text-[#0f172a]">{exp.jobTitle || "Job Title"}</span>
                  <span className="text-[11px] font-medium text-[#64748b]">{exp.startDate || "Start"} – {exp.isCurrent ? "Present" : (exp.endDate || "End")}</span>
                </div>
                <div className="text-[#0d9488] font-bold text-[11.5px] mt-0.5">
                  {exp.employer || "Employer Enterprise"} {exp.city && `| ${exp.city}`}
                </div>
                {exp.description && (
                  <p className="mt-2 text-[#334155] leading-relaxed whitespace-pre-wrap text-[11.5px]">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: ACADEMIC EDUCATION */}
        <div className="w-full flex py-4 border-t border-[#e2e8f0]">
          <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
            Education
          </div>
          <div className="w-[78%] flex flex-col gap-4">
            {educations.map((edu) => (
              <div key={edu.id} className="text-[11px] leading-normal">
                <div className="flex justify-between items-baseline font-bold text-[#0f172a]">
                  <span className="text-[12.5px] text-[#0f172a]">{edu.degree || "Degree Standard Target"}</span>
                  <span className="text-[11px] font-medium text-[#64748b]">{edu.graduationDate || "Graduation Timeline"}</span>
                </div>
                <div className="text-[#475569] font-semibold text-[11.5px] mt-0.5">
                  {edu.schoolName} {edu.fieldOfStudy && `– ${edu.fieldOfStudy}`}
                </div>
                {edu.description && (
                  <p className="mt-1.5 text-[#475569] leading-relaxed whitespace-pre-wrap text-[11px]">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4+: REMAINING DYNAMIC SECTIONS */}
        {customSections.slice(1).map((sec) => (
          <div key={sec.id} className="w-full flex py-4 border-t border-[#e2e8f0]">
            <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
              {sec.title}
            </div>
            <div className="w-[78%] text-[#334155] leading-relaxed text-[11px] font-medium whitespace-pre-wrap">
              {sec.content}
            </div>
          </div>
        ))}

        {/* FINAL CLOSURE FOOTER UNDER DECLARATION */}
        {declaration && (
          <div className="w-full flex mt-auto pt-4 border-t border-[#e2e8f0]">
            <div className="w-[22%]"></div>
            <div className="w-[78%] text-[10px] text-[#64748b] italic leading-normal whitespace-pre-wrap">
              {declaration}
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-100 overflow-x-hidden relative font-sans flex flex-col">
      
      {/* HIDDEN PRINT TARGET */}
      <div className="fixed top-0 left-[-9999px] -z-50 pointer-events-none">
        {renderResumePreview(resumeRef)}
      </div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Row Grid Template <span className="text-teal-600">Builder</span>
        </h1>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="hidden lg:flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
        >
          {isDownloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </header>

      {/* DASHBOARD WORKSPACE GRID PANEL SETUP */}
      <div className="max-w-[1600px] w-full mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 lg:h-[85vh]">
        
        {/* INPUT COMPONENT BUILDERS CONTROLLERS PANEL */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 overflow-y-auto h-[70vh] lg:h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Personal Attributes Data</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Full Profile Name</label>
                <input type="text" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 font-medium" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Current Corporate Address Line</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 h-24 resize-none" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Mobile Phone Line</label>
                <input type="text" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Professional Email</label>
                <input type="email" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Dynamic Text Rows</h2>
            <p className="text-sm text-slate-500 mb-4">Add, rename, or delete any sections you want to appear as rows (e.g. Profile, Skills, Certifications). <br/><br/><strong>Note:</strong> The first block in this list will automatically appear at the top of the resume. The rest will appear below your Education.</p>
            
            {/* DYNAMIC CUSTOM SECTIONS */}
            <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
              {customSections.map((sec, index) => (
                <div key={sec.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                  <button
                    onClick={() => removeCustomSection(sec.id)}
                    className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-wide">
                    {index === 0 ? "Top Section" : `Bottom Section ${index}`}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Row Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleCustomSectionChange(sec.id, "title", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 uppercase font-semibold"
                      placeholder="e.g. SKILLS, AWARDS, PROJECTS"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Row Content</label>
                    <textarea
                      value={sec.content}
                      onChange={(e) => handleCustomSectionChange(sec.id, "content", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 h-28 resize-y text-sm"
                      placeholder="Enter the section details..."
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addCustomSection}
                className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-bold py-2 px-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Custom Text Row
              </button>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Main Experience & Education</h2>

            <div className="space-y-8">
              {/* DYNAMIC WORK EXPERIENCE TIMELINE BUILDER */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Work Experience Placements chronology</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company/Corporate Identifier</label>
                        <input type="text" value={exp.employer} onChange={(e) => handleExpChange(exp.id, "employer", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role Designation Title</label>
                        <input type="text" value={exp.jobTitle} onChange={(e) => handleExpChange(exp.id, "jobTitle", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">City</label>
                        <input type="text" value={exp.city} onChange={(e) => handleExpChange(exp.id, "city", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" placeholder="e.g. New York" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Country</label>
                        <input type="text" value={exp.country} onChange={(e) => handleExpChange(exp.id, "country", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => handleExpChange(exp.id, "startDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">End Date</label>
                        <input type="text" disabled={exp.isCurrent} value={exp.isCurrent ? "Present" : exp.endDate} onChange={(e) => handleExpChange(exp.id, "endDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none disabled:opacity-50 disabled:bg-slate-100" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                        <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-600 cursor-pointer">Active Ongoing Position</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Responsibilities / Key Items Achieved</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 h-32 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-bold py-2 px-1 transition-colors"><Plus className="w-4 h-4" /> Add Professional Block</button>
              </div>

              {/* DYNAMIC EDUCATION SECTION BUILDER ACCORDIONS */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Education Chronology Details</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">University / Academic Institution Name</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location (City, Country)</label>
                        <input type="text" value={edu.schoolLocation} onChange={(e) => handleEduChange(edu.id, "schoolLocation", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Degree Title Achieved</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Graduation Timeline Passing Year</label>
                        <input type="text" value={edu.graduationDate} onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Core Info Academic descriptions</label>
                        <textarea value={edu.description} onChange={(e) => handleEduChange(edu.id, "description", e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 h-20 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-bold py-2 px-1 transition-colors"><Plus className="w-4 h-4" /> Add Academic Node</button>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-600">Declaration Statement</label>
                <textarea className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 h-20 resize-y" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              </div>
            </div>
            <div className="h-24 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP DISPLAY CANVAS BOX PANEL */}
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
              Build a customizable, industry-standard resume in minutes. No design skills required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Edit3 className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Add Custom Rows</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Use the left-hand dashboard to enter your personal information, work experience, education, and completely custom row-sections (like Skills or Projects). Add or delete blocks as needed.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Live Preview</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Watch your resume build itself in real-time on the right. The formatting is handled automatically to ensure a clean, perfectly aligned professional grid look.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Download className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Download PDF</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Once you are satisfied with the customized layout, simply click the download button to instantly export a high-quality, print-ready PDF file straight to your device.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-teal-600" />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I delete sections I don't need?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Yes! The new dynamic editor lets you permanently remove any default sections you don't require by clicking the red trash can icon in the top right of each block.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I create my own categories?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Absolutely. Just click the "+ Add Custom Text Row" button under the Dynamic Text Rows area. You can title it whatever you want (e.g. "Volunteer Work" or "Projects").
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Is the resulting PDF ATS-friendly?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Yes. This grid-based template is specifically designed using clean horizontal rows without complex hidden tables, making it highly readable for Applicant Tracking Systems (ATS) used by recruiters.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Is my personal data saved on your servers?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    No. All the processing and rendering happens locally inside your web browser. We do not store, track, or upload your personal resume data to any external servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE INTERFACE DISPLAY FOOTER ACTION POPUPS */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl p-4 rounded-xl font-bold flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" /> Preview & Download
        </button>
      </div>

      {/* MOBILE FULL MODAL DISPLAY CHANNELS */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shadow-sm">
            <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm">
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