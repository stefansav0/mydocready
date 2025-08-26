export default function PrivacyPolicy() {
  // IMPORTANT: This date should be manually updated only when you make changes to the policy.
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
            Welcome to <strong>DocReady Photo</strong> (<em>we, our, or us</em>). We are committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services (collectively, the <em>Service</em>).
            Please read this policy carefully. By using our Service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information in a few different ways to provide and improve our Service.</p>

          <h3>1.1. Information You Provide to Us</h3>
          <ul>
            <li>
              <strong>Account Information:</strong> When you register for an account, we collect your email address and a hashed password. You may voluntarily provide other information.
            </li>
            <li>
              <strong>User Content:</strong> Our Service allows you to upload, process, and download images, such as photos and signatures (<em>User Content</em>). This User Content is processed by our servers to provide the requested functionality.
            </li>
            <li>
              <strong>Communications:</strong> If you contact us directly for support or other inquiries, we may receive additional information about you such as your name, email address, the contents of the message, and any other information you may choose to provide.
            </li>
          </ul>

          <h3>1.2. Information We Collect Automatically</h3>
          <ul>
            <li>
              <strong>Log and Usage Data:</strong> Like most websites, we collect information that your browser sends whenever you visit our Service. This may include your IP address, browser type and version, the pages you visit, the time and date of your visit, and other diagnostic data.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies, but some portions of our Service may not function properly.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our Service.</li>
            <li>Process your User Content as you direct.</li>
            <li>Manage your account and provide you with customer support.</li>
            <li>Analyze usage to monitor and improve our website and services.</li>
            <li>Detect, prevent, and address technical issues and security threats.</li>
            <li>Communicate with you about service updates, offers, and promotional information, where permitted.</li>
          </ul>

          <h2>3. User Content (Your Photos and Signatures)</h2>
          <p>Your privacy regarding your uploaded photos and signatures is our top priority.</p>
          <ul>
            <li>
              <strong>Temporary Processing:</strong> Your User Content is uploaded to our servers solely for the purpose of processing as per the tool you are using.
            </li>
            <li>
              <strong>Automatic Deletion:</strong> We do not permanently store your User Content. All uploaded files are <strong>automatically and permanently deleted</strong> from our servers within 24 hours of being uploaded.
            </li>
            <li>
              <strong>No Data Mining:</strong> We will never use your User Content to train AI models or for any other purpose than providing the direct service you have requested.
            </li>
          </ul>

          <h2>4. Sharing and Disclosure of Information</h2>
          <p>We do not sell or rent your personal data to third parties. We may share information in the following limited circumstances:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> We may share information with third-party vendors that perform services for us, such as cloud hosting (e.g., Vercel) and authentication (e.g., Supabase), under strict data protection terms.
            </li>
            <li>
              <strong>Legal Compliance:</strong> We may disclose your information if required by law, subpoena, or other legal process, or if we have a good faith belief that disclosure is necessary to protect our rights, your safety, or the safety of others.
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures, including HTTPS and data encryption, to protect your information. However, no electronic transmission or storage method is 100% secure, and we cannot guarantee its absolute security.
          </p>

          <h2>6. Your Data Protection Rights (GDPR, CCPA)</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li>The right to <strong>access, update, or delete</strong> the information we have on you.</li>
            <li>The right of <strong>rectification</strong>.</li>
            <li>The right to <strong>object</strong> to processing.</li>
            <li>The right of <strong>restriction</strong>.</li>
            <li>The right to <strong>data portability</strong>.</li>
            <li>The right to <strong>withdraw consent</strong>.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at the email below.</p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the <em>Effective Date</em> at the top. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> mydocready@gmail.com</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
