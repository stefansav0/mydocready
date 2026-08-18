import Link from "next/link";
import {
  FileText,
  Calculator,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B4DBB] text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-block"
              aria-label="MyDocReady Home"
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                MyDocReady
              </h2>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-blue-100 sm:text-base">
              Your professional digital workspace for creating documents,
              passport photos, resumes, PDFs, image tools, calculators,
              and everyday online utilities — all in one convenient place.
            </p>

            <Link
              href="/tools"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:shadow-md"
            >
              Explore All Tools
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Popular Tools */}
          <div>
            <div className="mb-5 flex items-center gap-2 text-base font-bold text-white">
              <FileText className="h-5 w-5 text-indigo-200" />
              Popular
            </div>

            <ul className="space-y-3.5 text-sm">
              <li>
                <Link
                  href="/resume-maker"
                  className="transition-colors hover:text-white"
                >
                  Resume Builder
                </Link>
              </li>

              <li>
                <Link
                  href="/passport-photo"
                  className="transition-colors hover:text-white"
                >
                  Passport Photo
                </Link>
              </li>

              <li>
                <Link
                  href="/resize"
                  className="transition-colors hover:text-white"
                >
                  Resize Image (KB)
                </Link>
              </li>

              <li>
                <Link
                  href="/converter"
                  className="transition-colors hover:text-white"
                >
                  PDF Converter
                </Link>
              </li>

              <li>
                <Link
                  href="/insert-doc"
                  className="transition-colors hover:text-white"
                >
                  Format A4 Document
                </Link>
              </li>
            </ul>
          </div>

          {/* Calculators */}
          <div>
            <div className="mb-5 flex items-center gap-2 text-base font-bold text-white">
              <Calculator className="h-5 w-5 text-emerald-200" />
              Calculators
            </div>

            <ul className="space-y-3.5 text-sm">
              <li>
                <Link
                  href="/calculators/age"
                  className="transition-colors hover:text-white"
                >
                  Age Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/calculators/gst"
                  className="transition-colors hover:text-white"
                >
                  GST Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/calculators/emi"
                  className="transition-colors hover:text-white"
                >
                  EMI Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/calculators/sip"
                  className="transition-colors hover:text-white"
                >
                  SIP Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/calculators/fd"
                  className="transition-colors hover:text-white"
                >
                  FD Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-5 flex items-center gap-2 text-base font-bold text-white">
              <Building2 className="h-5 w-5 text-amber-200" />
              Company
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-sm">
              <Link
                href="/about"
                className="transition-colors hover:text-white"
              >
                About Us
              </Link>

              <Link
                href="/blog"
                className="transition-colors hover:text-white"
              >
                Blog
              </Link>

              <Link
                href="/contact"
                className="transition-colors hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition-colors hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/disclaimer"
                className="transition-colors hover:text-white"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/20 pt-6 md:mt-14 md:flex-row md:items-center md:justify-between">

          {/* Copyright */}
          <p className="text-center text-sm text-blue-100 md:text-left">
            © {currentYear} MyDocReady. All rights reserved.
          </p>

          {/* Bottom Links */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
          >
            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Support
            </Link>

            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-white"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}