"use client";

import { useState } from "react";
import {
  ChevronDown,
  CheckCircle2,
  FileText,
} from "lucide-react";

export default function TrustImpact() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const benefits = [
    "Easy-to-use document tools",
    "PDF conversion and editing",
    "Resume creation",
    "Passport photo maker",
    "Image resize & compression",
    "Works on desktop and mobile",
  ];

  const faqs = [
    {
      question: "What is MyDocReady?",
      answer:
        "MyDocReady is an online platform that provides document tools including PDF utilities, resume builder, passport photo maker, image tools, and other resources to simplify everyday documentation.",
    },
    {
      question: "Is MyDocReady free to use?",
      answer:
        "Yes. Most tools are available free to use. Some premium features may be introduced in the future to provide additional functionality.",
    },
    {
      question: "Can I use MyDocReady on mobile?",
      answer:
        "Absolutely. MyDocReady is fully responsive and works smoothly on desktop, tablet, and mobile devices.",
    },
    {
      question: "Is MyDocReady a government website?",
      answer:
        "No. MyDocReady is an independent platform and is not affiliated with any government organization or authority.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* ABOUT */}

        <div className="rounded-3xl border border-slate-200 bg-slate-50 shadow-sm px-8 py-16 md:px-20 text-center">

          

          <h2 className="mt-8 text-4xl md:text-5xl font-bold text-slate-900">
            About MyDocReady
          </h2>

          <p className="mt-8 max-w-4xl mx-auto text-lg leading-9 text-slate-600">
            MyDocReady is your all-in-one destination for document preparation,
            PDF utilities, resume building, passport photo creation, and image
            editing tools. We simplify everyday documentation by providing
            reliable, easy-to-use online tools in one convenient place.
          </p>

          
        </div>

        {/* WHY CHOOSE */}

        <div className="mt-24 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div>
              <h3 className="text-3xl font-bold">
                Why Choose MyDocReady?
              </h3>

              <p className="mt-5 text-blue-100 leading-8">
                Everything you need for creating, editing and managing
                documents in one place. Fast, responsive and easy for everyone.
              </p>
            </div>

            <div className="grid gap-4">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* FAQ */}

        <div className="mt-24">

          <div className="text-center mb-12">

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="space-y-6">

            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    onClick={() =>
                      setOpenFAQ(isOpen ? -1 : index)
                    }
                    className="flex w-full items-center justify-between px-8 py-7 text-left"
                  >
                    <span className="text-xl font-semibold text-slate-900">
                      {faq.question}
                    </span>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="h-6 w-6 text-blue-600" />
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="border-t border-slate-100 px-8 pb-7 pt-5">
                      <p className="leading-8 text-slate-600">
                        {faq.answer}
                      </p>
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