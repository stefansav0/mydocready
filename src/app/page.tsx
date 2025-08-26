"use client";

import Link from "next/link";
import { Upload, Image, FileText, LucideIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-indigo-50 to-blue-100 flex-1">
        <h2 className="text-4xl font-bold text-indigo-700 mb-4 leading-tight">
          Edit Documents & Photos Easily
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Resize photos to a specific KB size, create perfect passport-size photos,
          and insert photos into A4 documents – all online and free!
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
    </div>
  );
}

/* ✅ Reusable Feature Card Component with Type Support */
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
