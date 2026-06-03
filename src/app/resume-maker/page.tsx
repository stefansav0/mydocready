"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ResumeMaker() {

  // ============================================
  // STATES
  // ============================================

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

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

  const [certifications, setCertifications] =
    useState("");

  const [declaration, setDeclaration] =
    useState("");

  // ============================================
  // RESUME REF
  // ============================================

  const resumeRef = useRef<HTMLDivElement>(null);

  // ============================================
  // IMAGE UPLOAD
  // ============================================

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) {

      const imageUrl = URL.createObjectURL(file);

      setProfileImage(imageUrl);
    }
  };

  // ============================================
  // DOWNLOAD PDF
  // ============================================

  const downloadPDF = async () => {

    const input = resumeRef.current;

    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save("resume.pdf");
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      {/* TITLE */}

      <h1 className="text-5xl font-bold text-center mb-10">
        Professional Resume Builder
      </h1>

      {/* MAIN GRID */}

      <div className="grid lg:grid-cols-2 gap-10">

        {/* ============================================
            LEFT FORM SECTION
        ============================================ */}

        <div className="bg-slate-900 p-6 rounded-2xl overflow-y-auto max-h-screen">

          <h2 className="text-3xl font-bold mb-8">
            Resume Details
          </h2>

          {/* PROFILE PHOTO */}

          <label className="block mb-2 font-semibold">
            Profile Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-3 rounded-lg bg-slate-800 mb-6"
          />

          {/* FULL NAME */}

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* ADDRESS */}

          <textarea
            placeholder="Address"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-24 outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* PHONE */}

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* CAREER OBJECTIVE */}

          <textarea
            placeholder="Career Objective"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-32 outline-none"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />

          {/* EDUCATION */}

          <textarea
            placeholder="Education"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-32 outline-none"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />

          {/* WORK EXPERIENCE */}

          <textarea
            placeholder="Work Experience"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-40 outline-none"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          {/* SKILLS */}

          <textarea
            placeholder="Skills"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-32 outline-none"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          {/* INTERESTS */}

          <textarea
            placeholder="Interests"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-24 outline-none"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />

          {/* LANGUAGES */}

          <textarea
            placeholder="Languages"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-24 outline-none"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />

          {/* CERTIFICATIONS */}

          <textarea
            placeholder="Certifications"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-24 outline-none"
            value={certifications}
            onChange={(e) =>
              setCertifications(e.target.value)
            }
          />

          {/* DECLARATION */}

          <textarea
            placeholder="Declaration"
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 h-24 outline-none"
            value={declaration}
            onChange={(e) =>
              setDeclaration(e.target.value)
            }
          />

          {/* DOWNLOAD BUTTON */}

          <button
            onClick={downloadPDF}
            className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-xl font-semibold text-lg mt-4"
          >
            Download Resume PDF
          </button>

        </div>

        {/* ============================================
            RIGHT RESUME PREVIEW
        ============================================ */}

        <div
          ref={resumeRef}
          className="bg-[#f3f3f3] text-black rounded-2xl overflow-hidden"
        >

          <div className="grid grid-cols-3">

            {/* ============================================
                LEFT SIDEBAR
            ============================================ */}

            <div className="bg-[#d9dfe7] p-6 min-h-screen">

              {/* PROFILE IMAGE */}

              {profileImage && (

                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-8 border-white mx-auto"
                />

              )}

              {/* EDUCATION */}

              <div className="mt-10">

                <h2 className="text-2xl font-bold border-b border-gray-500 pb-2">
                  EDUCATION
                </h2>

                <p className="mt-4 whitespace-pre-line">
                  {education || "Education"}
                </p>

              </div>

              {/* INTERESTS */}

              <div className="mt-10">

                <h2 className="text-2xl font-bold border-b border-gray-500 pb-2">
                  INTERESTS
                </h2>

                <p className="mt-4 whitespace-pre-line">
                  {interests || "Interests"}
                </p>

              </div>

              {/* SKILLS */}

              <div className="mt-10">

                <h2 className="text-2xl font-bold border-b border-gray-500 pb-2">
                  SKILLS
                </h2>

                <p className="mt-4 whitespace-pre-line">
                  {skills || "Skills"}
                </p>

              </div>

              {/* LANGUAGES */}

              <div className="mt-10">

                <h2 className="text-2xl font-bold border-b border-gray-500 pb-2">
                  LANGUAGES
                </h2>

                <p className="mt-4 whitespace-pre-line">
                  {languages || "Languages"}
                </p>

              </div>

            </div>

            {/* ============================================
                RIGHT CONTENT
            ============================================ */}

            <div className="col-span-2 p-10">

              {/* NAME */}

              <h1 className="text-5xl font-bold uppercase">
                {name || "YOUR NAME"}
              </h1>

              {/* ADDRESS */}

              <p className="mt-4 text-gray-700 whitespace-pre-line">
                {address || "Your Address"}
              </p>

              {/* PHONE */}

              <p className="mt-2">
                {phone || "+91 XXXXX XXXXX"}
              </p>

              {/* EMAIL */}

              <p className="mt-1">
                {email || "your@email.com"}
              </p>

              {/* CAREER OBJECTIVE */}

              <div className="mt-10">

                <h2 className="text-3xl font-bold border-b border-gray-500 pb-2">
                  CAREER OBJECTIVE
                </h2>

                <p className="mt-4 whitespace-pre-line">
                  {objective || "Career Objective"}
                </p>

              </div>

              {/* WORK EXPERIENCE */}

              <div className="mt-10">

                <h2 className="text-3xl font-bold border-b border-gray-500 pb-2">
                  WORK EXPERIENCE
                </h2>

                <p className="mt-4 whitespace-pre-line">
                  {experience || "Work Experience"}
                </p>

              </div>

              {/* CERTIFICATIONS */}

              <div className="mt-10">

                <h2 className="text-3xl font-bold border-b border-gray-500 pb-2">
                  CERTIFICATIONS
                </h2>

                <p className="mt-4 whitespace-pre-line">
                  {certifications || "Certifications"}
                </p>

              </div>

              {/* DECLARATION */}

              <div className="mt-10">

                <h2 className="text-3xl font-bold border-b border-gray-500 pb-2">
                  DECLARATION
                </h2>

                <p className="mt-4 whitespace-pre-line">
                  {declaration || "Declaration"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}