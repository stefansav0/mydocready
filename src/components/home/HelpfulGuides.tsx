import Link from "next/link";
import { ArrowRight, BookOpen, ImageIcon, FileText } from "lucide-react";

const guides = [
  {
    title: "How to Write an ATS-Friendly Resume",
    description:
      "Learn how to create a resume that passes Applicant Tracking Systems (ATS) and increases your chances of getting shortlisted.",
    href: "/blog/write-an-ats-resume",
    icon: FileText,
  },
  {
    title: "Common Mistakes in Passport & ID Photos",
    description:
      "Avoid the most common errors that lead to photo rejection for job applications, passports, visas, and government forms.",
    href: "/blog/common-mistakes-document-photos",
    icon: ImageIcon,
  },
  {
    title: "How to Resize Images to an Exact KB",
    description:
      "Compress images to the required file size while maintaining excellent quality for online forms and document uploads.",
    href: "/blog/resize-photos-by-kb",
    icon: BookOpen,
  },
];

export default function HelpfulGuides() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          

          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Helpful Guides 
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guide.icon;

            return (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl"
              >
                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={28} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                  {guide.title}
                </h3>

                {/* Description */}
                <p className="mt-4 flex-1 leading-7 text-gray-600">
                  {guide.description}
                </p>

                {/* CTA */}
                <div className="mt-8 inline-flex items-center font-semibold text-indigo-600">
                  Read Guide
                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-2"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl"
          >
            Explore All Guides
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}