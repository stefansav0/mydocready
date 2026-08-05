import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color: "indigo" | "violet" | "blue" | "emerald" | "amber" | "rose" | "teal" | "fuchsia";
}

export default function FeatureCard({ Icon, title, description, link, buttonText, color }: FeatureCardProps) {
  const colorStyles = {
    indigo: "bg-indigo-50/50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white border-indigo-100 group-hover:shadow-indigo-200",
    violet: "bg-violet-50/50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white border-violet-100 group-hover:shadow-violet-200",
    fuchsia: "bg-fuchsia-50/50 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white border-fuchsia-100 group-hover:shadow-fuchsia-200",
    blue: "bg-blue-50/50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white border-blue-100 group-hover:shadow-blue-200",
    emerald: "bg-emerald-50/50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white border-emerald-100 group-hover:shadow-emerald-200",
    amber: "bg-amber-50/50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white border-amber-100 group-hover:shadow-amber-200",
    rose: "bg-rose-50/50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white border-rose-100 group-hover:shadow-rose-200",
    teal: "bg-teal-50/50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white border-teal-100 group-hover:shadow-teal-200",
  };

  return (
    <div className="group bg-white border border-slate-200 shadow-sm rounded-3xl p-8 hover:shadow-2xl hover:border-transparent hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-300 ${colorStyles[color]} relative z-10`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{title}</h3>
      <p className="text-base text-slate-500 mb-8 flex-1 leading-relaxed relative z-10">{description}</p>
      <Link
        href={link}
        className="inline-flex justify-center items-center w-full bg-slate-50 text-slate-700 text-sm font-bold border border-slate-200 px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 relative z-10"
      >
        {buttonText}
      </Link>
    </div>
  );
}