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

export default function ResumeMaker() {
  // ============================================
  // STATES WITH INITIAL EXAMPLES PRE-FILLED
  // ============================================
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("User Name");
  const [address, setAddress] = useState("Your address goes here, city, country");
  const [phone, setPhone] = useState("your phone number");
  const [email, setEmail] = useState("your email address");
  const [objective, setObjective] = useState(
    "Results-driven professional with experience in operations and client management. Skilled in team coordination, problem-solving, and maintaining strong customer relationships. Seeking to contribute my expertise and grow within a dynamic organization."
  );
  const [skills, setSkills] = useState(
    "• Team Management\n• Communication Skills\n• Customer Relationship Management\n• Problem Solving\n• Time Management\n• Leadership\n• Microsoft Office (Word, Excel)\n• Operations Management"
  );
  const [interests, setInterests] = useState("• Tech Blogging\n• Travelling & Photography\n• Open Source Contribution");
  const [languages, setLanguages] = useState("• Hindi (Native)\n• English (Professional Working)");
  const [certifications, setCertifications] = useState("• Certified Operations Associate (COA)\n• Advanced Business Communication Course");
  const [declaration, setDeclaration] = useState("I hereby declare that the information provided above is true.");

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      schoolName: "university name",
      schoolLocation: "city, country",
      degree: "Bachelor of Arts",
      fieldOfStudy: "Political Science & History",
      graduationDate: "completed year",
      isEnrolled: false,
      description: "Studied subjects including History, Political Science, Sociology, Hindi, and English. Developed strong communication, analytical, and research skills through academic projects, assignments, and presentations."
    }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      jobTitle: "manager",
      employer: "Comapny Name",
      city: "delhi",
      country: "india",
      startDate: "jan 2022",
      endDate: "Present",
      isCurrent: true,
      description: "• Managed daily operations and ensured smooth workflow across departments.\n• Coordinated with clients, vendors, and internal teams to meet business requirements.\n• Monitored service quality and resolved customer issues in a timely manner.\n• Supervised team members, assigned tasks, and tracked performance.\n• Prepared operational reports and maintained accurate records.\n• Assisted in process improvements to increase efficiency and productivity.\n• Ensured compliance with company policies and operational standards."
    }
  ]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const resumeRef = useRef<HTMLDivElement>(null);

  // ============================================
  // HANDLERS
  // ============================================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
  // RESUME TEMPLATE (1-Page Auto-Fit Layout)
  // ============================================
  const ResumePreviewContent = ({ innerRef }: { innerRef?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#000000] shadow-2xl flex overflow-hidden shrink-0"
      style={{ letterSpacing: "normal" }}
    >
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-[#d9dfe7] p-6 flex flex-col min-h-full">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#ffffff] mx-auto shadow-md"
            style={{ width: "112px", height: "112px", minWidth: "112px", minHeight: "112px" }}
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-[#cbd5e1] border-4 border-[#ffffff] mx-auto flex items-center justify-center text-[#64748b] shadow-md"
               style={{ width: "112px", height: "112px" }}>
            Photo
          </div>
        )}

        <div className="mt-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold border-b-2 border-[#9ca3af] pb-1 text-[#1f2937] mb-3 uppercase">
              EDUCATION
            </h2>
            <div className="flex flex-col gap-3">
              {educations.map((edu) => (
                <div key={edu.id} className="leading-tight">
                  <p className="font-bold text-[#1f2937] text-[13px]">
                    {edu.degree || "Degree"} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                  </p>
                  <p className="font-semibold text-[#374151] text-[13px] mt-0.5">{edu.schoolName || "School Name"}</p>
                  <p className="text-[#4b5563] text-xs mt-0.5">
                    {edu.graduationDate || "Year"} {edu.isEnrolled && "(Expected)"} {edu.schoolLocation && `| ${edu.schoolLocation}`}
                  </p>
                  {edu.description && (
                    <p className="mt-1.5 text-[#374151] leading-snug text-xs whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
              {educations.length === 0 && <p className="text-[#374151] text-xs">Your education details will appear here.</p>}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold border-b-2 border-[#9ca3af] pb-1 text-[#1f2937] mb-2 uppercase">
              SKILLS
            </h2>
            <p className="whitespace-pre-wrap text-[#374151] leading-snug text-[13px]">
              {skills || "Your skills will appear here."}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold border-b-2 border-[#9ca3af] pb-1 text-[#1f2937] mb-2 uppercase">
              LANGUAGES
            </h2>
            <p className="whitespace-pre-wrap text-[#374151] leading-snug text-[13px]">
              {languages || "Your languages will appear here."}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold border-b-2 border-[#9ca3af] pb-1 text-[#1f2937] mb-2 uppercase">
              INTERESTS
            </h2>
            <p className="whitespace-pre-wrap text-[#374151] leading-snug text-[13px]">
              {interests || "Your interests will appear here."}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-2/3 p-8 flex flex-col">
        <div>
          <h1 className="text-4xl font-extrabold uppercase text-[#111827]">
            {name || "YOUR NAME"}
          </h1>
          <div className="mt-3 flex flex-col gap-0.5 text-[13px] font-medium text-[#4b5563]">
            <p>{address || "Your full address goes here"}</p>
            <p>{phone || "+1 234 567 8900"}</p>
            <p>{email || "hello@youremail.com"}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5 flex-1">
          <div>
            <h2 className="text-xl font-bold border-b-2 border-[#d1d5db] pb-1 text-[#1f2937] mb-2 uppercase">
              PROFILE
            </h2>
            <p className="whitespace-pre-wrap text-[#374151] leading-snug text-[13px]">
              {objective || "Write a brief career objective or summary here."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b-2 border-[#d1d5db] pb-1 text-[#1f2937] mb-3 uppercase">
              EXPERIENCE
            </h2>
            <div className="flex flex-col gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="leading-tight">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[15px] text-[#1f2937]">{exp.jobTitle || "Job Title"}</h3>
                    <span className="text-xs text-[#4b5563] font-medium">
                      {exp.startDate || "Start"} - {exp.isCurrent ? "Present" : (exp.endDate || "End")}
                    </span>
                  </div>
                  <div className="font-semibold text-[#374151] text-[13px] mt-0.5">
                    {exp.employer || "Employer"}
                    {(exp.city || exp.country) && ` | ${exp.city}${exp.city && exp.country ? ', ' : ''}${exp.country}`}
                  </div>
                  {exp.description && (
                    <p className="mt-1.5 text-[#374151] leading-snug text-[13px] whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
              {experiences.length === 0 && <p className="text-[#374151] text-[13px]">Detail your work experience here.</p>}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b-2 border-[#d1d5db] pb-1 text-[#1f2937] mb-2 uppercase">
              CERTIFICATIONS
            </h2>
            <p className="whitespace-pre-wrap text-[#374151] leading-snug text-[13px]">
              {certifications || "List your certifications here."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b-2 border-[#d1d5db] pb-1 text-[#1f2937] mb-2 uppercase">
              DECLARATION
            </h2>
            <p className="whitespace-pre-wrap text-[#374151] leading-snug text-[13px] italic">
              {declaration || "I hereby declare that the information provided above is true."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* HIDDEN UN-SCALED PRINTABLE CONTAINER FOR EXCLUSIVELY PDF ENGINE */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <ResumePreviewContent innerRef={resumeRef} />
      </div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          ResumeBuilder Pro
        </h1>
        {/* Desktop Download Button */}
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

      {/* MAIN GRID */}
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 h-[calc(100vh-73px)]">
        
        {/* LEFT FORM SECTION */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Personal Information
          </h2>

          <div className="space-y-6">
            {/* PROFILE PHOTO */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">Profile Photo</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 hover:border-indigo-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                  <p className="text-sm text-slate-400">Click to upload image</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* BASIC INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Address</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all h-20 resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Phone</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Email</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <hr className="border-slate-800 my-8" />
            <h2 className="text-2xl font-semibold mb-6">Professional Details</h2>

            {/* SECTIONS */}
            <div className="space-y-8">
              <div>
                <label className="block mb-1 text-sm text-slate-400">Career Objective</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>

              {/* DYNAMIC EDUCATION SECTION */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-slate-200">Education</h3>
                </div>
                {educations.map((edu, index) => (
                  <div key={edu.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    {educations.length > 1 && (
                      <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block mb-1 text-xs text-slate-400">School Name</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">Location</label>
                        <input type="text" value={edu.schoolLocation} onChange={(e) => handleEduChange(edu.id, "schoolLocation", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">Degree</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">Field of Study</label>
                        <input type="text" value={edu.fieldOfStudy} onChange={(e) => handleEduChange(edu.id, "fieldOfStudy", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">Graduation Date</label>
                        <input type="text" value={edu.graduationDate} onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id={`enrolled-${edu.id}`} checked={edu.isEnrolled} onChange={(e) => handleEduChange(edu.id, "isEnrolled", e.target.checked)} className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-indigo-500" />
                        <label htmlFor={`enrolled-${edu.id}`} className="text-sm text-slate-300 cursor-pointer">I'm still enrolled</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1 text-xs text-slate-400">Coursework / Description</label>
                        <textarea value={edu.description} onChange={(e) => handleEduChange(edu.id, "description", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm h-20 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium py-2 transition">
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>

              {/* DYNAMIC EXPERIENCE SECTION */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-slate-200">Work Experience</h3>
                </div>
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4">
                    {experiences.length > 1 && (
                      <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">Job Title</label>
                        <input type="text" value={exp.jobTitle} onChange={(e) => handleExpChange(exp.id, "jobTitle", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">Employer</label>
                        <input type="text" value={exp.employer} onChange={(e) => handleExpChange(exp.id, "employer", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">City</label>
                        <input type="text" value={exp.city} onChange={(e) => handleExpChange(exp.id, "city", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">Country</label>
                        <input type="text" value={exp.country} onChange={(e) => handleExpChange(exp.id, "country", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => handleExpChange(exp.id, "startDate", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-slate-400">End Date</label>
                        <input type="text" disabled={exp.isCurrent} value={exp.isCurrent ? "Present" : exp.endDate} onChange={(e) => handleExpChange(exp.id, "endDate", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm disabled:opacity-50" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)} className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-indigo-500" />
                        <label htmlFor={`current-${exp.id}`} className="text-sm text-slate-300 cursor-pointer">I currently work here</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1 text-xs text-slate-400">Job Description (Bullet points recommended)</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2.5 rounded-md bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none text-sm h-28 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium py-2 transition">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-400">Skills</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Languages</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-20 resize-y"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Interests</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-20 resize-y"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Certifications</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-20 resize-y"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Declaration</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-20 resize-y"
                  value={declaration}
                  onChange={(e) => setDeclaration(e.target.value)}
                />
              </div>
            </div>
            
            {/* Mobile spacing block */}
            <div className="h-20 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP PREVIEW */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-800 rounded-2xl overflow-auto border border-slate-700 relative items-start justify-center p-8 custom-scrollbar">
          <div className="origin-top scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9] transition-transform duration-300 flex justify-center">
            <ResumePreviewContent />
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING BUTTON */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-900/50 p-4 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Eye className="w-5 h-5" />
          Preview & Download Resume
        </button>
      </div>

      {/* MOBILE PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {isDownloading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? "Saving..." : "Download"}
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
