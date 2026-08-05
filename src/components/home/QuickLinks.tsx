import Link from "next/link";
import { 
  Camera, Minimize, PenTool, CalendarDays, Briefcase, 
  Presentation, Banknote, TrendingUp, Users, Receipt 
} from "lucide-react";

export default function QuickLinks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6" aria-labelledby="quick-tools-heading">
      <h2 id="quick-tools-heading" className="sr-only">Popular tools</h2>
      
      <div className="flex flex-wrap gap-3 mt-8 w-full justify-center sm:justify-start">
        <Link href="/passport-photo" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Passport Photo</span>
        </Link>

        <Link href="/resize" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-green-300 dark:hover:border-green-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <Minimize className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Resize Image</span>
        </Link>

        <Link href="/scan-document" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 11h10M7 15h10M4 7h.01M4 11h.01M4 15h.01" />
          </svg>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Document Scanner</span>
        </Link>

        <Link href="/id-card-scan" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <circle cx="8.5" cy="11.5" r="1.5" />
          </svg>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">ID Card Scanner</span>
        </Link>

        <Link href="/image-to-text" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-amber-300 dark:hover:border-amber-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 7h18" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="9" width="18" height="10" rx="2" />
          </svg>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Image → Text</span>
        </Link>

        <Link href="/resize-signature" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-purple-300 dark:hover:border-purple-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <PenTool className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Resize Signature</span>
        </Link>

        <Link href="/calculators/age" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-amber-300 dark:hover:border-amber-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <CalendarDays className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Calculator</span>
        </Link>

        <Link href="/resume-maker" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-rose-300 dark:hover:border-rose-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <Briefcase className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Resume Builder</span>
        </Link>

        <Link href="/presentation-maker" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-cyan-300 dark:hover:border-cyan-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <Presentation className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Slide Maker</span>
        </Link>

        <Link href="/calculators/emi" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EMI Calculator</span>
        </Link>

        <Link href="/calculators/sip" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-violet-300 dark:hover:border-violet-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">SIP Calculator</span>
        </Link>

        <Link href="/calculators/split" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-orange-300 dark:hover:border-orange-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <Users className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bill Splitter</span>
        </Link>

        <Link href="/calculators/gst" className="group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md hover:border-sky-300 dark:hover:border-sky-900/50 hover:-translate-y-0.5 transition-all duration-300">
          <Receipt className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">GST Calculator</span>
        </Link>
      </div>
    </section>
  );
}