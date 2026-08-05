import { Check } from "lucide-react";

export default function FooterCTA() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Simplify Your Document Tasks
        </h2>
        <p className="mt-6 text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Create resumes, edit PDFs, resize images, prepare passport photos,
          and access useful document tools—all in one secure place.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {["Easy to Use", "Mobile Friendly", "Privacy Focused", "35+ Helpful Tools"].map((feature, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 px-4 py-2 rounded-full text-slate-300 text-sm font-medium shadow-sm backdrop-blur-sm"
            >
              <Check size={14} className="text-indigo-400" />
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="#primary-tools"
            className="inline-flex items-center justify-center bg-white text-slate-900 font-semibold text-base px-8 py-4 rounded-full hover:bg-slate-100 hover:shadow-lg hover:shadow-white/10 ring-1 ring-white/50 transition-all duration-200"
          >
            Explore Free Tools
          </a>
        </div>
      </div>
    </section>
  );
}