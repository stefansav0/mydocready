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
  const [skills, setSkills] = useState(
    "• UI/UX Strategy & Wireframing\n• Brand Identity Systems\n• Typography & Motion Graphics\n• Adobe Creative Suite Mastery\n• Figma Platform Architecture\n• Front-End Layout Standards\n• Leadership & Client Pitching"
  );
  const [interests, setInterests] = useState("• Modern Abstract Painting • Photography & Travel Journalism • Mentoring Aspiring Designers");
  const [languages, setLanguages] = useState("• English (Native Proficiency)\n• Hindi (Native Speaker)\n• Punjabi (Conversational)");
  const [certifications, setCertifications] = useState(
    "• Human-Computer Interaction (HCI) Certificate – Interaction Design Foundation\n• Advanced Visual Design Architecture – National Institute of Design\n• Certified Scrum Product Owner (CSPO)"
  );
  const [declaration, setDeclaration] = useState("I hereby declare that all the information provided above is authentic and correct.");

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
  // SLEEK TIMELINE PORTFOLIO LAYOUT COMPONENT
  // ============================================
  const ResumePreviewContent = ({ innerRef }: { innerRef?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#1e293b] shadow-2xl p-10 flex flex-col overflow-hidden shrink-0 font-sans"
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
        {/* Features an elegant continuous timeline tracking axis down the section blocks */}
        <div className="w-[64%] flex flex-col gap-6 overflow-hidden">
          
          {/* PROFILE CORE */}
          <div className="relative pl-6 border-l-2 border-[#6366f1]">
            {/* Timeline Node Bullet Dot Point */}
            <div className="absolute top-1.5 left-[-6px] w-[10px] h-[10px] bg-[#6366f1] rounded-full"></div>
            <h2 className="text-[13px] font-extrabold text-[#6366f1] uppercase tracking-wider mb-2 font-sans">
              Summary Statement
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11.5px] text-justify whitespace-pre-wrap">
              {objective || "Write your core competitive professional description profiling here."}
            </p>
          </div>

          {/* CHRONOLOGICAL EXPERIENCE TIMELINE TIMELINE */}
          <div className="relative pl-6 border-l-2 border-[#6366f1] flex-1">
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

          {/* DECLARATION POSITIONING AT BOTTOM */}
          {declaration && (
            <div className="relative pl-6 border-l-2 border-[#6366f1] pt-2">
              <div className="absolute top-3.5 left-[-6px] w-[10px] h-[10px] bg-[#cbd5e1] rounded-full"></div>
              <p className="text-[10px] text-[#64748b] italic whitespace-pre-wrap leading-normal">
                {declaration}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INSTITUTIONAL ATTRIBUTES PANEL (36% Width) */}
        <div className="w-[36%] flex flex-col gap-5 overflow-hidden">
          
          <div>
            <h2 className="text-[13px] font-extrabold text-[#0f172a] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5 font-sans">
              Technical Matrix
            </h2>
            <p className="text-[#334155] leading-loose text-[11px] font-medium whitespace-pre-wrap font-sans">
              {skills || "Competencies matrix keys summaries across list elements."}
            </p>
          </div>

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

          <div>
            <h2 className="text-[13px] font-extrabold text-[#0f172a] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5 font-sans">
              Credentials
            </h2>
            <p className="text-[#334155] leading-relaxed text-[10.5px] whitespace-pre-wrap font-sans">
              {certifications || "List professional certificates highlights here."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-extrabold text-[#0f172a] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5 font-sans">
              Languages Spoken
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap font-sans">
              {languages || "Languages speaking parameters list metadata."}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-extrabold text-[#0f172a] border-b border-[#cbd5e1] pb-1 uppercase tracking-wider mb-2.5 font-sans">
              Affiliations
            </h2>
            <p className="text-[#334155] leading-relaxed text-[11px] whitespace-pre-wrap font-sans">
              {interests || "Additional project links or internal personal highlights nodes."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* HIDDEN PRINT TARGET STORAGE ACROSS THE BACKDROP */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <ResumePreviewContent innerRef={resumeRef} />
      </div>
      
      {/* TOP HEADER */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Timeline Portfolio Mode
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

      {/* DASHBOARD GRID PLACEMENT CONTAINER */}
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 h-[calc(100vh-73px)]">
        
        {/* INPUT PANEL FIELD EDITOR MODULE */}
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
                <label className="block mb-1 text-sm text-slate-400">Summary Objective ProfileStatement</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y" value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>

              {/* DYNAMIC EDUCATION TIMELINE CONFIGURE ENGINE ACCORDION */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Education Details</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">University / Institute School Name</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Degree Received Title</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Graduation Timeline Passing Year</label>
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

              {/* DYNAMIC EXPERIENCE PROGRESSION CHRONOLOGY CONFIG NODE */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Work Experience placements Chronology</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Company/Corporate Title identifier</label>
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
                        <label className="block text-xs text-slate-400 mb-1">Responsibilities / Key Accomplishments</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-24 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-indigo-400 font-medium py-1"><Plus className="w-4 h-4" /> Add Professional Block</button>
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-400">Technical Skillset Matrix Matrix</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Professional Certifications Credentials</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y" value={certifications} onChange={(e) => setCertifications(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Languages spoken parameters</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-16 resize-y" value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Awards & Highlights Affiliations</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-20 resize-y" value={interests} onChange={(e) => setInterests(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Declaration Statement text</label>
                <textarea className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-16 resize-y" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              </div>
            </div>
            <div className="h-20 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP COMPONENT WORKSPACE CANVAS DISPLAY PANEL */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-800 rounded-2xl overflow-auto border border-slate-700 relative items-start justify-center p-8 custom-scrollbar">
          <div className="origin-top scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9] transition-transform duration-300 flex justify-center">
            <ResumePreviewContent />
          </div>
        </div>
      </div>

      {/* MOBILE ACTIONS SELECTION FLOATING TRIGGERS */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
        <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl p-4 rounded-xl font-semibold flex items-center justify-center gap-2">
          <Eye className="w-5 h-5" /> Preview Export Page
        </button>
      </div>

      {/* MOBILE OVERLAY INTERACTION FULL MODALS */}
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