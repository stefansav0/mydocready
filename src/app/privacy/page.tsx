// app/privacy/page.tsx or wherever your route is located
import React from "react";

export default function PrivacyPolicy() {
  const effectiveDate = "August 22, 2025";

  return (
    <main className="bg-white dark:bg-gray-900">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <article className="prose prose-lg dark:prose-invert mx-auto text-gray-700 dark:text-gray-300">
          <header>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Effective Date:</strong> {effectiveDate}
            </p>
          </header>

          <p>
            Welcome to <strong>DocReady Photo</strong> ("we", "our", or "us").
            We are committed to protecting your privacy. This Privacy Policy
            outlines how we collect, use, and safeguard your information when
            you use our website and services (collectively, the "Service").
          </p>
          <p>
            By using our Service, you agree to the collection and use of
            information in accordance with this policy.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information in the following ways:</p>

          <h3>1.1 Information You Provide</h3>
          <ul>
            <li>
              <strong>Account Information:</strong> Email address and hashed
              password when registering. Additional optional info may also be
              provided.
            </li>
            <li>
              <strong>User Content:</strong> Images (e.g., photos or signatures)
              uploaded to our Service for processing.
            </li>
            <li>
              <strong>Support Communications:</strong> When you contact us,
              including your name, email, and message content.
            </li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>Log Data:</strong> IP address, browser type, pages visited,
              date/time, and similar diagnostic data.
            </li>
            <li>
              <strong>Cookies & Tracking:</strong> We use cookies and similar
              technologies for analytics and session management. You may disable
              cookies via your browser settings.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To operate and maintain the Service</li>
            <li>To process and return your uploaded User Content</li>
            <li>To provide support and communicate with you</li>
            <li>To improve features and analyze usage</li>
            <li>To detect and prevent security threats</li>
            <li>To send service-related updates or offers (if opted in)</li>
          </ul>

          <h2>3. User Content (Photos & Signatures)</h2>
          <ul>
            <li>
              <strong>Temporary Processing:</strong> Your uploads are processed
              solely to deliver the tool's functionality.
            </li>
            <li>
              <strong>Automatic Deletion:</strong> All uploaded files are
              <strong> permanently deleted within 24 hours</strong>.
            </li>
            <li>
              <strong>No Data Mining:</strong> We do not use your images to
              train AI models or for any purpose beyond your request.
            </li>
          </ul>

          <h2>4. Sharing & Disclosure</h2>
          <ul>
            <li>
              <strong>Third-Party Providers:</strong> Cloud platforms (e.g.,
              Vercel) and auth services (e.g., Supabase) operate under strict
              data handling policies.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose data if
              required to comply with legal obligations or to protect safety.
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We use HTTPS, encryption, and other industry-standard security
            practices. However, no method of transmission or storage is 100%
            secure.
          </p>

          <h2>6. Your Data Protection Rights</h2>
          <p>Depending on your location (e.g., GDPR, CCPA), you have rights to:</p>
          <ul>
            <li>Access, update, or delete your data</li>
            <li>Correct inaccuracies</li>
            <li>Object to or restrict processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent</li>
          </ul>
          <p>To exercise your rights, please contact us at the email below.</p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be
            reflected by the updated <em>Effective Date</em> above. We recommend
            reviewing this page regularly.
          </p>

          <h2>8. Contact Us</h2>
          <p>If you have questions or concerns, contact us at:</p>
          <ul>
            <li>
              <strong>Email:</strong> mydocready@gmail.com
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
}
