"use client";

import { useState } from "react";
import {
  ChevronDown,
  CheckCircle2,
  FileText,
  Smartphone,
  ImageIcon,
  FileCheck2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const BENEFITS = [
  {
    label: "Easy-to-use document tools",
    icon: FileText,
  },
  {
    label: "PDF and file utilities",
    icon: FileCheck2,
  },
  {
    label: "Professional resume creation",
    icon: FileText,
  },
  {
    label: "Passport and ID photo tools",
    icon: ImageIcon,
  },
  {
    label: "Image resizing and compression",
    icon: Sparkles,
  },
  {
    label: "Works across desktop and mobile",
    icon: Smartphone,
  },
];

const FAQS: FAQ[] = [
  {
    question: "What is MyDocReady?",
    answer:
      "MyDocReady is an online platform offering practical tools for everyday document and image tasks. The platform includes tools for resumes, passport photos, image resizing, document scanning, file conversion, calculators, and other common digital tasks.",
  },
  {
    question: "Is MyDocReady free to use?",
    answer:
      "Many MyDocReady tools are available to use free of charge. Availability and features can vary between individual tools, so check the relevant tool page for the latest details.",
  },
  {
    question: "Can I use MyDocReady on mobile?",
    answer:
      "Yes. MyDocReady is designed to work across modern desktop, tablet, and mobile browsers, so you can use supported tools from the device that is most convenient for you.",
  },
  {
    question: "Is MyDocReady a government website?",
    answer:
      "No. MyDocReady is an independent online platform and is not affiliated with, operated by, or endorsed by any government organization or authority.",
  },
];

export default function TrustImpact() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenFAQ((current) => (current === index ? null : index));
  };

  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-my-doc-ready"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* ABOUT */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16 md:px-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <ShieldCheck
              className="h-7 w-7"
              aria-hidden="true"
            />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            About us
          </p>

          <h2
            id="about-my-doc-ready"
            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
          >
            About MyDocReady
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
            MyDocReady brings together practical tools for document
            preparation, image editing, resumes, passport photos, file
            conversion, and everyday digital tasks. Our goal is to make common
            document workflows easier by putting useful tools in one
            convenient place.
          </p>
        </div>

        {/* WHY CHOOSE MYDOCREADY */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 p-6 text-white shadow-xl sm:mt-20 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                Why MyDocReady
              </p>

              <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Simple tools for everyday tasks
              </h3>

              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
                From preparing application documents to resizing images and
                creating resumes, MyDocReady brings commonly needed tools
                together in a simple and accessible experience.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.label}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Icon
                        className="h-5 w-5 text-green-300"
                        aria-hidden="true"
                      />
                    </div>

                    <span className="text-sm font-medium leading-6 text-white">
                      {benefit.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div
          className="mt-16 sm:mt-20 lg:mt-24"
          aria-labelledby="faq-heading"
        >
          {/* FAQ Heading */}
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              FAQ
            </p>

            <h2
              id="faq-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
            >
              Frequently Asked Questions
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              Find quick answers to common questions about MyDocReady and its
              tools.
            </p>
          </div>

          {/* FAQ List */}
          <div className="mx-auto max-w-4xl space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFAQ === index;
              const answerId = `faq-answer-${index}`;
              const buttonId = `faq-question-${index}`;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600 sm:px-7 sm:py-6"
                  >
                    <span className="text-base font-semibold leading-7 text-slate-900 sm:text-lg">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </span>
                  </button>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-100 px-5 pb-6 pt-5 sm:px-7">
                        <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}