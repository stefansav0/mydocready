"use client";

import { useState, useRef } from "react";
import { Eye, Download, X, UploadCloud, Plus, Trash2 } from "lucide-react";

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
  const [skills, setSkills] = useState(
    "• ReactJS & Next.js\n• TypeScript & JavaScript\n• Node.js & Express\n• Tailwind CSS & UI Design\n• PostgreSQL & MongoDB\n• Git & CI/CD Pipelines\n• REST APIs & GraphQL\n• Agile Methodologies"
  );
  const [interests, setInterests] = useState("• Technical Writing & Mentorship\n• Competitive Coding\n• UI/UX Interaction Design");
  const [languages, setLanguages] = useState("• English (Fluent)\n• Hindi (Native)");
  const [certifications, setCertifications] = useState(
    "• AWS Certified Cloud Practitioner\n• Meta Front-End Developer Certificate\n• Advanced Data Structures Mastery"
  );
  const [declaration, setDeclaration] = useState("I hereby declare that all the information stated above is accurate to the best of my knowledge.");

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
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#1e293b] shadow-2xl flex flex-col overflow-hidden shrink-0 font-sans"
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

      {/* HORIZONTAL EMERALD/INDIGO DECORATIVE TOP ACCENT LINE */}
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

        {/* RIGHT COLUMN: TECHNICAL AND COMPLEMENTARY SIDEBAR (37% Width) */}
        <div className="w-[37%] bg-[#f8fafc] border-l border-[#e2e8f0] p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-[13px] font-bold text-[#1e293b] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5">
              Technical Expertise
            </h2>
            <p className="text-[#334155] leading-loose text-[11px] whitespace-pre-wrap">
              {skills || "Core skill elements list summary."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold text-[#1e293b] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5">
              Certifications
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
              {certifications || "Certificates highlights go here."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold text-[#1e293b] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5">
              Languages Spoken
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
              {languages || "Languages list inputs."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold text-[#1e293b] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5">
              Interests & Projects
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
              {interests || "Complementary data info points."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-sky-500/30 overflow-x-hidden relative">
      
      {/* HIDDEN PRINT TARGET ENGINE OVERLAYS */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        {renderResumePreview(resumeRef)}
      </div>
      
      {/* STICKY APPLICATION NAVIGATION BAR */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
          Modern Dynamic Layout Mode
        </h1>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="hidden lg:flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
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
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 h-[calc(100vh-73px)]">
        
        {/* INPUT FORM FIELDS EDITOR CONTAINER */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <h2 className="text-2xl font-semibold mb-6">Personal Identifiers</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Full Profile Name</label>
                <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none transition-all" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Current Contact Address</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none h-20 resize-none" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Mobile Phone Line</label>
                <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Professional Email</label>
                <input type="email" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <hr className="border-slate-800 my-8" />
            <h2 className="text-2xl font-semibold mb-6">Professional Matrix Subcategories</h2>

            <div className="space-y-8">
              <div>
                <label className="block mb-1 text-sm text-slate-400">Executive Summary Profile</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none h-24 resize-y" value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>

              {/* DYNAMIC EDUCATION COMPONENT PANEL */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Education Placements</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">University / Institute</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Degree Received</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Graduation Timeline Info</label>
                        <input type="text" value={edu.graduationDate} onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Coursework Description</label>
                        <textarea value={edu.description} onChange={(e) => handleEduChange(edu.id, "description", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-16 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-sky-400 font-medium py-1"><Plus className="w-4 h-4" /> Add Academic Node</button>
              </div>

              {/* DYNAMIC WORK TIMELINE PLACEMENT COMPONENT */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Work Experience Chronology</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Company/Corporate Title</label>
                        <input type="text" value={exp.employer} onChange={(e) => handleExpChange(exp.id, "employer", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Role Designation</label>
                        <input type="text" value={exp.jobTitle} onChange={(e) => handleExpChange(exp.id, "jobTitle", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => handleExpChange(exp.id, "startDate", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">End Date</label>
                        <input type="text" disabled={exp.isCurrent} value={exp.isCurrent ? "Present" : exp.endDate} onChange={(e) => handleExpChange(exp.id, "endDate", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none disabled:opacity-40" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)} className="w-4 h-4 bg-slate-900 accent-sky-500" />
                        <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-300 cursor-pointer">Active Ongoing Position</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Responsibilities / Key Items Achieved</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-24 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-sky-400 font-medium py-1"><Plus className="w-4 h-4" /> Add Professional Block</button>
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-400">Technical Skillset Matrix</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none h-24 resize-y" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Professional Certifications</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none h-24 resize-y" value={certifications} onChange={(e) => setCertifications(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Languages</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none h-16 resize-y" value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Projects & Affiliations</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none h-20 resize-y" value={interests} onChange={(e) => setInterests(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Declaration Statement</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-sky-500 outline-none h-16 resize-y" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              </div>
            </div>
            <div className="h-20 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP INTERACTIVE DISPLAY CANVAS */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-800 rounded-2xl overflow-auto border border-slate-700 relative items-start justify-center p-8 custom-scrollbar">
          <div className="origin-top scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9] transition-transform duration-300 flex justify-center">
            {renderResumePreview()}
          </div>
        </div>
      </div>

      {/* MOBILE DISPLAY CONTROLS LAYER */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
        <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-xl p-4 rounded-xl font-semibold flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" /> Preview Export Page
        </button>
      </div>

      {/* MOBILE FULLSCREEN DIALOG VIEWPORTS */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
            <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-300"><X className="w-5 h-5" /></button>
            <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-2 bg-sky-600 px-4 py-2 rounded-lg font-medium">
              {isDownloading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
              Save Document
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-800 custom-scrollbar">
            <div className="origin-top scale-[0.4] sm:scale-[0.6] transition-transform">
              {renderResumePreview()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
