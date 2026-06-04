"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

export default function ResumeMakerTypographic() {
  // ============================================
  // STATES PRE-FILLED WITH TYPOGRAPHIC EXAMPLES
  // ============================================
  const [name, setName] = useState("KABIR MALHOTRA");
  const [address, setAddress] = useState("704, Windsor Towers, Hiranandani, Powai, Mumbai 400076");
  const [phone, setPhone] = useState("+91 98111 22233");
  const [email, setEmail] = useState("kabir.malhotra.data@gmail.com");
  const [objective, setObjective] = useState(
    "Senior Business Intelligence Architect and Analytics Director with over 6 years of expertise leading corporate data strategy initiatives. Specialized in cross-functional data pipeline modeling, predictive analytics architectures, and deploying visual reporting governance structures that convert complex enterprise data into clean, actionable revenue streams."
  );
  const [skills, setSkills] = useState(
    "• Business Intelligence & Analytics\n• Data Architecture & Modeling\n• Advanced SQL & Python Execution\n• Tableau & Power BI Governance\n• Cross-functional Strategy Sprints\n• Predictive Data Forecasting\n• ETL Pipeline Infrastructures\n• Executive Stakeholder Relations"
  );
  const [interests, setInterests] = useState("• Technical Mentorship Systems • Financial Market Analysis • Strategic Chess Formations");
  const [languages, setLanguages] = useState("• English (Native/Fluent Proficiency)\n• Hindi (Native Speaker)\n• Spanish (Basic Working Framework)");
  const [certifications, setCertifications] = useState(
    "• Certified Business Intelligence Professional (CBIP)\n• Snowflake Core Data Engineer Certificate\n• Google Advanced Cloud Data Analytics Badge"
  );
  const [declaration, setDeclaration] = useState("I hereby declare that all the professional and academic records stated above are authentic and true.");

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
  // TYPOGRAPHIC ACCENT EDITORIAL TEMPLATE
  // ============================================
  const ResumePreviewContent = ({ innerRef }: { innerRef?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#0f172a] shadow-2xl p-10 flex flex-col overflow-hidden shrink-0 font-serif"
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
                <div key={exp.id} className="text-[11.5px]">
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

          <div>
            <h2 className="text-[13px] font-bold text-[#0f172a] border-b-2 border-[#4338ca] pb-0.5 uppercase tracking-wider mb-2.5 font-sans">
              Core Competencies
            </h2>
            <p className="text-[#334155] leading-loose text-[11px] font-medium whitespace-pre-wrap">
              {skills || "Skills mapping specifications items list summary."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold text-[#0f172a] border-b-2 border-[#4338ca] pb-0.5 uppercase tracking-wider mb-2.5 font-sans">
              Certifications
            </h2>
            <p className="text-[#334155] leading-relaxed text-[10.5px] whitespace-pre-wrap">
              {certifications || "Additional training credentials profile blocks."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold text-[#0f172a] border-b-2 border-[#4338ca] pb-0.5 uppercase tracking-wider mb-2.5 font-sans">
              Languages Spoken
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
              {languages || "Languages list identifiers inputs."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold text-[#0f172a] border-b-2 border-[#4338ca] pb-0.5 uppercase tracking-wider mb-2.5 font-sans">
              Interests & Research
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
              {interests || "Additional projects links or personal hobbies elements metrics."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* HIDDEN PRINT TARGET STORAGE */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <ResumePreviewContent innerRef={resumeRef} />
      </div>
      
      {/* APPLICATION HEADER */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Typographic Accent Mode
        </h1>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="hidden lg:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
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
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 h-[calc(100vh-73px)]">
        
        {/* LEFT COLUMN FIELDS CONTROLLER EDITOR PANEL */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <h2 className="text-2xl font-semibold mb-6">Personal Identifiers</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Full Profile Name</label>
                <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none transition-all" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Current Contact Address Line</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-20 resize-none" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Mobile Phone Line</label>
                <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Professional Email</label>
                <input type="email" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <hr className="border-slate-800 my-8" />
            <h2 className="text-2xl font-semibold mb-6">Resume Core Category Anchors</h2>

            <div className="space-y-8">
              <div>
                <label className="block mb-1 text-sm text-slate-400">Executive Profile Summary</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y" value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>

              {/* DYNAMIC EDUCATION NODE BUILDER COMPONENT */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Education Placements Chronology</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">University / Institute Name</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Degree Received</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Graduation Date/Year info</label>
                        <input type="text" value={edu.graduationDate} onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Coursework Description</label>
                        <textarea value={edu.description} onChange={(e) => handleEduChange(edu.id, "description", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-16 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-indigo-400 font-medium py-1"><Plus className="w-4 h-4" /> Add Academic Node</button>
              </div>

              {/* DYNAMIC EXPERIENCE TIMELINE COMPONENT PLACEMENT */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Work Experience Placements</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Company/Corporate Title</label>
                        <input type="text" value={exp.employer} onChange={(e) => handleExpChange(exp.id, "employer", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Role Designation Title</label>
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
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)} className="w-4 h-4 bg-slate-900 accent-indigo-500" />
                        <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-300 cursor-pointer">Active Ongoing Position</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Responsibilities / Key Items Achieved</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-24 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-indigo-400 font-medium py-1"><Plus className="w-4 h-4" /> Add Professional Block</button>
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-400">Technical Skillset Matrix</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Professional Certifications</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y" value={certifications} onChange={(e) => setCertifications(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Languages</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-16 resize-y" value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Projects & Affiliations</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-20 resize-y" value={interests} onChange={(e) => setInterests(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Declaration Statement</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-16 resize-y" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              </div>
            </div>
            <div className="h-20 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP DISPLAY CANVAS PANEL VIEW */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-800 rounded-2xl overflow-auto border border-slate-700 relative items-start justify-center p-8 custom-scrollbar">
          <div className="origin-top scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9] transition-transform duration-300 flex justify-center">
            <ResumePreviewContent />
          </div>
        </div>
      </div>

      {/* MOBILE DISPLAY FOOTER CONTROLS POPUP ACTIVATOR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
        <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl p-4 rounded-xl font-semibold flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" /> Preview Export Page
        </button>
      </div>

      {/* MOBILE FULL MODAL VIEWS PORTS */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
            <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-300"><X className="w-5 h-5" /></button>
            <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg font-medium">
              {isDownloading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
              Save Document
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-800 custom-scrollbar">
            <div className="origin-top scale-[0.4] sm:scale-[0.6] transition-transform">
              <ResumePreviewContent />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}