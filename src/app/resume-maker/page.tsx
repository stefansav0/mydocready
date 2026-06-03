"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Eye, Download, X, UploadCloud } from "lucide-react";

export default function ResumeMaker() {
  // ============================================
  // STATES
  // ============================================
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [objective, setObjective] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [languages, setLanguages] = useState("");
  const [certifications, setCertifications] = useState("");
  const [declaration, setDeclaration] = useState("");

  // UX States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ============================================
  // RESUME REF
  // ============================================
  const resumeRef = useRef<HTMLDivElement>(null);

  // ============================================
  // HANDLERS
  // ============================================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const downloadPDF = async () => {
    const input = resumeRef.current;
    if (!input) return;

    setIsDownloading(true);
    try {
      // Temporarily ensure the element is fully visible for html2canvas
      const canvas = await html2canvas(input, {
        scale: 2, // High resolution
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

  // ============================================
  // RESUME TEMPLATE (Used in both Desktop & Mobile)
  // ============================================
  const ResumePreviewContent = () => (
    <div
      ref={resumeRef}
      // Exact A4 dimensions in pixels (96 DPI) to ensure perfect PDF generation
      className="w-[800px] min-h-[1131px] bg-white text-black shadow-2xl mx-auto flex overflow-hidden shrink-0"
    >
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-[#d9dfe7] p-8 flex flex-col min-h-full">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border-8 border-white mx-auto shadow-md"
          />
        ) : (
          <div className="w-48 h-48 rounded-full bg-slate-300 border-8 border-white mx-auto flex items-center justify-center text-slate-500 shadow-md">
            Photo
          </div>
        )}

        <div className="mt-12 space-y-10">
          <div>
            <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 tracking-widest text-gray-800">
              EDUCATION
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {education || "Your education details will appear here."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 tracking-widest text-gray-800">
              SKILLS
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {skills || "Your skills will appear here."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 tracking-widest text-gray-800">
              LANGUAGES
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {languages || "Your languages will appear here."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b-2 border-gray-400 pb-1 tracking-widest text-gray-800">
              INTERESTS
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {interests || "Your interests will appear here."}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-2/3 p-10 flex flex-col">
        <div>
          <h1 className="text-5xl font-extrabold uppercase text-gray-900 tracking-tight">
            {name || "YOUR NAME"}
          </h1>
          <div className="mt-6 flex flex-col gap-1 text-sm font-medium text-gray-600">
            <p>{address || "Your full address goes here"}</p>
            <p>{phone || "+1 234 567 8900"}</p>
            <p>{email || "hello@youremail.com"}</p>
          </div>
        </div>

        <div className="mt-12 space-y-10 flex-1">
          <div>
            <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 tracking-widest text-gray-800">
              PROFILE
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
              {objective || "Write a brief career objective or summary here."}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 tracking-widest text-gray-800">
              EXPERIENCE
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
              {experience || "Detail your work experience here."}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 tracking-widest text-gray-800">
              CERTIFICATIONS
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
              {certifications || "List your certifications here."}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 tracking-widest text-gray-800">
              DECLARATION
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-gray-700 leading-relaxed italic">
              {declaration || "I hereby declare that the information provided above is true."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      
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
        
        {/* ============================================
            LEFT FORM SECTION
        ============================================ */}
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
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm text-slate-400">Career Objective</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-24 resize-y"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Education</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-28 resize-y"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-slate-400">Work Experience</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none h-32 resize-y"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
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

        {/* ============================================
            RIGHT DESKTOP PREVIEW
        ============================================ */}
        <div className="hidden lg:flex lg:col-span-7 bg-slate-800 rounded-2xl overflow-auto border border-slate-700 relative items-start justify-center p-8 custom-scrollbar">
          {/* Scale wrapper to fit A4 paper on screen visually, but actual DOM remains 800px wide */}
          <div className="origin-top scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9] transition-transform duration-300">
            <ResumePreviewContent />
          </div>
        </div>
      </div>

      {/* ============================================
          MOBILE FLOATING BUTTON (Sticky Bottom)
      ============================================ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-900/50 p-4 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Eye className="w-5 h-5" />
          Preview & Download Resume
        </button>
      </div>

      {/* ============================================
          MOBILE PREVIEW MODAL
      ============================================ */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col lg:hidden">
          {/* Modal Header */}
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
          
          {/* Scrollable Modal Content */}
          <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-800 custom-scrollbar">
            {/* Visual scale wrapper for mobile, DOM remains A4 size */}
            <div className="origin-top scale-[0.4] sm:scale-[0.6] transition-transform">
              <ResumePreviewContent />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}