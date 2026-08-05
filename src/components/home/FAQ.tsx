import React from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 h-full flex flex-col text-left">
      <h3 className="text-lg font-bold text-slate-900 mb-3">{question}</h3>
      <p className="text-base text-slate-600 leading-relaxed flex-1">{answer}</p>
    </div>
  );
}