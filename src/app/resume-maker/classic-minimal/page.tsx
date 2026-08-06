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

export default function ResumeMakerClassic() {
  // ============================================
  // STATES PRE-FILLED WITH CLASSIC EXAMPLES
  // ============================================
  const [name, setName] = useState("Your Name");
  const [address, setAddress] = useState("Your address line goes here, city, country");
  const [phone, setPhone] = useState("Your Phone Number");
  const [email, setEmail] = useState("Your Email Address");
  const [declaration, setDeclaration] = useState("");

  // DYNAMIC CUSTOM SECTIONS (Left Column)
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    {
      id: "sec-1",
      title: "PROFILE SUMMARY",
      content:
        "A highly motivated and results-driven professional with a strong background in operations management, team leadership, and customer service. Adept at streamlining processes, optimizing workflows, and ensuring compliance with industry standards. Seeking to leverage my expertise to contribute to organizational growth and operational excellence.",
    },
    {
      id: "sec-2",
      title: "CORE SKILLS",
      content:
        "• Problem Solving & Decision Making\n• Team Supervision\n• Operations Management\n• Vendor Coordination\n• Customer Feedback Handling\n• Corporate Event Management\n• Workplace management\n• Housekeeping management",
    },
    {
      id: "sec-3",
      title: "CERTIFICATIONS",
      content:
        "• Food Safety Practices & Safe Storage\n• FOSTAC (FSSAI Certified)\n• Waste Management & RUCO Compliance\n• Customer Handling & Service Excellence\n• Root Cause Analysis (RCA)",
    },
    {
      id: "sec-4",
      title: "LANGUAGES",
      content: "• English\n• Hindi",
    },
    {
      id: "sec-5",
      title: "AWARDS & HIGHLIGHTS",
      content:
        "• Recognized for outstanding performance in F&B operations management, service excellence, and client satisfaction.",
    },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      schoolName: "university name",
      schoolLocation: "your city, country",
      degree: "• Bachelor of Arts (B.A.)",
      fieldOfStudy: "Indian English Literature",
      graduationDate: "2024",
      isEnrolled: false,
      description:
        "Developing expertise in professional communication, digital proficiency, and organizational management to strengthen corporate operational skills.",
    },
    {
      id: "2",
      schoolName: "Introduction to Operations Management",
      schoolLocation: "Coursera",
      degree: "• Certification",
      fieldOfStudy: "",
      graduationDate: "2025",
      isEnrolled: true,
      description:
        "Gaining in-depth knowledge of process optimization, supply chain fundamentals, workflow planning, cost control, quality management, and performance improvement.",
    },
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      jobTitle: "Operations Manager",
      employer: "Your Company Name",
      city: "Your City",
      country: "",
      startDate: "Dec 2022",
      endDate: "present",
      isCurrent: true,
      description:
        "• Manage end-to-end cafeteria operations.\n• Lead and supervise operational staff.\n• Coordinate with corporate clients for smooth service delivery.\n• Handle vendor management and procurement.\n• Monitor inventory and control operational costs.\n• Ensure hygiene, food safety, and SOP compliance.",
    },
    {
      id: "2",
      jobTitle: "Team Leader",
      employer: "Your Company Name",
      city: "Your City",
      country: "",
      startDate: "Dec 2021",
      endDate: "Dec 2022",
      isCurrent: false,
      description:
        "• Managed shift operations and supervised team members\n• Handled customer service and resolved complaints\n• Supported inventory and stock control\n• Controlled/Ensured proper storage as per hygiene and safety standards",
    },
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
      { id: Date.now().toString(), title: "NEW SECTION", content: "" },
    ]);
  };
  const removeCustomSection = (id: string) => {
    setCustomSections(customSections.filter((sec) => sec.id !== id));
  };

  // Education Handlers
  const handleEduChange = (id: string, field: keyof Education, value: any) => {
    setEducations(
      educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };
  const addEducation = () =>
    setEducations([
      ...educations,
      {
        id: Date.now().toString(),
        schoolName: "",
        schoolLocation: "",
        degree: "",
        fieldOfStudy: "",
        graduationDate: "",
        isEnrolled: false,
        description: "",
      },
    ]);
  const removeEducation = (id: string) =>
    setEducations(educations.filter((edu) => edu.id !== id));

  // Experience Handlers
  const handleExpChange = (id: string, field: keyof Experience, value: any) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };
  const addExperience = () =>
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        jobTitle: "",
        employer: "",
        city: "",
        country: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
      },
    ]);
  const removeExperience = (id: string) =>
    setExperiences(experiences.filter((exp) => exp.id !== id));

  // ============================================
  // PREVIEW RENDERER
  // ============================================
  const renderResumePreview = (innerRef?: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#000000] shadow-xl p-10 flex flex-col overflow-hidden shrink-0 border border-slate-200"
      style={{ letterSpacing: "normal", fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* HEADER SECTION */}
      <div className="w-full mb-5">
        <h1 className="text-[40px] font-bold tracking-tight text-[#000000] mb-3 leading-none uppercase">
          {name || "YOUR NAME"}
        </h1>
        <div className="text-[13px] text-[#000000] font-semibold leading-relaxed w-full max-w-md">
          <div className="grid grid-cols-[80px_15px_1fr] items-center mb-1">
            <span className="text-left">Email</span>
            <span className="text-center">–</span>
            <span className="text-left font-normal">{email || "your.email@gmail.com"}</span>
          </div>
          <div className="grid grid-cols-[80px_15px_1fr] items-center mb-1">
            <span className="text-left">Contact</span>
            <span className="text-center">–</span>
            <span className="text-left font-normal">{phone || "0000000000"}</span>
          </div>
          <div className="grid grid-cols-[80px_15px_1fr] items-center">
            <span className="text-left">Address</span>
            <span className="text-center">–</span>
            <span className="text-left font-normal">{address || "Your full address details go here"}</span>
          </div>
        </div>
      </div>

      {/* TOP SEPARATOR */}
      <div className="w-full border-t-[2.5px] border-[#000000] mb-6"></div>

      {/* CONTENT COLUMNS */}
      <div className="w-full flex flex-row gap-8 flex-1 overflow-hidden">
        
        {/* LEFT COLUMN (Custom Dynamic Sections) */}
        <div className="w-[32%] flex flex-col gap-6 text-justify">
          {customSections.map((sec) => (
            <div key={sec.id}>
              <h2 className="text-[14px] font-bold border-b-[2.5px] border-[#000000] pb-1 text-[#000000] mb-3 uppercase tracking-wide">
                {sec.title || "SECTION TITLE"}
              </h2>
              <p className="text-[#000000] leading-relaxed text-[11.5px] whitespace-pre-wrap">
                {sec.content || "Section content goes here."}
              </p>
            </div>
          ))}
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="h-full border-l-[1.5px] border-[#000000]/30"></div>

        {/* RIGHT COLUMN */}
        <div className="w-[65%] flex flex-col gap-6">
          <div>
            <h2 className="text-[14px] font-bold border-b-[2.5px] border-[#000000] pb-1 text-[#000000] mb-4 uppercase tracking-wide">
              WORK EXPERIENCE
            </h2>
            <div className="flex flex-col gap-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-[11.5px]">
                  <div className="flex justify-between items-baseline font-bold text-[#000000] mb-1">
                    <span className="text-[13.5px] uppercase tracking-tight">
                      {exp.employer || "Employer/Company"}
                    </span>
                    <span className="text-[12px] font-bold">
                      {exp.startDate || "Start"} to{" "}
                      {exp.isCurrent ? "present" : exp.endDate || "End"}
                    </span>
                  </div>
                  <div className="font-bold text-[#000000] text-[12px] mb-2">
                    {exp.jobTitle || "Job Title"}
                    {exp.city && ` - ${exp.city}`}
                    {exp.country && `, ${exp.country}`}
                  </div>
                  {exp.description && (
                    <p className="text-[#000000] leading-[1.6] whitespace-pre-wrap pl-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[14px] font-bold border-b-[2.5px] border-[#000000] pb-1 text-[#000000] mb-4 uppercase tracking-wide mt-2">
              EDUCATION
            </h2>
            <div className="flex flex-col gap-5">
              {educations.map((edu) => (
                <div key={edu.id} className="text-[11.5px]">
                  <div className="flex justify-between items-baseline font-bold text-[#000000] mb-1">
                    <span className="text-[13px]">{edu.degree || "Degree Title"}</span>
                    <span className="text-[12px] font-bold">
                      {edu.graduationDate || "Year"}
                    </span>
                  </div>
                  <div className="font-bold text-[#000000] text-[12px] mb-1">
                    {edu.schoolName}
                    {edu.schoolLocation && ` - ${edu.schoolLocation}`}
                  </div>
                  {edu.description && (
                    <p className="text-[#000000] leading-[1.6] whitespace-pre-wrap pl-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {declaration && (
            <div className="mt-auto">
              <p className="text-[11.5px] text-[#374151] italic whitespace-pre-wrap leading-relaxed">
                {declaration}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-100 overflow-x-hidden relative font-sans flex flex-col">
      {/* HIDDEN PRINT TARGET */}
      <div className="fixed top-0 left-[-9999px] -z-50 pointer-events-none">
        {renderResumePreview(resumeRef)}
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Classic Template <span className="text-orange-600">Builder</span>
        </h1>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="hidden lg:flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
        >
          {isDownloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </header>

      {/* MAIN BUILDER GRID */}
      <div className="max-w-[1600px] w-full mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 lg:h-[85vh]">
        
        {/* INPUT EDITING DASHBOARD PANEL */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 lg:p-8 overflow-y-auto h-[70vh] lg:h-full scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Personal Data</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Address Line</label>
                <textarea
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 h-24 resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Contact Number</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Dynamic Side Sections</h2>
            <p className="text-sm text-slate-500 mb-4">Add, rename, or delete any sections you want to appear in the left column (e.g. Profile, Skills, Certifications).</p>
            
            {/* DYNAMIC CUSTOM SECTIONS (Left Column) */}
            <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
              {customSections.map((sec) => (
                <div key={sec.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                  <button
                    onClick={() => removeCustomSection(sec.id)}
                    className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleCustomSectionChange(sec.id, "title", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 uppercase font-semibold"
                      placeholder="e.g. SKILLS, AWARDS, PROJECTS"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Section Content</label>
                    <textarea
                      value={sec.content}
                      onChange={(e) => handleCustomSectionChange(sec.id, "content", e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 h-28 resize-y text-sm"
                      placeholder="Enter the section details..."
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addCustomSection}
                className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-bold py-2 px-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Custom Section
              </button>
            </div>

            <hr className="border-slate-200 my-8" />
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Main Experience & Education</h2>

            <div className="space-y-8">
              {/* DYNAMIC EXPERIENCE BUILDER */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Professional Experience</h3>
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company Name</label>
                        <input
                          type="text"
                          value={exp.employer}
                          onChange={(e) => handleExpChange(exp.id, "employer", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Designation</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => handleExpChange(exp.id, "jobTitle", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">City</label>
                        <input
                          type="text"
                          value={exp.city}
                          onChange={(e) => handleExpChange(exp.id, "city", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                          placeholder="e.g. New York"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Country</label>
                        <input
                          type="text"
                          value={exp.country}
                          onChange={(e) => handleExpChange(exp.id, "country", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => handleExpChange(exp.id, "startDate", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">End Date</label>
                        <input
                          type="text"
                          disabled={exp.isCurrent}
                          value={exp.isCurrent ? "Present" : exp.endDate}
                          onChange={(e) => handleExpChange(exp.id, "endDate", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none disabled:opacity-50 disabled:bg-slate-100"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.isCurrent}
                          onChange={(e) => handleExpChange(exp.id, "isCurrent", e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-600 cursor-pointer">
                          I currently work here
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Responsibilities (Bullet lists recommended)</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleExpChange(exp.id, "description", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 h-32 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-bold py-2 px-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Experience Block
                </button>
              </div>

              {/* DYNAMIC EDUCATION BUILDER */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Education Details</h3>
                {educations.map((edu) => (
                  <div key={edu.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl relative space-y-4">
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">University / School Name</label>
                        <input
                          type="text"
                          value={edu.schoolName}
                          onChange={(e) => handleEduChange(edu.id, "schoolName", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location (City, Country)</label>
                        <input
                          type="text"
                          value={edu.schoolLocation}
                          onChange={(e) => handleEduChange(edu.id, "schoolLocation", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Degree / Certification</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Passing Year</label>
                        <input
                          type="text"
                          value={edu.graduationDate}
                          onChange={(e) => handleEduChange(edu.id, "graduationDate", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Additional Info (Optional)</label>
                        <textarea
                          value={edu.description}
                          onChange={(e) => handleEduChange(edu.id, "description", e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 h-20 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-bold py-2 px-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Academic Record
                </button>
              </div>

            </div>
            <div className="h-24 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP CANVAS VIEW */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-100 rounded-3xl overflow-auto border border-slate-200 shadow-inner relative items-start justify-center p-8 custom-scrollbar h-[70vh] lg:h-full">
          <div className="origin-top scale-[0.6] xl:scale-[0.75] 2xl:scale-[0.85] transition-transform duration-300 flex justify-center shadow-2xl">
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
              <div className="absolute -top-5 left-8 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Edit3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Add Custom Sections</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Use the left-hand dashboard to enter your personal information, work experience, education, and completely custom side-sections (like Skills or Projects). Add or delete blocks as needed.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">Live Preview</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Watch your resume build itself in real-time on the right. The formatting is handled automatically to ensure a clean, perfectly aligned professional look.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Download className="w-6 h-6 text-orange-600" />
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
            <HelpCircle className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
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
                <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I create my own categories?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Absolutely. Just click the "+ Add Custom Section" button under the Dynamic Side Sections area. You can title it whatever you want (e.g. "Volunteer Work" or "Projects").
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Is the resulting PDF ATS-friendly?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Yes. This classic, text-based template is specifically designed without complex graphics or tables, making it highly readable for Applicant Tracking Systems (ATS) used by recruiters.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
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

      {/* MOBILE FLOATING INTERFACE MODALS */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl p-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Eye className="w-5 h-5" /> Preview & Download
        </button>
      </div>

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
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm"
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