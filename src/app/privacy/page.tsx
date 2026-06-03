"use client";

import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  const effectiveDate = "August 22, 2025";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 py-12 sm:py-20 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Document Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-800 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-8 py-12 sm:px-12 sm:py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 text-white rounded-2xl backdrop-blur-sm mb-6 shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Privacy Policy
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-indigo-50 text-sm font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Effective Date: {effectiveDate}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12 sm:px-16 sm:py-16">
            <article className="prose prose-lg sm:prose-xl dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300">
              
              <p className="lead text-xl text-slate-700 dark:text-slate-200 font-medium mb-10">
                This Privacy Policy outlines how <strong className="text-indigo-600 dark:text-indigo-400">MyDocReady</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, uses, and protects your information when you use our website and services (the &quot;Service&quot;).
              </p>

              <h2 className="text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-12">1. Information We Collect</h2>

              <h3 className="text-slate-800 dark:text-slate-100 text-xl">1.1. User Content</h3>
              <p>
                When you upload files (such as photos or documents), they are used only to deliver the requested tool functionality. These files are <strong>automatically deleted from our servers within 24 hours</strong>.
              </p>

              <h3 className="text-slate-800 dark:text-slate-100 text-xl">1.2. Technical and Usage Data</h3>
              <p>
                We may collect limited technical data such as browser type, IP address, device type, and visit duration to maintain and improve service performance. This data is anonymous and not linked to any personal identity.
              </p>

              <h3 className="text-slate-800 dark:text-slate-100 text-xl">1.3. Cookies &amp; Tracking</h3>
              <p>
                Cookies may be used to enhance site functionality and tailor user experience. You may choose to disable cookies in your browser settings. Some features may not function correctly without them.
              </p>

              <h2 className="text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-12">2. How We Use Your Information</h2>
              <ul>
                <li>To provide and improve our tools and services.</li>
                <li>To process uploaded files exactly as requested.</li>
                <li>To ensure site security and prevent misuse.</li>
                <li>To analyze traffic and user behavior in aggregate (non-personalized).</li>
              </ul>

              <h2 className="text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-12">3. File Handling &amp; Privacy</h2>
              <ul>
                <li><strong>No storage:</strong> Files are processed temporarily and deleted automatically within 24 hours.</li>
                <li><strong>No human access:</strong> Uploaded content is not viewed, shared, or used beyond its intended purpose.</li>
                <li><strong>No profiling:</strong> We do not analyze or extract personal information from your files.</li>
              </ul>

              <h2 className="text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-12">4. Third-Party Services</h2>
              <p>
                Some third-party services may use cookies or similar technologies to deliver relevant content or functionality. These services operate under their own privacy policies and may process limited usage data.
              </p>

              <h2 className="text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-12">5. Data Security</h2>
              <p>
                We implement industry-standard security practices including HTTPS and access control to protect your information. However, no system on the internet is completely immune to risk.
              </p>

              <h2 className="text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-12">6. Your Rights</h2>
              <p>
                If you are located in a region that provides data protection rights (such as GDPR or CCPA), you may request access, correction, or deletion of your personal data. Contact us to submit a request.
              </p>

              <h2 className="text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-12">7. Policy Updates</h2>
              <p>
                We may update this Privacy Policy occasionally. The effective date at the top of this page will be updated accordingly. Continued use of our Service means you accept the revised policy.
              </p>
            </article>

            {/* CTA / Contact Block */}
            <div className="mt-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900/50 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Get in Touch</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
                Got questions about your privacy or suggestions for our team? We take your data security seriously and would love to hear from you.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Contact Privacy Team
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}