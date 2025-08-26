// app/terms/page.tsx or wherever your route is located
import React from "react";

export default function TermsAndConditions() {
  const lastUpdatedDate = "August 24, 2025";

  return (
    <main className="bg-white dark:bg-gray-900">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <article className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300">
          <header>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Terms and Conditions
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Last Updated:</strong> {lastUpdatedDate}
            </p>
          </header>

          <p>
            Please read these Terms and Conditions ("Terms") carefully before using the DocReady Photo website ("Service") operated by DocReady Photo ("us", "we", or "our").
          </p>
          <p>
            Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. By accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <h2>1. User Accounts</h2>
          <p>
            When you create an account with us, you agree to provide accurate and current information. You are responsible for safeguarding your account credentials and accept responsibility for any activities under your account.
          </p>

          <h2>2. User Content</h2>
          <p>
            Our Service allows you to upload photos and signatures ("User Content"). You retain ownership of your User Content, but grant us a limited license to use, store, and process it for the purpose of providing the Service.
          </p>
          <p>
            You are solely responsible for your content and must ensure you have the necessary rights to share it.
          </p>

          <h2>3. Acceptable Use Policy</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Submit illegal or offensive content</li>
            <li>Infringe on third-party intellectual property rights</li>
            <li>Attempt unauthorized access or tamper with our systems</li>
            <li>Use automated systems (e.g., bots or scrapers) without permission</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>
            The Service (excluding User Content) and all related content are the property of DocReady Photo and its licensors, protected by intellectual property laws.
          </p>

          <h2>5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts without notice for violating these Terms.
          </p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. Use it at your own risk.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            DocReady Photo shall not be liable for any indirect or consequential damages resulting from your use of the Service.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Disputes will be resolved in the courts of New Delhi.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be notified 30 days in advance. Continued use means you accept the new Terms.
          </p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> mydocready@gmail.com</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
