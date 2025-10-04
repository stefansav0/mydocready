"use client";

import Link from "next/link";
import { Upload, Image, FileText, LucideIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-indigo-50 to-blue-100 flex-1 px-4">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4 leading-tight">
          All-in-One Tool for Document &amp; Photo Editing
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          MyDocReady helps you resize images by KB, generate passport-size photos, and insert photos into A4 PDFs for official submissions — completely free and accessible online.
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          Icon={Upload}
          title="Resize Photo"
          description="Compress or resize your image to a specific KB size using smart optimization."
          link="/resize"
          buttonText="Try Now"
        />
        <FeatureCard
          Icon={Image}
          title="Passport Photo"
          description="Crop your photo and change the background to white or blue for official documents."
          link="/passport-photo"
          buttonText="Create Photo"
        />
        <FeatureCard
          Icon={FileText}
          title="Insert into Document"
          description="Place your photo into an A4 PDF layout and download instantly for submission."
          link="/insert-doc"
          buttonText="Insert Photo"
        />
      </section>

      {/* Intro Content for SEO and AdSense */}
      <section className="max-w-4xl mx-auto px-4 py-8 text-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-700">Why Choose MyDocReady?</h2>
        <p>
          Whether you&apos;re applying for a government ID, college, or job, document requirements can be frustrating — especially when photo specs and sizes vary. MyDocReady simplifies this process with instant, online tools to create document-ready outputs that meet strict guidelines.
        </p>
        <p>
          No need to download bulky software or visit a photo studio — our web-based tools are fast, accurate, and optimized for all devices. From compressing images for online forms to generating passport-style photos with white or blue backgrounds, we&apos;ve got your document needs covered.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <FAQItem
            question="Is MyDocReady free to use?"
            answer="Yes! All tools on MyDocReady are free to use with no hidden fees. We believe everyone should have access to basic document tools online."
          />
          <FAQItem
            question="Can I use this for official documents like PAN, Aadhaar, or passport?"
            answer="Absolutely. Our tools are tailored to meet common document and photo specifications used in official submissions across various countries."
          />
          <FAQItem
            question="Are my photos safe?"
            answer="Yes. We do not store your images. All processing happens securely in your browser or via secure servers, and data is not retained after use."
          />
        </div>
      </section>

      {/* Optional: Add Blog or Testimonials */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Helpful Guides</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><Link href="/blog/common-mistakes-document-photos" className="text-indigo-600 hover:underline">Common Mistakes in Document Photos</Link></li>
          <li><Link href="/blog/resize-photos-by-kb" className="text-indigo-600 hover:underline">How to Resize a Photo to Specific KB Size</Link></li>
        </ul>
      </section>
    </div>
  );
}

/* Feature Card */
interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

function FeatureCard({
  Icon,
  title,
  description,
  link,
  buttonText,
}: FeatureCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition duration-300">
      <Icon className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <Link
        href={link}
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        {buttonText}
      </Link>
    </div>
  );
}

/* FAQ Item */
interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div>
      <h3 className="font-semibold text-indigo-700">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
