"use client";

import { useState } from "react";
import {
  ChevronDown,
  FileText,
  Smartphone,
  ImageIcon,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const BENEFITS = [
  {
    label: "Document and PDF tools",
    icon: FileText,
  },
  {
    label: "Resume and application tools",
    icon: FileCheck2,
  },
  {
    label: "Passport and ID photo tools",
    icon: ImageIcon,
  },
  {
    label: "Image resizing and compression",
    icon: ImageIcon,
  },
  {
    label: "Works on desktop and mobile",
    icon: Smartphone,
  },
];

const FAQS: FAQ[] = [
  {
    question: "What is MyDocReady?",
    answer:
      "MyDocReady is an independent online platform that provides practical tools for preparing documents, images, resumes, application files, and other everyday digital materials.",
  },
  {
    question: "Is MyDocReady free to use?",
    answer:
      "Many MyDocReady tools are available free of charge. Features and usage options can vary between tools, so check the individual tool page for the current details.",
  },
  {
    question: "Can I use MyDocReady on my phone?",
    answer:
      "Yes. MyDocReady is designed to work in modern desktop, tablet, and mobile browsers. Supported tools can be accessed directly from your browser without installing desktop software.",
  },
  {
    question: "Is MyDocReady a government website?",
    answer:
      "No. MyDocReady is an independent online service and is not affiliated with, operated by, or endorsed by any government organization or authority.",
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
      aria-labelledby="why-mydocready-heading"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* WHY MYDOCREADY */}
        <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-indigo-50 p-6 sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Content */}
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <ShieldCheck
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Why MyDocReady
              </p>

              <h2
                id="why-mydocready-heading"
                className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
              >
                Practical tools for everyday document tasks
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                MyDocReady brings commonly needed document, image, and
                application tools together in one place. Use the tools
                directly in your browser to prepare files for work,
                applications, forms, and everyday digital tasks.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.label}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <span className="text-sm font-medium leading-6 text-slate-700">
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
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Frequently Asked Questions
            </p>

            <h2
              id="faq-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Questions About MyDocReady
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              Learn more about the platform and how its online tools work.
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFAQ === index;
              const answerId = `faq-answer-${index}`;
              const buttonId = `faq-question-${index}`;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
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