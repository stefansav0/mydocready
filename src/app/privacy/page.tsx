"use client";

export default function PrivacyPolicy() {
  const effectiveDate = "August 22, 2025";

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Effective Date:</strong> {effectiveDate}
          </p>

          <p>
            This Privacy Policy outlines how <strong>MyDocReady</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, uses, and protects your information when you use our website and services (the &quot;Service&quot;).
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1. User Content</h3>
          <p>
            When you upload files (such as photos or documents), they are used only to deliver the requested tool functionality. These files are automatically deleted from our servers within 24 hours.
          </p>

          <h3>1.2. Technical and Usage Data</h3>
          <p>
            We may collect limited technical data such as browser type, IP address, device type, and visit duration to maintain and improve service performance. This data is anonymous and not linked to any personal identity.
          </p>

          <h3>1.3. Cookies &amp; Tracking</h3>
          <p>
            Cookies may be used to enhance site functionality and tailor user experience. You may choose to disable cookies in your browser settings. Some features may not function correctly without them.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our tools and services</li>
            <li>To process uploaded files as requested</li>
            <li>To ensure site security and prevent misuse</li>
            <li>To analyze traffic and user behavior in aggregate (non-personalized)</li>
          </ul>

          <h2>3. File Handling &amp; Privacy</h2>
          <ul>
            <li><strong>No storage:</strong> Files are processed temporarily and deleted automatically within 24 hours.</li>
            <li><strong>No human access:</strong> Uploaded content is not viewed, shared, or used beyond its intended purpose.</li>
            <li><strong>No profiling:</strong> We do not analyze or extract personal information from your files.</li>
          </ul>

          <h2>4. Third-Party Services</h2>
          <p>
            Some third-party services may use cookies or similar technologies to deliver relevant content or functionality. These services operate under their own privacy policies and may process limited usage data.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security practices including HTTPS and access control to protect your information. However, no system is completely immune to risk.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            If you are located in a region that provides data protection rights (such as GDPR or CCPA), you may request access, correction, or deletion of your personal data. Contact us to submit a request.
          </p>

          <h2>7. Policy Updates</h2>
          <p>
            We may update this Privacy Policy occasionally. The effective date above will be updated accordingly. Continued use of our Service means you accept the revised policy.
          </p>

          <h2 className="text-2xl font-semibold text-indigo-600 mt-10 mb-4">Get in Touch</h2>
          <p>
            Got questions or suggestions? Reach out via our{" "}
            <a href="/contact" className="text-indigo-600 underline">
              contact page
            </a>{" "}
            — we&rsquo;d love to hear from you!
          </p>
        </article>
      </div>
    </div>
  );
}
