import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ImageIcon,
  FileText,
  FileCheck,
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
    title: "How to Create an ATS-Friendly Resume",
    description:
      "Learn how to organize your resume, choose useful sections, and prepare a clean PDF that is easier for recruiters and applicant tracking systems to process.",
    href: "/blog/write-an-ats-resume",
    icon: FileText,
  },
  {
    title: "How to Prepare a Photo for Online Applications",
    description:
      "Understand common photo requirements such as dimensions, file size, background, cropping, and image quality before uploading a document or application photo.",
    href: "/blog/common-mistakes-document-photos",
    icon: ImageIcon,
  },
  {
    title: "How to Resize an Image to a Required File Size",
    description:
      "Learn practical ways to reduce an image to a specific KB limit while keeping it clear enough for forms, applications, and online uploads.",
    href: "/blog/resize-photos-by-kb",
    icon: BookOpen,
  },
  {
    title: "How to Prepare Documents for Online Applications",
    description:
      "A practical guide to organizing PDFs, images, signatures, and supporting files before submitting an online application.",
    href: "/blog/prepare-documents-for-online-applications",
    icon: FileCheck,
  },
];

export default function HelpfulGuides() {
  return (
    <section
      className="border-t border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="helpful-guides-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Practical Resources
          </p>

          <h2
            id="helpful-guides-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Guides for Documents & Applications
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Useful, practical information to help you prepare resumes, photos,
            PDFs, and other files for everyday applications and online forms.
          </p>
        </div>

        {/* Guide Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;

            return (
              <Link
                key={guide.href}
                href={guide.href}
                aria-label={`Read guide: ${guide.title}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-4"
              >
                {/* Icon */}
                <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon
                    size={24}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-indigo-600">
                  {guide.title}
                </h3>

                {/* Description */}
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {guide.description}
                </p>

                {/* CTA */}
                <div className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-600">
                  <span>Read Guide</span>

                  <ArrowRight
                    size={17}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center sm:mt-14">
          <Link
            href="/blog"
            className="group inline-flex items-center justify-center rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-4"
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