"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  FileImage,
  FileCheck,
  Wrench,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Back Button */}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 md:p-16 text-center">

          <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-sm font-semibold">
            About MyDocReady
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
            Simple Tools for Everyday Documents
          </h1>

          <p className="mt-8 text-lg text-slate-600 leading-8 max-w-3xl mx-auto">
            MyDocReady is an online platform that brings together document
            preparation tools, PDF utilities, passport photo creation,
            resume building, and image editing tools in one convenient place.
            Our goal is to make common document tasks easier through a simple,
            modern, and accessible web experience.
          </p>

        </div>

        {/* Features */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="text-blue-600 w-7 h-7" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Document Tools
            </h3>

            <p className="mt-3 text-slate-600 leading-7">
              Create and prepare documents for personal, educational,
              and professional use.
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
              <FileImage className="text-green-600 w-7 h-7" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Passport Photos
            </h3>

            <p className="mt-3 text-slate-600 leading-7">
              Prepare passport and ID photos using online editing tools.
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

            <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center">
              <FileCheck className="text-violet-600 w-7 h-7" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              PDF Utilities
            </h3>

            <p className="mt-3 text-slate-600 leading-7">
              Convert, organize, and manage PDF documents with online tools.
            </p>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
              <Wrench className="text-orange-600 w-7 h-7" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Image Tools
            </h3>

            <p className="mt-3 text-slate-600 leading-7">
              Resize, crop, compress, and optimize images for everyday needs.
            </p>

          </div>

        </div>

        {/* Mission */}

        <div className="mt-20 bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">

          <h2 className="text-3xl font-bold text-slate-900">
            Our Mission
          </h2>

          <p className="mt-6 text-slate-600 leading-8">
            We aim to provide practical online tools that simplify document
            preparation and related tasks. By bringing commonly used utilities
            together in one place, MyDocReady helps users complete everyday
            document work more efficiently.
          </p>

        </div>

        {/* Why Choose */}

        <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">

          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Why Choose MyDocReady?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <p className="text-slate-600">
                Multiple document tools available from one platform.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <p className="text-slate-600">
                Responsive design for desktop, tablet, and mobile devices.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <p className="text-slate-600">
                Clean and easy-to-use interface.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <p className="text-slate-600">
                Regular improvements and new tools added over time.
              </p>
            </div>

          </div>

        </div>

        {/* Disclaimer */}

        <div className="mt-16 rounded-3xl bg-blue-50 border border-blue-100 p-8">

          <h2 className="text-2xl font-bold text-slate-900">
            Important Information
          </h2>

          <p className="mt-4 text-slate-600 leading-8">
            MyDocReady is an independent online platform that provides document
            preparation tools and related resources. Unless specifically stated,
            MyDocReady is not affiliated with or endorsed by any government
            authority, organization, or institution.
          </p>

        </div>

        {/* Contact */}

        <div className="mt-20 text-center">

          <h2 className="text-3xl font-bold text-slate-900">
            Contact Us
          </h2>

          <p className="mt-5 text-slate-600 max-w-2xl mx-auto leading-8">
            Have a question, suggestion, or feedback? We'd love to hear from
            you. Visit our contact page and we'll get back to you as soon as
            possible.
          </p>

          <Link
            href="/contact"
            className="inline-flex mt-8 rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 transition"
          >
            Contact MyDocReady
          </Link>

        </div>

      </div>

    </div>
  );
}