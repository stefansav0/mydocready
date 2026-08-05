"use client";

import Link from "next/link";

import {
  ArrowRight,
  FileText,
  Sparkles,
  Layout,
  Zap,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Star,
  Users,
  Download,
  Building2,
  Briefcase,
  Globe,
  GraduationCap,
  Clock3,
  Lock,
  Target,
Award,
BadgeCheck,
FileCheck,
Search,
Rocket,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      
      

      {/* HERO SECTION */}
<section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 lg:py-32">

  {/* Background */}
  <div className="absolute inset-0">
    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"></div>
  </div>

  <div className="relative max-w-7xl mx-auto px-6">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* LEFT */}
      <div>

        

        <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-8">

          Create an
          <span className="text-blue-600"> ATS-Friendly </span>

          Resume That Gets

          <span className="text-indigo-600"> Interview Calls</span>

        </h1>

        <p className="text-xl text-slate-600 leading-8 mb-8">

          Build a professional resume in just a few minutes using modern,
          recruiter-approved templates.

          Increase your chances of getting shortlisted with resumes optimized
          for Applicant Tracking Systems (ATS).

        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-10">

          <Link
            href="/resume-maker/templates"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 font-bold flex items-center justify-center gap-2 shadow-xl"
          >
            Build My Resume
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#features"
            className="border border-slate-300 bg-white rounded-xl px-8 py-4 font-semibold hover:bg-slate-50 text-center"
          >
            Explore Features
          </a>

        </div>

        {/* Feature List */}

        <div className="grid sm:grid-cols-2 gap-4">

          <div className="flex items-center gap-3">

            <CheckCircle2 className="text-green-500 w-5 h-5" />

            <span>ATS Optimized Templates</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="text-green-500 w-5 h-5" />

            <span>Professional Designs</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="text-green-500 w-5 h-5" />

            <span>Download PDF Instantly</span>

          </div>

          <div className="flex items-center gap-3">

            <CheckCircle2 className="text-green-500 w-5 h-5" />

            <span>Easy Resume Editing</span>

          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="relative">
        {/* Dark App Shell mimicking the screenshot */}
        <div className="relative bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-[600px]">
          <div className="absolute left-4 top-4 rounded-full bg-white/95 text-slate-700 text-[10px] font-semibold uppercase tracking-[0.16em] px-3 py-2 shadow-sm">
            Resume preview
          </div>

          {/* Resume Canvas Area */}
          <div className="flex-1 p-6 flex justify-center items-start overflow-hidden bg-[#1e293b]">
            
            {/* The Resume Page (Scaled down to fit) */}
            <div className="bg-white w-full max-w-[420px] aspect-[1/1.414] shadow-lg flex text-[9px] leading-relaxed overflow-hidden">
              
              {/* Left Column (Blue-Gray) */}
              <div className="w-[35%] bg-[#dce4eb] p-4 flex flex-col gap-4 text-slate-800">
                
                {/* Photo Area */}
                <div className="w-14 h-14 rounded-full border-2 border-white mx-auto flex items-center justify-center text-slate-400 bg-slate-200 mt-2">
                  Photo
                </div>

                {/* Education */}
                <div>
                  <h4 className="font-bold border-b border-slate-800/20 pb-1 mb-2 text-[10px] uppercase text-slate-900 tracking-wider">Education</h4>
                  <div className="font-bold leading-tight">Bachelor of Arts - Political Science & History</div>
                  <div className="font-semibold mt-1">university name</div>
                  <div className="text-[7.5px] text-slate-500 mb-1">completed year | city, country</div>
                  <div className="text-[7.5px] leading-tight">Studied subjects including History, Political Science, Sociology, Hindi, and English. Developed strong communication, analytical, and research skills.</div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-bold border-b border-slate-800/20 pb-1 mb-2 text-[10px] uppercase text-slate-900 tracking-wider">Skills</h4>
                  <ul className="list-disc pl-3 text-[8px] space-y-0.5">
                    <li>Team Management</li>
                    <li>Communication Skills</li>
                    <li>Customer Relationship Mgt</li>
                    <li>Problem Solving</li>
                    <li>Time Management</li>
                    <li>Leadership</li>
                    <li>Microsoft Office</li>
                  </ul>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="font-bold border-b border-slate-800/20 pb-1 mb-2 text-[10px] uppercase text-slate-900 tracking-wider">Languages</h4>
                  <ul className="list-disc pl-3 text-[8px] space-y-0.5">
                    <li>Hindi (Native)</li>
                    <li>English (Professional)</li>
                  </ul>
                </div>

                {/* Interests */}
                <div>
                  <h4 className="font-bold border-b border-slate-800/20 pb-1 mb-2 text-[10px] uppercase text-slate-900 tracking-wider">Interests</h4>
                  <ul className="list-disc pl-3 text-[8px] space-y-0.5">
                    <li>Tech Blogging</li>
                    <li>Travelling & Photography</li>
                    <li>Open Source Contribution</li>
                  </ul>
                </div>
              </div>

              {/* Right Column (White) */}
              <div className="w-[65%] bg-white p-5 flex flex-col gap-4">
                
                {/* Header */}
                <div>
                  <h1 className="text-2xl font-black text-[#1a2b49] mb-1 uppercase tracking-tight">Jane Doe</h1>
                  <div className="text-[8px] text-slate-600 font-medium">123 Main Street, City, Country</div>
                  <div className="text-[8px] text-slate-600 font-medium">(123) 456-7890</div>
                  <div className="text-[8px] text-slate-600 font-medium">jane.doe@example.com</div>
                </div>

                {/* Profile */}
                <div>
                  <h4 className="font-bold text-[10px] uppercase mb-1 text-[#1a2b49] tracking-wider">Profile</h4>
                  <p className="text-[8px] text-slate-700 leading-relaxed">Results-driven professional with experience in operations and client management. Skilled in team coordination, problem-solving, and maintaining strong customer relationships. Seeking to contribute my expertise and grow within a dynamic organization.</p>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="font-bold text-[10px] uppercase mb-2 text-[#1a2b49] tracking-wider">Experience</h4>
                  
                  <div className="flex justify-between items-start font-bold text-[9px] text-slate-900">
                    <span>manager</span>
                    <span className="text-[7px] text-slate-500 font-normal uppercase">Jan 2022 - Present</span>
                  </div>
                  <div className="text-[8px] font-bold text-slate-700 mb-1">Company Name | delhi, india</div>
                  
                  <ul className="list-disc pl-3.5 text-[8px] text-slate-700 space-y-0.5 leading-relaxed">
                    <li>Managed daily operations and ensured smooth workflow across departments.</li>
                    <li>Coordinated with clients, vendors, and internal teams to meet business requirements.</li>
                    <li>Monitored service quality and resolved customer issues in a timely manner.</li>
                    <li>Supervised team members, assigned tasks, and tracked performance.</li>
                    <li>Prepared operational reports and maintained accurate records.</li>
                  </ul>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="font-bold text-[10px] uppercase mb-1 text-[#1a2b49] tracking-wider">Certifications</h4>
                  <ul className="list-disc pl-3.5 text-[8px] text-slate-700 space-y-0.5">
                    <li>Certified Operations Associate (COA)</li>
                    <li>Advanced Business Communication Course</li>
                  </ul>
                </div>

                {/* Declaration */}
                <div>
                  <h4 className="font-bold text-[10px] uppercase mb-1 text-[#1a2b49] tracking-wider">Note</h4>
                  <p className="text-[8px] text-slate-700 italic">This sample resume layout is for illustration only.</p>
                </div>

              </div>
            </div>
          </div>
        </div>



      </div>

    </div>

    {/* STATS */}

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">

      <div className="bg-white rounded-2xl p-8 shadow text-center">
  

  <h3 className="text-3xl font-bold">
    Faster
  </h3>

  <p className="text-slate-500">
    Workflows
  </p>
