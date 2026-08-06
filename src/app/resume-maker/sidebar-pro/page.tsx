"use client";

import React, { useState, useRef } from "react";
import { Eye, Download, X, UploadCloud, Plus, Trash2, FileText, Edit3, HelpCircle, CheckCircle2 } from "lucide-react";

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

  // DYNAMIC SIDEBAR SECTIONS (Left Column)
  const [sidebarSections, setSidebarSections] = useState<CustomSection[]>([
    {
      id: "side-1",
      title: "SKILLS",
      content: "• Team Management\n• Communication Skills\n• Customer Relationship Management\n• Problem Solving\n• Time Management\n• Leadership\n• Microsoft Office (Word, Excel)\n• Operations Management",
    },
    {
      id: "side-2",
      title: "LANGUAGES",
      content: "• Hindi (Native)\n• English (Professional Working)",
    },
    {
      id: "side-3",
      title: "INTERESTS",
      content: "• Tech Blogging\n• Travelling & Photography\n• Open Source Contribution",
    },
  ]);

  // DYNAMIC MAIN SECTIONS (Right Column, Bottom)
  const [mainSections, setMainSections] = useState<CustomSection[]>([
    {
      id: "main-1",
      title: "CERTIFICATIONS",
      content: "• Certified Operations Associate (COA)\n• Advanced Business Communication Course",
    },
    {
      id: "main-2",
      title: "DECLARATION",
      content: "I hereby declare that the information provided above is true.",
    },
  ]);

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

  // Sidebar Sections Handlers (Left)
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

  // Main Sections Handlers (Right)
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
  // RESUME TEMPLATE (1-Page Auto-Fit Layout)
  // ============================================
  const renderResumePreview = (innerRef?: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#000000] shadow-2xl flex overflow-hidden shrink-0 border border-slate-200"
      style={{ letterSpacing: "normal", fontFamily: "Arial, Helvetica, sans-serif" }}
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
               style={{ width: "112px", height: "112px", minWidth: "112px", minHeight: "112px" }}>
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

          {/* DYNAMIC LEFT SIDEBAR SECTIONS */}
          {sidebarSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-lg font-bold border-b-2 border-[#9ca3af] pb-1 text-[#1f2937] mb-2 uppercase">
                {sec.title}
              </h2>
              <p className="whitespace-pre-wrap text-[#374151] leading-snug text-[13px]">
                {sec.content}
              </p>
            </div>
          ))}
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

          {/* DYNAMIC RIGHT MAIN SECTIONS */}
          {mainSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-xl font-bold border-b-2 border-[#d1d5db] pb-1 text-[#1f2937] mb-2 uppercase">
                {sec.title}
              </h2>
              <p className={`whitespace-pre-wrap text-[#374151] leading-snug text-[13px] ${sec.title.toLowerCase() === 'declaration' ? 'italic' : ''}`}>
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
      
      {/* HIDDEN UN-SCALED PRINTABLE CONTAINER FOR EXCLUSIVELY PDF ENGINE */}
      <div className="fixed top-0 left-[-9999px] -z-50 pointer-events-none">
        {renderResumePreview(resumeRef)}
      </div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Standard Two-Column <span className="text-indigo-600">Builder</span>
        </h1>
        {/* Desktop Download Button */}
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

      {/* MAIN GRID */}
      <div className="max-w-[1600px] w-full mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 lg:h-[85vh]">
        
        {/* LEFT FORM SECTION */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 overflow-y-auto h-[70vh] lg:h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Personal Information</h2>

          <div className="space-y-6">
            {/* PROFILE PHOTO */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-600">Profile Photo</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-2 text-indigo-400" />
                  <p className="text-sm font-medium text-slate-500">Click to upload image</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* BASIC INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Address</label>
                <textarea
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-24 resize-none text-slate-900"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Phone</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Email</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Professional Summary</h2>

            <div className="space-y-8">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Career Objective</label>
                <textarea
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none h-32 resize-y text-slate-900"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>

              {/* DYNAMIC EDUCATION SECTION */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-slate-800">Education Background</h3>
                </div>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    {educations.length > 1 && (
                      <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">School / University Name</label>
                        <input type="text" value={edu.schoolName} onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Location</label>
                        <input type="text" value={edu.schoolLocation} onChange={(e) => handleEduChange(edu.id, "schoolLocation", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Degree</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Field of Study</label>
                        <input type="text" value={edu.fieldOfStudy} onChange={(e) => handleEduChange(edu.id, "fieldOfStudy", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Graduation Date</label>
                        <input type="text" value={edu.graduationDate} onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id={`enrolled-${edu.id}`} checked={edu.isEnrolled} onChange={(e) => handleEduChange(edu.id, "isEnrolled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor={`enrolled-${edu.id}`} className="text-sm font-medium text-slate-600 cursor-pointer">I'm still enrolled</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Coursework / Description</label>
                        <textarea value={edu.description} onChange={(e) => handleEduChange(edu.id, "description", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-20 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold py-2 px-1 transition-colors">
                  <Plus className="w-4 h-4" /> Add Education Node
                </button>
              </div>

              <hr className="border-slate-200 my-8" />
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Dynamic Left Sidebar Sections</h2>
              <p className="text-sm text-slate-500 mb-4">Add, rename, or delete sections that appear in the left gray column below your photo and education (e.g. Skills, Languages).</p>
              
              {/* DYNAMIC LEFT SIDEBAR BUILDER */}
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
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase font-semibold"
                        placeholder="e.g. SKILLS, LANGUAGES"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Content</label>
                      <textarea
                        value={sec.content}
                        onChange={(e) => handleSidebarSectionChange(sec.id, "content", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-28 resize-y text-sm"
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

              {/* DYNAMIC EXPERIENCE SECTION */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-slate-800">Work Experience</h3>
                </div>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    {experiences.length > 1 && (
                      <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Job Title</label>
                        <input type="text" value={exp.jobTitle} onChange={(e) => handleExpChange(exp.id, "jobTitle", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Employer</label>
                        <input type="text" value={exp.employer} onChange={(e) => handleExpChange(exp.id, "employer", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">City</label>
                        <input type="text" value={exp.city} onChange={(e) => handleExpChange(exp.id, "city", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Country</label>
                        <input type="text" value={exp.country} onChange={(e) => handleExpChange(exp.id, "country", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => handleExpChange(exp.id, "startDate", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">End Date</label>
                        <input type="text" disabled={exp.isCurrent} value={exp.isCurrent ? "Present" : exp.endDate} onChange={(e) => handleExpChange(exp.id, "endDate", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm disabled:opacity-50 disabled:bg-slate-100" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-600 cursor-pointer">I currently work here</label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Job Description (Bullet points recommended)</label>
                        <textarea value={exp.description} onChange={(e) => handleExpChange(exp.id, "description", e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm h-32 resize-y" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold py-2 px-1 transition-colors">
                  <Plus className="w-4 h-4" /> Add Experience Block
                </button>
              </div>

              <hr className="border-slate-200 my-8" />
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Dynamic Main Sections (Bottom)</h2>
              <p className="text-sm text-slate-500 mb-4">Add or customize additional sections for the right column below your Experience (e.g., Certifications, Declaration).</p>
              
              {/* DYNAMIC RIGHT MAIN BUILDER */}
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
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase font-semibold"
                        placeholder="e.g. CERTIFICATIONS, DECLARATION"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Content</label>
                      <textarea
                        value={sec.content}
                        onChange={(e) => handleMainSectionChange(sec.id, "content", e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-28 resize-y text-sm"
                        placeholder="Enter the section details..."
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addMainSection}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-bold py-2 px-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Main Section
                </button>
              </div>

            </div>
            
            {/* Mobile spacing block */}
            <div className="h-24 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP PREVIEW */}
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
              Build a polished, professional two-column resume featuring a dedicated photo and sidebar section.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Edit3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Custom Left & Right Columns</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Easily divide your content. Add "Sidebar Sections" for the left column (like Skills) and "Main Sections" for the right column (like Certifications or Projects).
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Live Formatting</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Upload your photo and watch the layout automatically adapt. The distinct visual separation ensures recruiters can scan your key strengths rapidly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Download className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Download PDF</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                When you're ready, hit the download button to instantly receive your high-quality, print-ready PDF file securely and without watermarks.
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
                  <h4 className="font-bold text-slate-800 mb-2">Can I delete sections I don't need?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Yes! You can completely delete sections like "Languages" or "Certifications" by clicking the red trash can icon inside the editor block.
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
                    Absolutely. Use the "+ Add Sidebar Section" for left-column items or "+ Add Main Section" for right-column items. Name them anything you want.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Do I have to upload a photo?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    No, the photo is optional. If you skip it, a clean placeholder circle will remain, or you can adjust the layout manually if you prefer a text-only approach.
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
                    No. All processing, photo loading, and PDF generation happen locally inside your web browser. We do not store or track your personal resume data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING BUTTON */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl p-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Eye className="w-5 h-5" />
          Preview & Download Resume
        </button>
      </div>

      {/* MOBILE PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shadow-sm">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm disabled:opacity-50"
            >
              {isDownloading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
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