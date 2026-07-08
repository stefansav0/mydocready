"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const effectiveDate = "August 22, 2025";

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
            Privacy Policy
          </h1>
          <p className="text-gray-500">Effective Date: {effectiveDate}</p>
        </header>

        {/* Minimalist Typographic Content */}
        <div className="prose prose-gray prose-a:text-blue-600 hover:prose-a:text-blue-500 max-w-none leading-relaxed">
          <p className="text-lg text-gray-600 mb-10">
            This Privacy Policy outlines how <strong>MyDocReady</strong> ("we", "our", "us") collects, uses, and protects your information when you use our website and services.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">1. Local Processing & File Handling</h2>
          <p className="mb-4 text-gray-600">We prioritize your privacy by utilizing client-side WebAssembly technology for the vast majority of our tools. This means:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
            <li><strong>Local Processing:</strong> When you use tools like our Resume Builder or Background Remover, your sensitive files are processed entirely within your device's local memory (RAM).</li>
            <li><strong>No Permanent Storage:</strong> We do not upload, store, or save your documents or photos to our databases.</li>
            <li><strong>Zero-Trust Architecture:</strong> Because your files are not transmitted to our servers for processing, they remain completely private to you.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">2. Information We Collect</h2>
          <p className="mb-4 text-gray-600">While we do not collect your personal documents, we do collect certain non-personally identifiable information.</p>
          
          <h3 className="text-lg font-bold mt-6 mb-2 text-gray-800">2.1. Technical and Usage Data</h3>
          <p className="mb-4 text-gray-600">We automatically collect limited technical data such as your browser type, operating system, IP address, device type, and pages visited. This helps us monitor server health and improve the user experience.</p>
          
          <h3 className="text-lg font-bold mt-6 mb-2 text-gray-800">2.2. Cookies & Tracking</h3>
          <p className="mb-8 text-gray-600">We use cookies (small text files placed on your device) to enhance site functionality and serve targeted advertisements.</p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">3. Google AdSense & Advertising Cookies</h2>
          <p className="mb-4 text-gray-600">To keep MyDocReady 100% free, we monetize our website using Google AdSense. Google AdSense requires us to disclose the following regarding your privacy:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
            <li>You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="underline">Google Ads Settings</a>.</li>
            <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="underline">www.aboutads.info</a>.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">4. Third-Party Links</h2>
          <p className="mb-8 text-gray-600">Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">5. Your Rights (GDPR & CCPA)</h2>
          <p className="mb-4 text-gray-600">Depending on your location, you may have specific rights regarding your personal data:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
            <li><strong>The Right to Access / Rectification / Erasure:</strong> You have the right to request copies, corrections, or deletion of your personal data.</li>
            <li><strong>Do Not Sell My Personal Information (CCPA):</strong> We do not sell your personal data. However, advertising networks (like Google AdSense) may collect data as outlined in Section 3. You can opt out of personalized ads via the links provided above.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">6. Changes to This Policy</h2>
          <p className="mb-12 text-gray-600">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.</p>

          <hr className="my-12 border-gray-200" />

          <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Us</h2>
          <p className="mb-6 text-gray-600">If you have any questions about this Privacy Policy or advertising cookies, please contact us at:</p>
          <p>
            <Link href="/contact" className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Privacy Team Contact Form &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}