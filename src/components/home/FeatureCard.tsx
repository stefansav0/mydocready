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
    // Drastically reduced padding: p-5 on phones, p-6 on desktop. 
    // Reduced border radius to keep it looking sharp at a smaller scale.
    <div className="group flex flex-col rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

      {/* Icon/Image Wrapper - Scaled down to h-12 w-12 (phone) and h-14 w-14 (desktop) */}
      <div
        className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl border ${colors[color]}`}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            width={32}
            height={32}
            className="h-6 w-6 sm:h-7 sm:w-7 object-contain transition-transform duration-300 group-hover:scale-110"
            priority
          />
        ) : (
          Icon && <Icon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:scale-110" />
        )}
      </div>

      {/* Title - Brought down from massive 34px to text-lg (phone) and text-xl (desktop) */}
      <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-bold leading-tight text-slate-900">
        {title}
      </h3>

      {/* Description - Standardized to text-sm on phones, text-[15px] on desktop */}
      <p className="mt-2 sm:mt-3 flex-1 text-sm sm:text-[15px] leading-relaxed text-slate-500">
        {description}
      </p>

      {/* Button - Reduced height and text size so it doesn't overpower the card */}
      <Link
        href={link}
        className="mt-5 sm:mt-6 flex h-10 sm:h-11 w-full items-center justify-center rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300"
      >
        {buttonText}
      </Link>

    </div>
  );
}