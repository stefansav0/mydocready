import React from "react";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "How to Resize Photos by KB Instantly",
    description:
      "Learn the easiest way to resize your photos to a specific KB size for online forms and applications.",
    slug: "resize-photos-by-kb",
  },
  {
    id: 2,
    title: "Create Passport Size Photos at Home",
    description:
      "Step-by-step guide to create passport-size photos with white or blue backgrounds using our tool.",
    slug: "create-passport-photos",
  },
  {
    id: 3,
    title: "Aadhaar and PAN Photo Guidelines",
    description:
      "Follow the official photo guidelines for Aadhaar and PAN applications to avoid rejections.",
    slug: "aadhaar-pan-photo-guidelines",
  },
  {
    id: 4,
    title: "Top 10 Tips for Professional Passport Photos",
    description:
      "Ensure your passport photo meets international standards with these practical tips.",
    slug: "professional-passport-photo-tips",
  },
  {
    id: 5,
    title: "Digital Photo Compression Without Losing Quality",
    description:
      "Compress your photos for online use without sacrificing clarity or quality.",
    slug: "digital-photo-compression",
  },
  {
    id: 6,
    title: "Best Background Colors for ID Photos",
    description:
      "White or blue? Learn which background color is best for different document photos.",
    slug: "best-background-colors-id-photos",
  },
  {
    id: 7,
    title: "How to Take a Perfect Selfie for Documents",
    description:
      "Tips for capturing a selfie that works for Aadhaar, PAN, and other IDs.",
    slug: "take-perfect-selfie-documents",
  },
  {
    id: 8,
    title: "Online Tools for Photo Cropping and Editing",
    description:
      "Discover free and paid tools for cropping and editing ID photos easily.",
    slug: "online-photo-editing-tools",
  },
  {
    id: 9,
    title: "Government Photo Size Guidelines Explained",
    description:
      "Understand official requirements for photo dimensions and formats for government IDs.",
    slug: "government-photo-size-guidelines",
  },
  {
    id: 10,
    title: "Why Photos Get Rejected in Official Applications",
    description:
      "Common reasons why your photo might be rejected and how to avoid them.",
    slug: "why-photos-get-rejected",
  },
  {
    id: 11,
    title: "DIY Studio Setup for Document Photos",
    description:
      "Set up a mini photo studio at home for high-quality document pictures.",
    slug: "diy-studio-document-photos",
  },
  {
    id: 12,
    title: "How to Change Photo Background Online",
    description:
      "Remove or change the background color of your ID photos in a few clicks.",
    slug: "change-photo-background-online",
  },
  {
    id: 13,
    title: "Best Lighting for ID Photos at Home",
    description:
      "Lighting tips to ensure your photo looks clear and meets requirements.",
    slug: "best-lighting-id-photos",
  },
  {
    id: 14,
    title: "Common Mistakes in Document Photos",
    description:
      "Avoid these mistakes when taking or uploading photos for government IDs.",
    slug: "common-mistakes-document-photos",
  },
  {
    id: 15,
    title: "How to Make Photos 35mm x 45mm Easily",
    description:
      "Resize your photo to 35x45 mm format for passports and visas easily.",
    slug: "make-photos-35x45mm",
  },
  {
    id: 16,
    title: "Free Online Photo Resizers You Should Try",
    description:
      "Explore the best free online photo resizing tools for documents.",
    slug: "free-online-photo-resizers",
  },
  {
    id: 17,
    title: "How to Reduce Photo Size for Job Portals",
    description:
      "Compress your resume photo for job applications without losing quality.",
    slug: "reduce-photo-size-for-job-portals",
  },
  {
    id: 20,
    title: "Online vs Offline Photo Studios: Which is Better?",
    description:
      "Compare online photo tools with traditional studios for document photos.",
    slug: "online-vs-offline-photo-studios",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Tips</h1>
      <p className="text-center text-gray-600 mb-10">
        Tips and tricks for perfect document-ready photos
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4">{blog.description}</p>
              <Link
                href={`/blog/${blog.slug}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
