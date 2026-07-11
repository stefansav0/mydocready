"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        
        {/* Simple Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Clean Header */}
        <header className="mb-14 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            About Us
          </h1>
          <p className="text-gray-500">Simplifying your digital workflow, one document at a time.</p>
        </header>

        {/* Minimalist Typographic Content */}
        <div className="prose prose-gray prose-a:text-blue-600 hover:prose-a:text-blue-500 max-w-none leading-relaxed">
          <p className="text-lg text-gray-600 mb-10">
            <strong>MyDocReady</strong> is a comprehensive online toolkit engineered to eliminate the frustration of everyday document formatting and photo editing tasks. 
          </p>

          <p className="mb-8 text-gray-600">
            Whether you are formatting an ATS-friendly resume for your dream job, compressing a digital signature for a government portal, converting PDFs, or cropping a biometric passport photo to strict specifications, we provide the tools to get it done instantly. Our platform is designed for everyone—students, job seekers, professionals, and everyday individuals who need fast, accurate results without the hassle of downloading heavy software.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Our Mission</h2>
          <p className="mb-8 text-gray-600">
            Our mission is simple: To empower people around the world with accessible, free, and highly effective online tools. We believe that dealing with digital paperwork shouldn't require a premium subscription or a degree in graphic design.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">Why Choose MyDocReady?</h2>
          <p className="mb-4 text-gray-600">We built this platform based on four core principles:</p>
          <ul className="list-disc pl-6 space-y-3 text-gray-600 mb-8">
            <li>
              <strong>100% Free Forever:</strong> No hidden paywalls when you click download, no trial periods, and no premium features locked behind a subscription.
            </li>
            <li>
              <strong>Zero Friction:</strong> No account creation, email verification, or passwords required. Just open the tool, complete your task, and go.
            </li>
            <li>
              <strong>Browser-Based Power:</strong> Everything works directly in your web browser across desktops, tablets, and smartphones. No app installations required.
            </li>
            <li>
              <strong>Privacy-First Architecture:</strong> By utilizing local WebAssembly technology, the vast majority of our tools process your sensitive documents directly on your device's memory. We do not store, host, or analyze your personal files.
            </li>
          </ul>

          <hr className="my-12 border-gray-200" />

          <h2 className="text-2xl font-bold mb-4 text-gray-900">Get in Touch</h2>
          <p className="mb-6 text-gray-600">
            We are constantly building new tools and improving our platform based on user feedback. If you have questions, suggestions, or just want to say hello, we would love to hear from you.
          </p>
          <p>
            <Link href="/contact" className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Visit our Contact Page &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
