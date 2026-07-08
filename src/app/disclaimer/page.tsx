"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <header className="mb-14 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Disclaimer
          </h1>
        </header>

        {/* Content */}
        <div className="prose prose-gray max-w-none leading-relaxed text-gray-600">
          <p className="text-lg text-gray-800 mb-8">
            The information provided on <strong>MyDocReady</strong> is for general informational purposes only. While we strive to keep our tools and content accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, products, or services contained on the website.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">1. No Professional Advice</h2>
          <p>
            The tools and information provided by MyDocReady do not constitute legal, financial, or professional advice. Our resume builder, document formatting tools, and calculators are designed to assist you, but they do not replace the judgment of a professional (such as a lawyer, accountant, or career advisor). You should consult with a qualified professional regarding your specific situation before making decisions based on the output of our tools.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">2. Accuracy of Tools</h2>
          <p>
            While we test our tools extensively, MyDocReady does not guarantee that the results generated (such as passport photo dimensions, resume ATS compatibility, or calculator results) will be accepted by every government entity, institution, or employer. It is your responsibility to verify that your documents meet the specific requirements of the organization to which you are submitting them.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">3. External Links</h2>
          <p>
            Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with MyDocReady. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">4. Limitation of Liability</h2>
          <p>
            In no event shall MyDocReady be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence, or other tort, arising out of or in connection with the use of the Service or the contents of the Service.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">5. Updates</h2>
          <p>
            We reserve the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice.
          </p>

          <hr className="my-12 border-gray-100" />

          <h3 className="text-lg font-bold text-gray-900 mb-4">Questions?</h3>
          <p>
            If you have any questions regarding this disclaimer, please contact us through our{" "}
            <Link href="/contact" className="text-blue-600 font-semibold underline">
              contact page
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}