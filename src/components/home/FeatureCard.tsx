import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

type CardColor =
  | "indigo"
  | "violet"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "teal"
  | "fuchsia";

interface FeatureCardProps {
  Icon?: LucideIcon;
  image?: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color: CardColor;
}

const COLORS: Record<CardColor, string> = {
  indigo:
    "bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-indigo-100",
  violet:
    "bg-violet-50 border-violet-100 text-violet-600 group-hover:bg-violet-100",
  blue:
    "bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-100",
  emerald:
    "bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-100",
  amber:
    "bg-amber-50 border-amber-100 text-amber-600 group-hover:bg-amber-100",
  rose:
    "bg-rose-50 border-rose-100 text-rose-600 group-hover:bg-rose-100",
  teal:
    "bg-teal-50 border-teal-100 text-teal-600 group-hover:bg-teal-100",
  fuchsia:
    "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-600 group-hover:bg-fuchsia-100",
};

export default function FeatureCard({
  Icon,
  image,
  title,
  description,
  link,
  buttonText,
  color,
}: FeatureCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:p-6">
      {/* Icon / Image */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 sm:h-14 sm:w-14 ${COLORS[color]}`}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            width={40}
            height={40}
            sizes="40px"
            className="h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8"
          />
        ) : Icon ? (
          <Icon
            className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7"
            aria-hidden="true"
          />
        ) : (
          <span
            className="h-2 w-2 rounded-full bg-current"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}
      <div className="mt-4 sm:mt-5">
        <h3 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
          {title}
        </h3>

        <p className="mt-2.5 text-sm leading-6 text-slate-600 sm:mt-3 sm:text-[15px]">
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-5 sm:pt-6">
        <Link
          href={link}
          aria-label={`${buttonText} - ${title}`}
          className="flex min-h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 sm:min-h-11"
        >
          {buttonText}
        </Link>
      </div>
    </article>
  );
}