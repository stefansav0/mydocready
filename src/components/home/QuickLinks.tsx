import Link from "next/link";
import {
  Camera,
  Minimize,
  ScanLine,
  FileText,
  PenTool,
  Image,
  Calculator,
  LucideIcon,
} from "lucide-react";

type QuickLinkColor =
  | "blue"
  | "green"
  | "indigo"
  | "amber"
  | "purple"
  | "rose"
  | "cyan"
  | "emerald";

interface QuickLink {
  href: string;
  label: string;
  icon: LucideIcon;
  color: QuickLinkColor;
}

const QUICK_LINKS: QuickLink[] = [
  {
    href: "/passport-photo",
    label: "Passport Photo",
    icon: Camera,
    color: "blue",
  },
  {
    href: "/resize",
    label: "Resize Image",
    icon: Minimize,
    color: "green",
  },
  {
    href: "/scan-document",
    label: "Document Scanner",
    icon: ScanLine,
    color: "indigo",
  },
  {
    href: "/image-to-text",
    label: "Image to Text",
    icon: Image,
    color: "amber",
  },
  {
    href: "/resize-signature",
    label: "Resize Signature",
    icon: PenTool,
    color: "purple",
  },
  {
    href: "/resume-maker",
    label: "Resume Builder",
    icon: FileText,
    color: "rose",
  },
  {
    href: "/converter",
    label: "File Converter",
    icon: FileText,
    color: "cyan",
  },
  {
    href: "/calculators",
    label: "Calculators",
    icon: Calculator,
    color: "emerald",
  },
];

const COLOR_CLASSES: Record<
  QuickLinkColor,
  {
    icon: string;
    hover: string;
  }
> = {
  blue: {
    icon: "text-blue-600 dark:text-blue-400",
    hover:
      "hover:border-blue-300 dark:hover:border-blue-900/50",
  },

  green: {
    icon: "text-green-600 dark:text-green-400",
    hover:
      "hover:border-green-300 dark:hover:border-green-900/50",
  },

  indigo: {
    icon: "text-indigo-600 dark:text-indigo-400",
    hover:
      "hover:border-indigo-300 dark:hover:border-indigo-900/50",
  },

  amber: {
    icon: "text-amber-600 dark:text-amber-400",
    hover:
      "hover:border-amber-300 dark:hover:border-amber-900/50",
  },

  purple: {
    icon: "text-purple-600 dark:text-purple-400",
    hover:
      "hover:border-purple-300 dark:hover:border-purple-900/50",
  },

  rose: {
    icon: "text-rose-600 dark:text-rose-400",
    hover:
      "hover:border-rose-300 dark:hover:border-rose-900/50",
  },

  cyan: {
    icon: "text-cyan-600 dark:text-cyan-400",
    hover:
      "hover:border-cyan-300 dark:hover:border-cyan-900/50",
  },

  emerald: {
    icon: "text-emerald-600 dark:text-emerald-400",
    hover:
      "hover:border-emerald-300 dark:hover:border-emerald-900/50",
  },
};

export default function QuickLinks() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6"
      aria-labelledby="quick-tools-heading"
    >
      <h2 id="quick-tools-heading" className="sr-only">
        Popular MyDocReady tools
      </h2>

      <div className="flex flex-wrap gap-3 mt-8 w-full justify-center">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          const colors = COLOR_CLASSES[item.color];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full ${colors.hover} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
            >
              <Icon
                className={`w-5 h-5 ${colors.icon} group-hover:scale-110 transition-transform`}
              />

              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}