</div>

      <div className="bg-white rounded-2xl p-8 shadow text-center">

        

        <h3 className="text-3xl font-bold">

          6+

        </h3>

        <p className="text-slate-500">

          Templates

        </p>

      </div>

      <div className="bg-white rounded-2xl p-8 shadow text-center">

        

        <h3 className="text-3xl font-bold">

          4.9★

        </h3>

        <p className="text-slate-500">

          User Rating

        </p>

      </div>

      <div className="bg-white rounded-2xl p-8 shadow text-center">

        

        <h3 className="text-3xl font-bold">

          15 Min

        </h3>

        <p className="text-slate-500">

          Average Build Time

        </p>

      </div>

    </div>

  </div>

</section>

{/* TRUSTED SECTION */}

<section className="bg-white py-20">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-12">

      

      <h2 className="text-4xl font-bold mb-5">

        Helping Job Seekers Build Better Careers

      </h2>

      <p className="text-slate-500 max-w-3xl mx-auto text-lg">

        Whether you're a fresher searching for your first opportunity,
        an experienced professional looking for career growth,
        or a student preparing for internships,
        ResumeBuilder helps create resumes that impress recruiters
        and pass Applicant Tracking Systems.

      </p>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

      {[
        "Software",
        "Healthcare",
        "Education",
        "Finance",
        "Marketing",
        "Engineering",
      ].map((item) => (

        <div
          key={item}
          className="rounded-xl border bg-slate-50 py-6 text-center hover:border-blue-500 hover:shadow-lg transition"
        >

          <Building2 className="mx-auto text-blue-600 mb-3 w-8 h-8" />

          <p className="font-semibold">

            {item}

          </p>

        </div>

      ))}

    </div>

  </div>

