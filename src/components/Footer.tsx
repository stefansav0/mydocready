import Link from "next/link";
import {
  FileText,
  Calculator,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B4DBB] text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid gap-12 lg:grid-cols-6">

          {/* Brand */}
          <div className="lg:col-span-2">

            <h2 className="text-4xl font-extrabold text-white">
              MyDocReady
            </h2>

            <p className="mt-6 text-slate-200 leading-8 max-w-sm">
              Your professional digital workspace. Create documents,
              passport photos, resumes, PDFs and calculators — all in one
              secure and easy-to-use platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <span className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                35+ Free Tools
              </span>

              <span className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                Privacy First
              </span>

            </div>

          </div>

          {/* Popular */}

          <div>

            <div className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <FileText className="h-5 w-5 text-indigo-300" />
              Popular
            </div>

            <ul className="space-y-4">

              <li>
                <Link
                  href="/resume-maker"
                  className="hover:text-white transition"
                >
                  Resume Builder
                </Link>
              </li>

              <li>
                <Link
                  href="/passport-photo"
                  className="hover:text-white transition"
                >
                  Passport Photo
                </Link>
              </li>

              <li>
                <Link
                  href="/resize"
                  className="hover:text-white transition"
                >
                  Resize Image (KB)
                </Link>
              </li>

              <li>
                <Link
                  href="/converter"
                  className="hover:text-white transition"
                >
                  PDF Converter
                </Link>
              </li>

              <li>
                <Link
                  href="/insert-doc"
                  className="hover:text-white transition"
                >
                  Format A4 Document
                </Link>
              </li>

            </ul>

          </div>

          {/* Calculators */}

          <div>

            <div className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <Calculator className="h-5 w-5 text-emerald-300" />
              Calculators
            </div>

            <ul className="space-y-4">

              <li>
                <Link
                  href="/calculators/age"
                  className="hover:text-white transition"
                >
                  Age Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/calculators/gst"
                  className="hover:text-white transition"
                >
                  GST Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/calculators/emi"
                  className="hover:text-white transition"
                >
                  EMI Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/calculators/sip"
                  className="hover:text-white transition"
                >
                  SIP Calculator
                </Link>
              </li>

              <li>
                <Link
                  href="/calculators/fd"
                  className="hover:text-white transition"
                >
                  FD Calculator
                </Link>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div className="lg:col-span-2">

            <div className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <Building2 className="h-5 w-5 text-amber-300" />
              Company
            </div>

            <div className="grid grid-cols-2 gap-y-4">

              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>

              <Link href="/blog" className="hover:text-white transition">
                Blog
              </Link>

              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>

              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>

              <Link href="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>

              <Link href="/disclaimer" className="hover:text-white transition">
                Disclaimer
              </Link>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-14 border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2 text-sm text-slate-200">

            

            © {new Date().getFullYear()} MyDocReady. All rights reserved.

          </div>

          <div className="flex items-center gap-8 text-sm">

            <Link href="/contact" className="hover:text-white transition">
              Support
            </Link>

            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}