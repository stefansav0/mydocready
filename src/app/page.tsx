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
  BookOpen
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
            The All-in-One Tool for <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Document & Photo Editing
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            MyDocReady helps you resize images by KB, generate passport-size photos, and insert photos into A4 PDFs for official submissions — instantly, securely, and completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <a href="#tools" className="inline-flex justify-center items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">
              Explore Tools
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION (TOOLS) --- */}
      <section id="tools" className="max-w-7xl mx-auto px-4 py-20 scroll-mt-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need to Get Ready</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Select a tool below to start processing your documents immediately without creating an account.</p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            Icon={Upload}
            title="Resize Photo"
            description="Compress or resize your image to a specific KB size using smart, lossless optimization."
            link="/resize"
            buttonText="Resize Now"
            color="indigo"
          />
          <FeatureCard
            Icon={ImageIcon}
            title="Passport Photo"
            description="Crop your photo and change the background to white or blue for official applications."
            link="/passport-photo"
            buttonText="Create Photo"
            color="violet"
          />
          <FeatureCard
            Icon={FileText}
            title="Insert into Document"
            description="Place your photo securely into an A4 PDF layout and download instantly for submission."
            link="/insert-doc"
            buttonText="Insert Photo"
            color="blue"
          />
        </div>
      </section>

      {/* --- INFO / SEO SECTION --- */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Why Choose MyDocReady?</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Whether you&apos;re applying for a government ID, college, or job, document requirements can be frustrating — especially when photo specs and sizes vary wildly. 
              </p>
              <ul className="space-y-4 mt-6">
                {[
                  "No software downloads or installations required",
                  "Fast, accurate, and optimized for mobile devices",
                  "Meets strict guidelines for standard applications",
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
                 "MyDocReady simplifies the tedious process of formatting photos. From compressing images for online forms to generating passport-style photos, we&apos;ve got your document needs covered in just a few clicks."
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
              question="Is MyDocReady free to use?"
              answer="Yes! All tools on MyDocReady are completely free to use with no hidden fees, watermarks, or premium lock-outs. We believe everyone should have access to basic document tools."
            />
            <FAQItem
              question="Can I use this for official documents like PAN, Aadhaar, or passports?"
              answer="Absolutely. Our tools are precisely tailored to meet the most common document and photo specifications used in official submissions across various countries."
            />
            <FAQItem
              question="Are my photos safe and private?"
              answer="Yes. We respect your privacy. All processing happens securely, and we do not store your images on our servers. Your data is deleted immediately after processing."
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
            <ul className="space-y-4">
              <li>
                <Link href="/blog/common-mistakes-document-photos" className="group flex flex-col">
                  <span className="text-slate-800 font-semibold group-hover:text-indigo-600 transition-colors">Common Mistakes in Photos</span>
                  <span className="text-sm text-slate-500 mt-1">Learn what to avoid when submitting ID photos.</span>
                </Link>
              </li>
              <div className="h-px w-full bg-indigo-200/50"></div>
              <li>
                <Link href="/blog/resize-photos-by-kb" className="group flex flex-col">
                  <span className="text-slate-800 font-semibold group-hover:text-indigo-600 transition-colors">How to Resize by KB</span>
                  <span className="text-sm text-slate-500 mt-1">A step-by-step guide to compressing images.</span>
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
  color: "indigo" | "violet" | "blue";
}

function FeatureCard({ Icon, title, description, link, buttonText, color }: FeatureCardProps) {
  // Dynamic color mapping for a subtle variety between cards
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  };

  return (
    <div className="group bg-white border border-slate-200 shadow-sm rounded-2xl p-8 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorStyles[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 mb-8 flex-1 leading-relaxed">{description}</p>
      <Link
        href={link}
        className="inline-flex justify-center items-center w-full bg-slate-50 text-slate-700 font-semibold border border-slate-200 px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-slate-900 mb-2">{question}</h3>
      <p className="text-slate-600 leading-relaxed">{answer}</p>
    </div>
  );
}