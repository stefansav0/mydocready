"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  Calculator,
  RefreshCcw,
  GraduationCap,
  Briefcase
} from "lucide-react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
}

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split("T")[0] 
  );
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string>("");

  const calculateAge = () => {
    setError("");
    setResult(null);

    if (!dob) {
      setError("Please enter a Date of Birth.");
      return;
    }

    const birthDate = new Date(dob);
    const comparisonDate = targetDate ? new Date(targetDate) : new Date();

    if (birthDate > comparisonDate) {
      setError("Date of Birth cannot be in the future or after the target cut-off date.");
      return;
    }

    let years = comparisonDate.getFullYear() - birthDate.getFullYear();
    let months = comparisonDate.getMonth() - birthDate.getMonth();
    let days = comparisonDate.getDate() - birthDate.getDate();

    // Adjust if days are negative (borrow days from previous month)
    if (days < 0) {
      months--;
      const prevMonth = new Date(comparisonDate.getFullYear(), comparisonDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust if months are negative (borrow a year)
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total metrics
    const diffTime = Math.abs(comparisonDate.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;

    setResult({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
    });
  };

  const resetForm = () => {
    setDob("");
    setTargetDate(new Date().toISOString().split("T")[0]);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- HERO / SEO HEADER --- */}
      <div className="bg-gray-50 border-b border-gray-100 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Tools
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-6 shadow-sm">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
                Exact Age Calculator by Date of Birth
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Instantly calculate your chronological age in years, months, weeks, and days. The perfect tool for verifying government exam eligibility, passport applications, and legal age requirements.
              </p>
            </div>
            <div className="hidden md:flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
                <ShieldCheck className="w-4 h-4" />
                100% Private Processing
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                <GraduationCap className="w-4 h-4" />
                Exam Cut-off Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- INTERACTIVE CALCULATOR SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left: Input Form */}
          <div className="lg:w-5/12 p-8 md:p-10 bg-gray-50/80 border-r border-gray-100 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" /> Enter Your Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="dob" className="block text-sm font-bold text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label htmlFor="targetDate" className="block text-sm font-bold text-gray-700">
                    Age at Date (Cut-off Date)
                  </label>
                </div>
                <input
                  type="date"
                  id="targetDate"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
                />
                <p className="text-xs text-gray-500 mt-2 font-medium">Defaults to today. Change this to check exam eligibility dates.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">⚠️</span> {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={calculateAge}
                  className="flex-1 bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
                >
                  Calculate Exact Age
                </button>
                <button
                  onClick={resetForm}
                  className="p-4 bg-white border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
                  title="Reset Form"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results Display */}
          <div className="lg:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center min-h-[400px]">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4 py-12">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-lg font-medium max-w-sm">Enter your date of birth and hit calculate to reveal your comprehensive age breakdown.</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Calculation Successful
                </h3>
                
                {/* Primary Result */}
                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="flex-1 min-w-[110px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 text-center shadow-sm">
                    <div className="text-5xl md:text-6xl font-black text-blue-700 mb-2">{result.years}</div>
                    <div className="text-sm font-bold text-blue-900 uppercase tracking-wide">Years</div>
                  </div>
                  <div className="flex-1 min-w-[110px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 text-center shadow-sm">
                    <div className="text-5xl md:text-6xl font-black text-blue-700 mb-2">{result.months}</div>
                    <div className="text-sm font-bold text-blue-900 uppercase tracking-wide">Months</div>
                  </div>
                  <div className="flex-1 min-w-[110px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 text-center shadow-sm">
                    <div className="text-5xl md:text-6xl font-black text-blue-700 mb-2">{result.days}</div>
                    <div className="text-sm font-bold text-blue-900 uppercase tracking-wide">Days</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Alternative Metrics</span>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center hover:border-gray-300 transition-colors">
                    <div className="text-2xl font-black text-gray-900 mb-1">{result.totalMonths.toLocaleString()}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Total Months</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center hover:border-gray-300 transition-colors">
                    <div className="text-2xl font-black text-gray-900 mb-1">{result.totalWeeks.toLocaleString()}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Total Weeks</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center hover:border-gray-300 transition-colors">
                    <div className="text-2xl font-black text-gray-900 mb-1">{result.totalDays.toLocaleString()}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Total Days Alive</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* --- GOVERNMENT EXAMS SPECIAL SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
                <Briefcase className="w-3.5 h-3.5" />
                Highly Recommended for Students
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Calculate Age for Government Exams (UPSC, SSC, Banking)
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Most competitive examinations have strict age limits. For example, a notification might require you to be <em>"Not less than 21 years and not more than 32 years as of 1st August."</em>
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon /> <strong>UPSC Civil Services:</strong> Check your exact age as of August 1st of the exam year.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon /> <strong>SSC CGL / CHSL:</strong> Verify eligibility against January 1st or August 1st cut-offs.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon /> <strong>Banking (IBPS/SBI):</strong> Calculate exact limits for PO and Clerk notifications.
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/3 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <h3 className="text-white font-bold text-xl mb-3">How to check eligibility:</h3>
              <p className="text-slate-300 text-sm mb-6">
                Don't guess your age. Use the calculator above and change the <strong>"Age at Date"</strong> field to the exact cut-off date mentioned in your official exam notification PDF.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Set Cut-off Date Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEO EDUCATIONAL CONTENT --- */}
      <section className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              The Science of Chronological Age Calculation
            </h2>
            <p className="text-lg text-gray-600">
              Why an online date of birth calculator is an essential digital utility for legal, medical, and professional applications globally.
            </p>
          </div>

          <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed">
            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Chronological vs. Biological Age</h3>
            <p>
              When using an <strong>online age calculator</strong>, you are determining your <em>chronological age</em>—the exact amount of time that has passed from the moment you were born to the present day. This differs from biological age, which measures how your body is aging at a cellular level based on lifestyle and genetics. Chronological age is the absolute standard used universally for legal rights, retirement planning, insurance premiums, and educational enrollment.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Handling Leap Years and Calendar Math</h3>
            <p>
              Calculating your age manually seems simple until you encounter calendar irregularities. The Gregorian calendar is complex: months vary between 28, 29, 30, and 31 days, and leap years add an extra day every four years. 
            </p>
            <p>
              If a person is born on March 15th, and a cut-off date is April 10th, they are not simply "one month older." Our <strong>age difference calculator</strong> utilizes advanced Date Object algorithms to borrow days from previous months. This guarantees that whether you are checking your age for a passport application or a life insurance policy, the calculation reflects the true mathematical passage of time without rounding errors.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 mt-14">
              <h3 className="text-xl font-bold text-blue-900 mt-0 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                Zero-Trust Privacy & Data Security
              </h3>
              <p className="mb-0 text-blue-800 text-base">
                Your Date of Birth is highly sensitive Personal Identifiable Information (PII). Many free online calculators send your DOB to remote servers, putting you at risk of data harvesting. <strong>MyDocReady's tools process data locally via client-side JavaScript.</strong> The mathematics happen entirely inside your device's memory. We never transmit, view, or store your dates, ensuring 100% absolute privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPREHENSIVE FAQ SECTION --- */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <div className="p-4 bg-white shadow-sm border border-gray-100 rounded-2xl text-blue-600">
              <HelpCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-500 mt-2 text-lg">Common questions regarding exact age limits and calendar calculations.</p>
            </div>
          </div>

          <div className="grid gap-6">
            <FAQItem 
              question="How do I calculate my exact age for the UPSC Civil Services exam?"
              answer="UPSC strictly requires candidates to be between 21 and 32 years of age as of August 1st of the examination year. To verify this, enter your Date of Birth in our calculator, and set the 'Age at Date' field specifically to August 1st of your target exam year. The result must show 21 Years, 0 Months, 0 Days or higher, and strictly less than 32 Years, 0 Months, 0 Days (unless age relaxations apply)."
            />
            <FAQItem 
              question="What is the 'Age at Date' (Target Date) field used for?"
              answer="By default, the calculator shows your exact age today. Changing the Target Date allows you to find out exactly how old you were on a historical date (like a wedding or graduation day) or how old you will be at a future milestone (like retirement in the year 2050)."
            />
            <FAQItem 
              question="How does the calculator determine 'Total Weeks' alive?"
              answer="To provide the total weeks metric, the system calculates the absolute total number of days between your birth and the target date, and divides it strictly by 7. This provides a clean, mathematical representation of your lifespan in weekly intervals, bypassing the confusion of varying month lengths."
            />
            <FAQItem 
              question="Does this tool account for different global time zones?"
              answer="Yes. Because our calculator runs locally via client-side scripts, it automatically synchronizes with your device's internal clock and timezone settings. This ensures the calculation reflects the precise calendar date where you are currently physically located."
            />
          </div>
        </div>
      </section>

    </div>
  );
}

/* --- ISOLATED COMPONENTS --- */

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{question}</h3>
      <p className="text-base text-gray-600 leading-relaxed m-0">{answer}</p>
    </div>
  );
}