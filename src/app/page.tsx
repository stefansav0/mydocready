"use client";

import Link from "next/link";
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  LucideIcon, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  BookOpen,
  Wand2,
  Briefcase,
  MonitorPlay,
  RefreshCcw
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        {/* Subtle Background Decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            100% Free Online Tools
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.15]">
            Your Complete Digital <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Workspace & Toolkit
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            MyDocReady is your all-in-one platform to edit photos, build professional resumes, design presentations, convert files, and format official documents — instantly, securely, and completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <a href="#photo-tools" className="inline-flex justify-center items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">
              Explore Tools
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* --- CATEGORY 1: PHOTO & CREATIVE SUITE --- */}
      <section id="photo-tools" className="max-w-7xl mx-auto px-4 pt-20 pb-10 scroll-mt-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Photo & Image Suite</h2>
          <p className="text-slate-500 max-w-2xl">Professional editing, resizing, and formatting tools for all your image needs.</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            Icon={Wand2}
            title="Studio Image Editor"
            description="A complete browser-based studio. Color grade, apply presets, retouch skin, and use AI magic to perfect your photos."
            link="/image-edit"
            buttonText="Launch Editor"
            color="fuchsia"
          />
          <FeatureCard
            Icon={ImageIcon}
            title="Passport Photo Maker"
            description="Instantly crop your photo and change the background to white or blue to meet strict official application guidelines."
            link="/passport-photo"
            buttonText="Create Passport Photo"
            color="violet"
          />
          <FeatureCard
            Icon={Upload}
            title="Resize by KB"
            description="Compress or resize your heavy image files to an exact KB size requirement using smart, lossless optimization."
            link="/resize"
            buttonText="Compress Image"
            color="indigo"
          />
        </div>
      </section>

      {/* --- CATEGORY 2: DOCUMENT & CAREER SUITE --- */}
      <section id="document-tools" className="max-w-7xl mx-auto px-4 pt-10 pb-20 scroll-mt-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Career & Document Suite</h2>
          <p className="text-slate-500 max-w-2xl">Everything you need to land the job, present your ideas, and submit your paperwork.</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            Icon={Briefcase}
            title="Resume Builder"
            description="Craft professional, ATS-friendly resumes in minutes with our easy-to-use templates and automated builder."
            link="/resume-maker"
            buttonText="Build Resume"
            color="emerald"
          />
          <FeatureCard
            Icon={MonitorPlay}
            title="Slide Maker"
            description="Generate beautiful presentation slides and professional pitch decks instantly with our intuitive slide editor."
            link="/presentation-maker"
            buttonText="Create Slides"
            color="amber"
          />
          <FeatureCard
            Icon={RefreshCcw}
            title="File Converters"
            description="Seamlessly convert your files between PDF, Word, JPG, and PNG formats without losing any original quality."
            link="/converter"
            buttonText="Convert Files"
            color="rose"
          />
          <FeatureCard
            Icon={FileText}
            title="Insert into Document"
            description="Place your photos securely into a standard A4 PDF layout and download instantly for official physical printing."
            link="/insert-doc"
            buttonText="Format A4 Doc"
            color="blue"
          />
        </div>
      </section>

      {/* --- INFO / SEO SECTION --- */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Why Choose MyDocReady?</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Whether you're applying for a government ID, building a portfolio, preparing a college presentation, or stepping into a job interview, document requirements shouldn't slow you down.
              </p>
              <ul className="space-y-4 mt-6">
                {[
                  "Complete all-in-one suite: Images, Resumes, Slides, & PDFs",
                  "No software downloads or account registrations required",
                  "Fast, accurate, and optimized perfectly for mobile devices",
                  "100% private — your files never leave your browser"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <FileText className="w-48 h-48" />
               </div>
               <p className="text-slate-600 relative z-10 leading-relaxed italic">
                 "MyDocReady simplifies the tedious process of modern paperwork. From compressing images for online forms to writing the perfect resume, we've brought every tool you need into one clean, lightning-fast workspace."
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ & GUIDES SECTION --- */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-12 gap-12">
        
        {/* FAQs */}
        <div className="md:col-span-8 space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="Is MyDocReady truly free to use?"
              answer="Yes! All tools—including the Resume Builder, Pro Image Editor, and Converters—are completely free to use with no hidden fees, watermarks, or premium lock-outs."
            />
            <FAQItem
              question="Can I use the photo tools for official documents like PAN, Aadhaar, or passports?"
              answer="Absolutely. Our passport and resizing tools are precisely tailored to meet the strict image specifications required for standard official applications."
            />
            <FAQItem
              question="What file formats do the converters support?"
              answer="Our converters support the most common professional formats. You can convert JPGs and PNGs to PDF, turn PDFs into Word documents, and extract images from document files effortlessly."
            />
            <FAQItem
              question="Are my personal documents and photos safe?"
              answer="Yes. We respect your privacy. All processing happens securely right inside your web browser. We do not upload, store, or view your files on our servers."
            />
          </div>
        </div>

        {/* Guides Sidebar */}
        <div className="md:col-span-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Helpful Guides</h2>
            </div>
            <ul className="space-y-5">
              <li>
                <Link href="/blog/write-an-ats-resume" className="group flex flex-col">
                  <span className="text-slate-800 font-semibold group-hover:text-indigo-600 transition-colors">How to write an ATS Resume</span>
                  <span className="text-sm text-slate-500 mt-1">Get past the robots and secure your interview.</span>
                </Link>
              </li>
              <div className="h-px w-full bg-indigo-200/50"></div>
              <li>
                <Link href="/blog/common-mistakes-document-photos" className="group flex flex-col">
                  <span className="text-slate-800 font-semibold group-hover:text-indigo-600 transition-colors">Common Mistakes in ID Photos</span>
                  <span className="text-sm text-slate-500 mt-1">Learn what to avoid when submitting applications.</span>
                </Link>
              </li>
              <div className="h-px w-full bg-indigo-200/50"></div>
              <li>
                <Link href="/blog/resize-photos-by-kb" className="group flex flex-col">
                  <span className="text-slate-800 font-semibold group-hover:text-indigo-600 transition-colors">How to Resize by exact KB</span>
                  <span className="text-sm text-slate-500 mt-1">A step-by-step guide to lossless compression.</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </section>
    </div>
  );
}

/* --- COMPONENTS --- */

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color: "indigo" | "violet" | "blue" | "emerald" | "amber" | "rose" | "teal" | "fuchsia";
}

function FeatureCard({ Icon, title, description, link, buttonText, color }: FeatureCardProps) {
  // Expanded dynamic color mapping for all the new features
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white border-indigo-100",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white border-violet-100",
    fuchsia: "bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white border-fuchsia-100",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white border-emerald-100",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white border-amber-100",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white border-rose-100",
    teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white border-teal-100",
  };

  return (
    <div className="group bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border transition-colors duration-300 ${colorStyles[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">{description}</p>
      <Link
        href={link}
        className="inline-flex justify-center items-center w-full bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 px-4 py-2.5 rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
      >
        {buttonText}
      </Link>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{question}</h3>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{answer}</p>
    </div>
  );
}