"use client";

import { useState, useRef } from "react";
import { Eye, Download, X, Plus, Trash2 } from "lucide-react";

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

export default function ResumeMakerClassic() {
  // ============================================
  // STATES PRE-FILLED WITH CLASSIC EXAMPLES
  // ============================================
  const [name, setName] = useState("Your Name");
  const [address, setAddress] = useState("Your address line goes here, city, country");
  const [phone, setPhone] = useState("Your Phone Number");
  const [email, setEmail] = useState("Your Email Address");
  const [objective, setObjective] = useState(
    "A highly motivated and results-driven professional with a strong background in operations management, team leadership, and customer service. Adept at streamlining processes, optimizing workflows, and ensuring compliance with industry standards. Seeking to leverage my expertise to contribute to organizational growth and operational excellence."
  );
  const [skills, setSkills] = useState(
    "• Problem Solving & Decision Making\n• Team Supervision\n• Operations Management\n• Vendor Coordination\n• Customer Feedback Handling\n• Corporate Event Management\n• Workplace management\n• Housekeeping management"
  );
  const [interests, setInterests] = useState(
    "• Recognized for outstanding performance in F&B operations management, service excellence, and client satisfaction."
  );
  const [languages, setLanguages] = useState("• English\n• Hindi");
  const [certifications, setCertifications] = useState(
    "• Food Safety Practices & Safe Storage\n• FOSTAC (FSSAI Certified)\n• Waste Management & RUCO Compliance\n• Customer Handling & Service Excellence\n• Root Cause Analysis (RCA)\n• Hazard Identification & Control\n• FSSAI Audit & Compliance\n• Cross Contamination Prevention\n• support services\n• CAPA and Recall"
  );
  const [declaration, setDeclaration] = useState("");

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
      schoolName: "Introduction to Operations Management – Pursuing",
      schoolLocation: "your city, country",
      degree: "• Certifications - coursera",
      fieldOfStudy: "",
      graduationDate: "2025",
      isEnrolled: true,
      description:
        "Gaining in-depth knowledge of process optimization, supply chain fundamentals, workflow planning, cost control, quality management, and performance improvement to enhance operational efficiency in corporate environments.",
    },
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      jobTitle: "job title",
      employer: "your company name",
      city: "your city",
      country: "",
      startDate: "Dec 2022",
      endDate: "present",
      isCurrent: true,
      description:
        "• Manage end-to-end cafeteria operations.\n• Lead and supervise operational staff.\n• Coordinate with corporate clients for smooth service delivery.\n• Handle vendor management and procurement.\n• Monitor inventory and control operational costs.\n• Ensure hygiene, food safety, and SOP compliance.\n• Prepare daily and monthly operational reports.\n• Resolve customer complaints and improve service quality.",
    },
    {
      id: "2",
      jobTitle: "Team Leader – Food & Beverage Operations",
      employer: "your company name",
      city: "your city",
      country: "",
      startDate: "Dec 2021",
      endDate: "Dec 2022",
      isCurrent: false,
      description:
        "• Managed shift operations and supervised team members\n• Handled customer service and resolved complaints\n• Supported inventory and stock control\n• Controlled/Ensured proper storage as per hygiene and safety standardsd food cost and minimized wastage\n• Supervised KFC product preparation ensuring strict hygiene and food safety standards",
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
      // Improved html2canvas settings for 1:1 PDF match
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0, // Fixes cutoff issues if page is scrolled
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
  // AUTO-SPACE FILLING CLASSIC RESUME PREVIEW
  // ============================================
  const ResumePreviewContent = ({
    innerRef,
  }: {
    innerRef?: React.RefObject<HTMLDivElement | null>;
  }) => (
    <div
      ref={innerRef}
      className="w-[800px] h-[1131px] bg-[#ffffff] text-[#000000] shadow-2xl p-10 flex flex-col overflow-hidden shrink-0"
      style={{ letterSpacing: "normal", fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* HEADER SECTION */}
      <div className="w-full mb-5">
        <h1 className="text-[40px] font-bold tracking-tight text-[#000000] mb-3 leading-none uppercase">
          {name || "YOUR NAME"}
        </h1>
        {/* Adjusted to perfectly align the hyphens just like the Word document */}
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

      {/* TOP SEPARATOR HORIZONTAL RULE */}
      <div className="w-full border-t-[2.5px] border-[#000000] mb-6"></div>

      {/* TWO COLUMN CONTENT WRAPPER */}
      <div className="w-full flex flex-row gap-8 flex-1 overflow-hidden">
        {/* LEFT COLUMN (32% Width) */}
        <div className="w-[32%] flex flex-col gap-6 text-justify">
          <div>
            <h2 className="text-[14px] font-bold border-b-[2.5px] border-[#000000] pb-1 text-[#000000] mb-3 uppercase tracking-wide">
              PROFILE
            </h2>
            <p className="text-[#000000] leading-relaxed text-[11.5px] whitespace-pre-wrap">
              {objective || "Write a brief career profile details here."}
            </p>
          </div>

          <div>
            <h2 className="text-[14px] font-bold border-b-[2.5px] border-[#000000] pb-1 text-[#000000] mb-3 uppercase tracking-wide">
              SKILLS
            </h2>
            <p className="text-[#000000] leading-relaxed text-[11.5px] whitespace-pre-wrap">
              {skills || "Your list of skills will appear here."}
            </p>
          </div>

          {certifications && (
            <div>
              <h2 className="text-[14px] font-bold border-b-[2.5px] border-[#000000] pb-1 text-[#000000] mb-3 uppercase tracking-wide">
                CERTIFICATIONS
              </h2>
              <p className="text-[#000000] leading-relaxed text-[11.5px] whitespace-pre-wrap">
                {certifications}
              </p>
            </div>
          )}

          {languages && (
            <div>
              <h2 className="text-[14px] font-bold border-b-[2.5px] border-[#000000] pb-1 text-[#000000] mb-3 uppercase tracking-wide">
                LANGUAGE
              </h2>
              <p className="text-[#000000] leading-relaxed text-[11.5px] whitespace-pre-wrap">
                {languages}
              </p>
            </div>
          )}

          {interests && (
            <div>
              <h2 className="text-[14px] font-bold border-b-[2.5px] border-[#000000] pb-1 text-[#000000] mb-3 uppercase tracking-wide">
                AWARDS
              </h2>
              <p className="text-[#000000] leading-relaxed text-[11.5px] whitespace-pre-wrap italic">
                {interests}
              </p>
            </div>
          )}
        </div>

        {/* VERTICAL DIVIDER LINE */}
        <div className="h-full border-l-[1.5px] border-[#000000]/30"></div>

        {/* RIGHT COLUMN (65% Width) */}
        <div className="w-[65%] flex flex-col gap-6">
          {/* WORK EXPERIENCE */}
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

          {/* EDUCATION SECTION */}
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

          {/* DECLARATION (IF PROVIDED) */}
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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* HIDDEN PRINT TARGET (Moved to fixed top-left with negative z-index to prevent html2canvas cutoffs) */}
      <div className="fixed top-0 left-[-9999px] -z-50 pointer-events-none">
        <ResumePreviewContent innerRef={resumeRef} />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Classic Template Mode
        </h1>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="hidden lg:flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </header>

      {/* MAIN LAYOUT GRID */}
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8 grid lg:grid-cols-12 gap-8 h-[calc(100vh-73px)]">
        {/* INPUT EDITING DASHBOARD PANEL */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <h2 className="text-2xl font-semibold mb-6">Personal Data</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-slate-400">Address Line</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none h-20 resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <hr className="border-slate-800 my-8" />
            <h2 className="text-2xl font-semibold mb-6">Resume Core Sub-sections</h2>

            <div className="space-y-8">
              <div>
                <label className="block mb-1 text-sm text-slate-400">
                  Profile Summary
                </label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none h-32 resize-y"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>

              {/* DYNAMIC EXPERIENCE BUILDER (Now with City/Country fields!) */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">
                  Professional Experience
                </h3>
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4"
                  >
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Company/Employer Name
                        </label>
                        <input
                          type="text"
                          value={exp.employer}
                          onChange={(e) =>
                            handleExpChange(exp.id, "employer", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Designation Role
                        </label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) =>
                            handleExpChange(exp.id, "jobTitle", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                        />
                      </div>
                      {/* ADDED CITY & COUNTRY FIELDS */}
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={exp.city}
                          onChange={(e) =>
                            handleExpChange(exp.id, "city", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                          placeholder="e.g. New York"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={exp.country}
                          onChange={(e) =>
                            handleExpChange(exp.id, "country", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                        />
                      </div>
                      {/* END ADDED FIELDS */}
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Start Timeline
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) =>
                            handleExpChange(exp.id, "startDate", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          End Timeline
                        </label>
                        <input
                          type="text"
                          disabled={exp.isCurrent}
                          value={exp.isCurrent ? "Present" : exp.endDate}
                          onChange={(e) =>
                            handleExpChange(exp.id, "endDate", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none disabled:opacity-40"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.isCurrent}
                          onChange={(e) =>
                            handleExpChange(exp.id, "isCurrent", e.target.checked)
                          }
                          className="w-4 h-4 bg-slate-900 accent-orange-500"
                        />
                        <label
                          htmlFor={`current-${exp.id}`}
                          className="text-xs text-slate-300 cursor-pointer"
                        >
                          Currently Active Role
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">
                          Detailed Responsibilities (Bullet lists recommended)
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) =>
                            handleExpChange(exp.id, "description", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-32 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 text-sm text-orange-400 font-medium py-1"
                >
                  <Plus className="w-4 h-4" /> Add Experience Placement
                </button>
              </div>

              {/* DYNAMIC EDUCATION BUILDER */}
              <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Education Details</h3>
                {educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-lg relative space-y-4"
                  >
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">
                          University / Board Name
                        </label>
                        <input
                          type="text"
                          value={edu.schoolName}
                          onChange={(e) =>
                            handleEduChange(edu.id, "schoolName", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                        />
                      </div>
                      {/* ADDED EDUCATION LOCATION FIELD */}
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">
                          Location (City, Country)
                        </label>
                        <input
                          type="text"
                          value={edu.schoolLocation}
                          onChange={(e) =>
                            handleEduChange(edu.id, "schoolLocation", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                        />
                      </div>
                      {/* END ADDED FIELD */}
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Degree Title
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            handleEduChange(edu.id, "degree", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Passing Year
                        </label>
                        <input
                          type="text"
                          value={edu.graduationDate}
                          onChange={(e) =>
                            handleEduChange(edu.id, "graduationDate", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">
                          Core details / info description
                        </label>
                        <textarea
                          value={edu.description}
                          onChange={(e) =>
                            handleEduChange(edu.id, "description", e.target.value)
                          }
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded outline-none h-16 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 text-sm text-orange-400 font-medium py-1"
                >
                  <Plus className="w-4 h-4" /> Add Academic Item
                </button>
              </div>

              <div>
                <label className="block mb-1 text-sm text-slate-400">
                  Core Expertise Skills
                </label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none h-24 resize-y"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">
                  Other Certifications
                </label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none h-24 resize-y"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">
                  Languages Spoken
                </label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none h-16 resize-y"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">
                  Awards & Highlights
                </label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-orange-500 outline-none h-20 resize-y"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
              </div>
            </div>
            <div className="h-20 lg:hidden"></div>
          </div>
        </div>

        {/* RIGHT DESKTOP CANVAS VIEW */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-800 rounded-2xl overflow-auto border border-slate-700 relative items-start justify-center p-8 custom-scrollbar">
          <div className="origin-top scale-[0.6] xl:scale-[0.75] 2xl:scale-[0.85] transition-transform duration-300 flex justify-center">
            <ResumePreviewContent />
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING INTERFACE MODALS */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-xl p-4 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Eye className="w-5 h-5" /> View Printable Sheet
        </button>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="p-2 bg-slate-800 rounded-full text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-orange-600 px-4 py-2 rounded-lg font-medium"
            >
              {isDownloading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
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
