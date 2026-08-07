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
    indigo: "bg-indigo-50 border-indigo-100",
    violet: "bg-violet-50 border-violet-100",
    blue: "bg-blue-50 border-blue-100",
    emerald: "bg-emerald-50 border-emerald-100",
    amber: "bg-amber-50 border-amber-100",
    rose: "bg-rose-50 border-rose-100",
    teal: "bg-teal-50 border-teal-100",
    fuchsia: "bg-fuchsia-50 border-fuchsia-100",
  };

  return (
    <div className="group flex flex-col rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Icon/Image */}
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-[26px] border ${colors[color]}`}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            width={104}
            height={104}
            className="h-[104px] w-[104px] object-cover"
            priority
          />
        ) : (
          Icon && <Icon className="h-12 w-12" />
        )}
      </div>

      <h3 className="mt-8 text-[42px] font-bold leading-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-5 flex-1 text-[20px] leading-9 text-slate-600">
        {description}
      </p>

      <Link
        href={link}
        className="mt-10 flex h-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-xl font-semibold text-slate-900 transition-all hover:bg-slate-100"
      >
        {buttonText}
      </Link>

    </div>
  );
}