</section>

      {/* FEATURES */}

<section
  id="features"
  className="py-24 bg-gradient-to-b from-slate-50 to-white"
>

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-20">

      
      <h2 className="text-5xl font-bold mt-6">

        Everything You Need to Build the Perfect Resume

      </h2>

      <p className="text-slate-500 mt-6 max-w-3xl mx-auto text-lg">

        ResumeBuilder combines modern design, ATS optimization,
        professional templates, and powerful editing tools to help
        you create resumes that recruiters actually want to read.

      </p>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      <FeatureCard
        icon={<Layout className="text-blue-600 w-8 h-8" />}
        title="Professional Templates"
        description="Choose from beautiful recruiter-approved templates designed for every profession."
      />

      <FeatureCard
        icon={<Zap className="text-yellow-500 w-8 h-8" />}
        title="Fast Resume Builder"
        description="Create a professional resume within minutes using our simple editor."
      />

      <FeatureCard
        icon={<Shield className="text-green-600 w-8 h-8" />}
        title="ATS Friendly"
        description="Our templates are optimized to pass Applicant Tracking Systems."
      />

      <FeatureCard
        icon={<Briefcase className="text-indigo-600 w-8 h-8" />}
        title="Job Ready"
        description="Perfect for freshers, professionals, freelancers and experienced candidates."
      />

      <FeatureCard
        icon={<GraduationCap className="text-pink-600 w-8 h-8" />}
        title="Student Friendly"
        description="Ideal for internships, placements, college admissions and scholarship applications."
      />

      <FeatureCard
        icon={<Globe className="text-cyan-600 w-8 h-8" />}
        title="Global Standard"
        description="Use internationally accepted resume layouts suitable for companies worldwide."
      />

    </div>

  </div>

</section>

{/* ================= ATS GUIDE ================= */}

