import Link from "next/link";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  Icon?: LucideIcon;
  image?: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color:
    | "indigo"
    | "violet"
    | "blue"
    | "emerald"
    | "amber"
    | "rose"
    | "teal"
    | "fuchsia";
}

export default function FeatureCard({
  Icon,
  image,
  title,
  description,
  link,
  buttonText,
  color,
}: FeatureCardProps) {
  const colors = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
    violet: "bg-violet-50 border-violet-100 text-violet-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    rose: "bg-rose-50 border-rose-100 text-rose-600",
    teal: "bg-teal-50 border-teal-100 text-teal-600",
    fuchsia: "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-600",
  };

  return (
    // Restored larger padding (p-10) and softer corner radius (rounded-[32px])
    <div className="group flex flex-col rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Icon/Image Wrapper - Restored to h-28 w-28 with rounded-[26px] */}
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-[26px] border ${colors[color]}`}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            width={64}
            height={64}
            className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-110"
            priority
          />
        ) : (
          Icon && <Icon className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
        )}
      </div>

      {/* Restored larger title (text-[32px] or 4xl) */}
      <h3 className="mt-8 text-3xl md:text-[34px] font-bold leading-tight text-slate-900">
        {title}
      </h3>

      {/* Restored larger description text (text-lg) */}
      <p className="mt-5 flex-1 text-lg leading-relaxed text-slate-500">
        {description}
      </p>

      {/* Restored softer, taller button */}
      <Link
        href={link}
        className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-base font-semibold text-slate-900 transition-all hover:bg-slate-100 hover:border-slate-300"
      >
        {buttonText}
      </Link>

    </div>
  );
}