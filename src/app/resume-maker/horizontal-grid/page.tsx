"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
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

export default function ResumeMakerRowGrid() {
  // ============================================
  // STATES PRE-FILLED WITH CREATIVE EXAMPLES
  // ============================================
  const [name, setName] = useState("ROHAN MEHTA");
  const [address, setAddress] = useState("402, Supreme Heights, Powai, Mumbai 400076");
  const [phone, setPhone] = useState("+91 91234 56789");
  const [email, setEmail] = useState("rohan.mehta.pjm@gmail.com");
  const [objective, setObjective] = useState(
    "Data-driven Product Project Manager with 5+ years of experience leading cross-functional teams to build, scale, and optimize consumer-facing software solutions. Expert in backlog grooming, continuous development sprints, and bridging communication gaps between business development and technical implementation squads."
  );
  const [skills, setSkills] = useState(
    "• Agile & Scrum Frameworks  • Product Roadmap Design  • User Analytics & KPI Tracking  • SQL & Tableau Reporting  • JIRA & Confluence Management  • Cross-functional Leadership  • A/B Testing Architectures  • UI/UX Optimization Sprints"
  );
  const [interests, setInterests] = useState("• Mentoring Junior Product Managers • Organizing Tech Hackathons • Strategy Board Games");
  const [languages, setLanguages] = useState("• English (Bilingual Proficiency)  • Hindi (Native)  • Marathi (Conversational)");
  const [certifications, setCertifications] = useState(
    "• Certified Scrum Product Owner (CSPO) – Scrum Alliance\n• Product Management Executive Certificate – Product School\n• Google Advanced Data Analytics Professional Badge"
  );
  const [declaration, setDeclaration] = useState("I hereby declare that all information presented in this record is completely true and correct.");

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
  // ROW-BASED ACCENT GRID TEMPLATE
  // ============================================
  const ResumePreviewContent = ({ innerRef }: { innerRef?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#1e293b] shadow-2xl p-10 flex flex-col overflow-hidden shrink-0 font-sans"
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
        
        {/* ROW 1: PROFILE SUMMARY */}
        <div className="w-full flex py-4 border-t border-[#e2e8f0]">
          <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
            About Me
          </div>
          <div className="w-[78%] text-[#334155] leading-relaxed text-[11.5px] text-justify whitespace-pre-wrap">
            {objective || "Write a powerful description summary details segment here."}
          </div>
        </div>

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

        {/* ROW 4: SKILLS GRID AREA */}
        <div className="w-full flex py-4 border-t border-[#e2e8f0]">
          <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
            Core Skills
          </div>
          <div className="w-[78%] text-[#334155] leading-loose text-[11px] font-medium whitespace-pre-wrap">
            {skills || "List competencies keys across horizontally separated text structures."}
          </div>
        </div>

        {/* ROW 5: CERTIFICATIONS SUMMARY */}
        <div className="w-full flex py-4 border-t border-[#e2e8f0]">
          <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
            Credentials
          </div>
          <div className="w-[78%] text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
            {certifications || "List additional professional micro-credentials or certifications entries."}
          </div>
        </div>

        {/* ROW 6: COMPLEMENTARY META INFO SPOKEN */}
        <div className="w-full flex py-4 border-t border-[#e2e8f0]">
          <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
            Languages
          </div>
          <div className="w-[78%] text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
            {languages || "Languages speaking abilities data details."}
          </div>
        </div>

        {/* ROW 7: PROJECTS & HIGHLIGHTS */}
        <div className="w-full flex py-4 border-t border-[#e2e8f0]">
          <div className="w-[22%] text-[#0f172a] font-extrabold text-[12.5px] uppercase tracking-wider pt-0.5">
            Interests
          </div>
          <div className="w-[78%] text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap">
            {interests || "Additional project links or personal hobbies elements documentation."}
          </div>
        </div>

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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500/30 overflow-x-hidden relative">
      
      {/* HIDDEN PRINT TARGET ENGINE STORAGE */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <ResumePreviewContent innerRef={resumeRef} />
      </div>
      
      {/* TOP HEADER */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          Horizontal Accent Grid Mode
        </h1>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="hidden lg:flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
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
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 h-[calc(100vh-73px)]">
        
        {/* INPUT COMPONENT BUILDERS CONTROLLERS PANEL */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <h2 className="text-2xl font-semibold mb-6">Personal Attributes Data</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Full Profile Name</label>
                <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none transition-all" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Current Corporate Address Line</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none h-20 resize-none" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Mobile Phone Line</label>
                <input type="text" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Professional Email</label>
                <input type="email" className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <hr className="border-slate-800 my-8" />
            <h2 className="text-2xl font-semibold mb-6">Resume Core Configuration Anchors</h2>

            <div className="space-y-8">
              <div>
                <label className="block mb-1 text-sm text-slate-400">Summary Objective Profile</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none h-24 resize-y" value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>

              {/* DYNAMIC EDUCATION SECTION BUILDER ACCORDIONS */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Education Chronology Details</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">University / Academic Institution Name</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Degree Title Achieved</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Graduation Timeline Passing Year</label>
                        <input type="text" value={edu.graduationDate} onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Core Info Academic descriptions</label>
                        <textarea value={edu.description} onChange={(e) => handleEduChange(edu.id, "description", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-16 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-teal-400 font-medium py-1"><Plus className="w-4 h-4" /> Add Academic Node</button>
              </div>

              {/* DYNAMIC WORK EXPERIENCE TIMELINE BUILDER */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Work Experience Placements chronology</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Company/Corporate Identifier</label>
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
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)} className="w-4 h-4 bg-slate-900 accent-teal-500" />
                        <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-300 cursor-pointer">Active Ongoing Position</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Responsibilities / Key Items Achieved</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-24 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-teal-400 font-medium py-1"><Plus className="w-4 h-4" /> Add Professional Block</button>
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-400">Core Expertise Skills</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none h-24 resize-y" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Professional Certifications Credentials</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none h-24 resize-y" value={certifications} onChange={(e) => setCertifications(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Languages Spoken</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none h-16 resize-y" value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Awards & Highlights Interests</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none h-20 resize-y" value={interests} onChange={(e) => setInterests(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Declaration Statement</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 outline-none h-16 resize-y" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              </div>
            </div>
            <div className="h-20 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP DISPLAY CANVAS BOX PANEL */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-800 rounded-2xl overflow-auto border border-slate-700 relative items-start justify-center p-8 custom-scrollbar">
          <div className="origin-top scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9] transition-transform duration-300 flex justify-center">
            <ResumePreviewContent />
          </div>
        </div>
      </div>

      {/* MOBILE INTERFACE DISPLAY FOOTER ACTION POPUPS */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
        <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl p-4 rounded-xl font-semibold flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" /> Preview Export Page
        </button>
      </div>

      {/* MOBILE FULL MODAL DISPLAY CHANNELS */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
            <button onClick={() => setIsPreviewOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-300"><X className="w-5 h-5" /></button>
            <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-2 bg-teal-600 px-4 py-2 rounded-lg font-medium">
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