<section className="py-24 bg-slate-900 text-white">

    <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

            <span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold">

                ATS Friendly Resume

            </span>

            <h2 className="text-5xl font-bold mt-8">

                Why ATS-Friendly Resumes Matter

            </h2>

            <p className="max-w-3xl mx-auto text-slate-300 mt-8 text-lg leading-8">

                More than 95% of large companies use Applicant Tracking
                Systems (ATS) to scan resumes before a recruiter reviews
                them. A resume with poor formatting or missing keywords
                may never reach a hiring manager.

                ResumeBuilder creates clean, professional resumes that are
                optimized for ATS software while maintaining an attractive
                appearance for recruiters.

            </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}

            <div className="space-y-8">

                <div className="flex gap-5">

                    <div className="bg-blue-600 rounded-xl p-3 h-fit">

                        <BadgeCheck />

                    </div>

                    <div>

                        <h3 className="text-2xl font-bold mb-2">

                            Recruiter Approved Layouts

                        </h3>

                        <p className="text-slate-300 leading-8">

                            Every template is designed with readability in
                            mind, ensuring recruiters can quickly identify
                            your experience, skills, education, and
                            achievements.

                        </p>

                    </div>

                </div>

                <div className="flex gap-5">

                    <div className="bg-green-600 rounded-xl p-3 h-fit">

                        <Search />

                    </div>

                    <div>

                        <h3 className="text-2xl font-bold mb-2">

                            Optimized for ATS Software

                        </h3>

                        <p className="text-slate-300 leading-8">

                            Proper headings, clean typography,
                            keyword-friendly formatting,
                            and structured layouts help ATS systems
                            understand your resume correctly.

                        </p>

                    </div>

                </div>

                <div className="flex gap-5">

                    <div className="bg-indigo-600 rounded-xl p-3 h-fit">

                        <Rocket />

                    </div>

                    <div>

                        <h3 className="text-2xl font-bold mb-2">

                            Increase Interview Opportunities

                        </h3>

                        <p className="text-slate-300 leading-8">

                            A well-structured resume improves visibility
                            during recruitment and increases your chances
                            of receiving interview invitations.

                        </p>

                    </div>

                </div>

            </div>

            {/* RIGHT */}

            <div className="bg-white rounded-3xl p-10 text-slate-900 shadow-2xl">

                <h3 className="text-3xl font-bold mb-8">

                    ATS Checklist

                </h3>

                <div className="space-y-5">

                    {[
                        "Professional Resume Format",
                        "Easy to Read Layout",
                        "Clear Section Headings",
                        "Keyword Optimized",
                        "PDF Download",
                        "No Complex Tables",
                        "Modern Typography",
                        "Recruiter Friendly Design",
                    ].map((item) => (

                        <div
                            key={item}
                            className="flex items-center gap-4"
                        >

                            <CheckCircle2 className="text-green-600" />

                            <span className="font-medium">

                                {item}

                            </span>

                        </div>

                    ))}

                </div>

                <div className="mt-10 bg-green-100 rounded-xl p-6">

                    <div className="text-green-700 font-bold text-xl">

                        Estimated ATS Compatibility

                    </div>

                    <div className="text-5xl font-black mt-3">

                        98%

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>

{/* WHY CHOOSE MYDOCREADY */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-20">
      <span className="text-blue-600 font-bold uppercase tracking-widest">
        Why Choose MyDocReady
      </span>

      <h2 className="text-5xl font-bold mt-6">
        Everything You Need to Build an ATS-Friendly Resume
      </h2>

      <p className="max-w-3xl mx-auto text-slate-500 mt-6 text-lg leading-8">
        MyDocReady makes resume creation simple, fast, and effective. Our ATS-friendly templates, intuitive editor, and instant PDF downloads help students, freshers, and professionals create resumes that stand out and get noticed by recruiters.
      </p>
    </div>

    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          icon: <FileText className="w-10 h-10 text-blue-600" />,
          title: "Professional Templates",
          desc: "Modern, recruiter-friendly templates designed for resumes and other professional documents.",
        },
        {
          icon: <Zap className="w-10 h-10 text-amber-500" />,
          title: "Quick & Easy",
          desc: "Create polished documents in just a few minutes with guided forms and smart editing.",
        },
        {
          icon: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
          title: "Secure & Private",
          desc: "Your information remains protected with secure storage and privacy-focused design.",
        },
        {
          icon: <Download className="w-10 h-10 text-indigo-600" />,
          title: "Instant Downloads",
          desc: "Download high-quality PDF documents that are ready to share, print, or submit.",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
          <div className="mb-6">{item.icon}</div>

          <h3 className="mb-4 text-2xl font-bold text-slate-900">
            {item.title}
          </h3>

          <p className="leading-7 text-slate-600">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ================= RESUME WRITING GUIDE ================= */}

