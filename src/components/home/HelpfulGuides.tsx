import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ImageIcon,
  FileText,
  LucideIcon,
} from "lucide-react";

interface Guide {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const GUIDES: Guide[] = [
  {
    title: "How to Write an ATS-Friendly Resume",
    description:
      "Learn how to structure a resume for Applicant Tracking Systems and improve your chances of getting noticed by recruiters.",
    href: "/blog/write-an-ats-resume",
    icon: FileText,
  },
  {
    title: "Common Mistakes in Passport & ID Photos",
    description:
      "Learn about common photo problems that can cause rejection when submitting passport, visa, ID, and application photos.",
    href: "/blog/common-mistakes-document-photos",
    icon: ImageIcon,
  },
  {
    title: "How to Resize Images to an Exact KB",
    description:
      "Learn practical ways to reduce an image to a required file size while keeping the image clear enough for online forms.",
    href: "/blog/resize-photos-by-kb",
    icon: BookOpen,
  },
];

export default function HelpfulGuides() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50"
      aria-labelledby="helpful-guides-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Resources
          </p>

          <h2
            id="helpful-guides-heading"
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
          >
            Helpful Guides
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-8 text-slate-600">
            Practical guides to help you create better documents, prepare
            application photos, and handle common file requirements.
          </p>
        </div>

        {/* Guide Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;

            return (
              <Link
                key={guide.href}
                href={guide.href}
                aria-label={`Read guide: ${guide.title}`}
                className="group flex h-full flex-col rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-4"
              >
                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon
                    size={27}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-indigo-600">
                  {guide.title}
                </h3>

                {/* Description */}
                <p className="mt-4 flex-1 text-base leading-7 text-slate-600">
                  {guide.description}
                </p>

                {/* CTA */}
                <div className="mt-7 inline-flex items-center font-semibold text-indigo-600">
                  <span>Read Guide</span>

                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/blog"
            className="group inline-flex items-center justify-center rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-4"
          >
            <span>Explore All Guides</span>

            <ArrowRight
              size={18}
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}