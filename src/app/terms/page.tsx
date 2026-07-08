"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  const lastUpdatedDate = "August 24, 2025";

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
            Terms and Conditions
          </h1>
          <p className="text-gray-500">Last Updated: {lastUpdatedDate}</p>
        </header>

        {/* Minimalist Typographic Content */}
        <div className="prose prose-gray prose-a:text-blue-600 hover:prose-a:text-blue-500 max-w-none leading-relaxed">
          <p className="text-lg text-gray-600 mb-10">
            Please read these Terms and Conditions ("Terms") carefully before using the MyDocReady website and toolkit ("Service") operated by MyDocReady ("us", "we", or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to all the terms and conditions, then you may not access the Service.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">1. Use of the Service</h2>
          <p className="mb-4 text-gray-600">
            MyDocReady provides a suite of browser-based digital utilities. Our Service is provided entirely free of charge and does not require the creation of a user account or password. You agree to use the Service only for lawful purposes and in accordance with these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">2. User Content & Local Processing</h2>
          <p className="mb-4 text-gray-600">
            You retain full ownership and intellectual property rights of any photos, resumes, or documents you upload to our Service. 
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
            <li>Because our tools utilize client-side (local browser) processing, we do not upload, host, or permanently store your files on our servers.</li>
            <li>You are solely responsible for ensuring you have the legal right to use and process any files you interact with through our tools.</li>
            <li>We claim no ownership, nor do we request a license to use your personal content for anything other than facilitating your immediate session.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">3. Acceptable Use</h2>
          <p className="mb-4 text-gray-600">You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
            <li>Process illegal, harmful, or fraudulent documents.</li>
            <li>Attempt to reverse engineer, decompile, or extract the source code of our WebAssembly models or site architecture.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service, including automated scraping or bypassing rate limits.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">4. Intellectual Property</h2>
          <p className="mb-8 text-gray-600">
            All original content, features, site design, functionality, templates, and underlying code provided by MyDocReady (excluding your personal user content) are owned by us and are protected by international copyright, trademark, and other intellectual property laws. Unauthorized reproduction or distribution is strictly prohibited.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">5. Advertising & Third-Party Services</h2>
          <p className="mb-8 text-gray-600">
            To keep our Service free, we display advertisements via Google AdSense. We also may link to third-party websites. We do not control and are not responsible for the content, privacy policies, or practices of any third-party web sites or services. Your interactions with third-party advertisers found on our Service are solely between you and the advertiser.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">6. Disclaimer of Warranties</h2>
          <p className="mb-8 text-gray-600">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. MyDocReady makes no representations or warranties of any kind, express or implied, as to the operation of the Service, or the information, content, or materials included. We do not guarantee that the Service will be error-free, completely secure, or operate without interruptions.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">7. Limitation of Liability</h2>
          <p className="mb-8 text-gray-600">
            To the fullest extent permitted by applicable law, in no event shall MyDocReady, its affiliates, directors, or employees be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">8. Governing Law</h2>
          <p className="mb-8 text-gray-600">
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or the Service will be resolved exclusively in the jurisdiction of the courts located in New Delhi, India.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900">9. Policy Updates</h2>
          <p className="mb-12 text-gray-600">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <hr className="my-12 border-gray-200" />

          <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Us</h2>
          <p className="mb-6 text-gray-600">If you have any questions, concerns, or suggestions regarding these Terms and Conditions, please contact us at:</p>
          <p>
            <Link href="/contact" className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Customer Support Contact Form &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}