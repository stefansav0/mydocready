import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function HelpfulGuides() {
  return (
    <section className="bg-white py-24 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="p-4 bg-indigo-50 shadow-sm border border-indigo-100 rounded-2xl text-indigo-600">
            <BookOpen className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Helpful Guides</h2>
            <p className="text-gray-500 mt-2 text-lg">Expert advice to help you master your digital paperwork and applications.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/blog/write-an-ats-resume" className="group flex flex-col bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">How to write an ATS Resume</h3>
            <p className="text-gray-600 leading-relaxed mb-8 flex-1">Improve compatibility with applicant tracking systems and present your experience clearly.</p>
            <div className="flex items-center text-sm font-bold text-indigo-600">
              Read Article <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          <Link href="/blog/common-mistakes-document-photos" className="group flex flex-col bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">Common Mistakes in ID Photos</h3>
            <p className="text-gray-600 leading-relaxed mb-8 flex-1">Learn what to avoid when submitting applications.</p>
            <div className="flex items-center text-sm font-bold text-indigo-600">
              Read Article <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          <Link href="/blog/resize-photos-by-kb" className="group flex flex-col bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">How to Resize by exact KB</h3>
            <p className="text-gray-600 leading-relaxed mb-8 flex-1">A step-by-step guide to compressing images while preserving quality for uploads.</p>
            <div className="flex items-center text-sm font-bold text-indigo-600">
              Read Article <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
            View All Resources <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}