<section className="py-24 bg-slate-50">

  <div className="max-w-6xl mx-auto px-6">

    <div className="text-center mb-16">

      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">

        Resume Writing Guide

      </span>

      <h2 className="text-5xl font-bold mt-6">

        How to Create a Professional Resume That Gets Interviews

      </h2>

      <p className="text-slate-500 mt-6 text-lg max-w-3xl mx-auto">

        A resume is often the first impression you make on an employer.
        Before a recruiter meets you or schedules an interview, your
        resume tells your professional story. A clear, well-organized,
        and ATS-friendly resume helps employers quickly understand your
        skills, experience, education, and achievements.

      </p>

    </div>

    <div className="space-y-12">

      {/* SECTION */}

      <div className="bg-white rounded-3xl shadow-sm border p-10">

        <h3 className="text-3xl font-bold mb-6">

          Why Is a Professional Resume Important?

        </h3>

        <div className="space-y-6 text-slate-600 leading-8 text-lg">

          <p>

            Recruiters usually spend only a short time reviewing each
            application before deciding whether to continue with a
            candidate. Because of this, a resume should communicate your
            qualifications clearly and efficiently. A professional layout,
            consistent formatting, and well-structured content make it
            easier for hiring teams to identify your strengths.

          </p>

          <p>

            A resume should do more than list previous jobs. It should
            highlight measurable achievements, demonstrate relevant
            skills, and explain how your experience matches the role you
            are applying for. Strong resumes focus on value, showing how
            you contributed to projects, teams, or business goals.

          </p>

          <p>

            Employers often receive many applications for a single
            vacancy. A well-written resume increases your chances of
            moving to the next stage by presenting your qualifications in
            a professional and organized way.

          </p>

        </div>

      </div>

      {/* SECTION */}

      <div className="bg-white rounded-3xl shadow-sm border p-10">

        <h3 className="text-3xl font-bold mb-6">

          Understanding Applicant Tracking Systems (ATS)

        </h3>

        <div className="space-y-6 text-slate-600 leading-8 text-lg">

          <p>

            Many organizations use Applicant Tracking Systems (ATS) to
            organize and review job applications. These systems help
            recruiters search for relevant skills, qualifications, and
            experience before manually reviewing resumes.

          </p>

          <p>

            An ATS-friendly resume uses clear headings, standard fonts,
            logical section order, and clean formatting. Avoiding
            unnecessary graphics or complicated layouts can help ensure
            your information is interpreted correctly.

          </p>

          <p>

            Tailoring your resume for each application by including
            relevant skills and terminology from the job description can
            make your resume more relevant to the position.

          </p>

        </div>

      </div>

      {/* SECTION */}

      <div className="bg-white rounded-3xl shadow-sm border p-10">

        <h3 className="text-3xl font-bold mb-6">

          Choosing the Right Resume Template

        </h3>

        <div className="space-y-6 text-slate-600 leading-8 text-lg">

          <p>

            Selecting an appropriate template helps create a positive
            first impression. A professional resume should be clean,
            consistent, and easy to read on both desktop and mobile
            devices.

          </p>

          <p>

            Consider the industry you are applying to when selecting a
            template. Creative roles may allow more visual designs, while
            finance, engineering, healthcare, education, and government
            positions generally benefit from simple and structured
            layouts.

          </p>

          <p>

            Consistent spacing, readable typography, and organized
            sections improve readability for both recruiters and ATS
            software.

          </p>

        </div>

      </div>

    </div>

  </div>

</section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center">How to build your resume</h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-[2px] bg-slate-800 z-0"></div>
            
            <Step 
              number="1"
              title="Pick a Template"
              description="Select from our library of professional, field-tested designs."
            />
            <Step 
              number="2"
              title="Fill in your Details"
              description="Follow our easy prompts to add your experience, skills, and education."
            />
            <Step 
              number="3"
              title="Download & Apply"
              description="Export as a pixel-perfect PDF and start landing interviews."
            />
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/resume-maker/templates" 
              className="inline-flex bg-white hover:bg-slate-100 text-slate-900 text-lg font-bold py-4 px-8 rounded-full transition-all items-center gap-2"
            >
              Start Building Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}

// Sub-components for cleaner code
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-white rounded-3xl p-8 border hover:border-blue-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">

      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition">

        {icon}

      </div>

      <h3 className="text-2xl font-bold mb-4">

        {title}

      </h3>

      <p className="text-slate-500 leading-8">

        {description}

      </p>

    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-blue-600 text-white font-bold text-xl rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-900">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}