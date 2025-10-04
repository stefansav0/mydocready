export default function TermsAndConditions() {
  const lastUpdatedDate = "August 24, 2025";

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Terms and Conditions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Last Updated:</strong> {lastUpdatedDate}
          </p>

          <p>
            Please read these Terms and Conditions (&quot;Terms&quot;) carefully before using the DocReady Photo website (&quot;Service&quot;) operated by MyDocReady (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
          </p>

          <h2>1. User Accounts</h2>
          <p>
            You are responsible for safeguarding the password you use to access the Service. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2>2. User Content</h2>
          <p>
            You retain ownership of your content but grant us a license to operate, display, and process it as needed to provide our services. You are solely responsible for the legality and integrity of the content you upload.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>
            You agree to use the Service in compliance with all applicable laws and not to misuse it in any way, including uploading illegal, harmful, or infringing content.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All content provided by us (excluding user content) is our property and protected by intellectual property laws. Unauthorized use is prohibited.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            Our Service may include integrations with third-party platforms for features like hosting, analytics, or communication. These providers may have their own terms and privacy policies, which you are encouraged to review.
          </p>

          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your account at our sole discretion, without prior notice, for conduct that violates these Terms or is harmful to other users or us.
          </p>

          <h2>7. Disclaimer</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service will be available at all times or free from errors.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            We are not liable for any indirect, incidental, or consequential damages resulting from your use of the Service.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes will be resolved in the jurisdiction of New Delhi, India.
          </p>

          <h2>10. Policy Updates</h2>
          <p>
            We may update these Terms periodically. Continued use of the Service after changes indicates your acceptance of the revised Terms.
          </p>

          <h2 className="text-2xl font-semibold text-indigo-600 mt-10 mb-4">Get in Touch</h2>
          <p>
            Got questions or suggestions? Reach out via our{" "}
            <a href="/contact" className="text-indigo-600 underline">
              contact page
            </a>{" "}
            — we&rsquo;d love to hear from you!
          </p>
        </div>
      </div>
    </div>
  );
}
