"use client";

import React, { useState } from "react";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "How to Resize Photos by KB Instantly",
    description: "Learn the easiest way to resize your photos to a specific KB size for online forms and applications.",
    slug: "resize-photos-by-kb",
  },
  {
    id: 2,
    title: "How to Take a Baby Passport Photo at Home",
    description: "Learn the secrets to taking a compliant baby or newborn passport photo at home.",
    slug: "how-to-take-baby-passport-photo-at-home",
  },
  {
    id: 3,
    title: "Create Passport Size Photos at Home",
    description: "Step-by-step guide to create passport-size photos with white or blue backgrounds using our tool.",
    slug: "create-passport-photos",
  },
  {
    id: 4,
    title: "Aadhaar and PAN Photo Guidelines",
    description: "Follow the official photo guidelines for Aadhaar and PAN applications to avoid rejections.",
    slug: "aadhaar-pan-photo-guidelines",
  },
  {
    id: 5,
    title: "Top 10 Tips for Professional Passport Photos",
    description: "Ensure your passport photo meets international standards with these practical tips.",
    slug: "professional-passport-photo-tips",
  },
  {
    id: 6,
    title: "Digital Photo Compression Without Losing Quality",
    description: "Compress your photos for online use without sacrificing clarity or quality.",
    slug: "digital-photo-compression",
  },
  {
    id: 7,
    title: "Best Background Colors for ID Photos",
    description: "White or blue? Learn which background color is best for different document photos.",
    slug: "best-background-colors-id-photos",
  },
  {
    id: 8,
    title: "How to Take a Perfect Selfie for Documents",
    description: "Tips for capturing a selfie that works for Aadhaar, PAN, and other IDs.",
    slug: "take-perfect-selfie-for-documents",
  },
  {
    id: 9,
    title: "Online Tools for Photo Cropping and Editing",
    description: "Discover free and paid tools for cropping and editing ID photos easily.",
    slug: "online-photo-editing-tools",
  },
  {
    id: 10,
    title: "Government Photo Size Guidelines Explained",
    description: "Understand official requirements for photo dimensions and formats for government IDs.",
    slug: "government-photo-size-guidelines",
  },
  {
    id: 11,
    title: "Why Photos Get Rejected in Official Applications",
    description: "Common reasons why your photo might be rejected and how to avoid them.",
    slug: "why-photos-get-rejected",
  },
  {
    id: 12,
    title: "DIY Studio Setup for Document Photos",
    description: "Set up a mini photo studio at home for high-quality document pictures.",
    slug: "diy-studio-document-photos",
  },
  {
    id: 13,
    title: "How to Change Photo Background Online",
    description: "Remove or change the background color of your ID photos in a few clicks.",
    slug: "change-photo-background-online",
  },
  {
    id: 14,
    title: "Best Lighting for ID Photos at Home",
    description: "Lighting tips to ensure your photo looks clear and meets requirements.",
    slug: "best-lighting-id-photos",
  },
  {
    id: 15,
    title: "Common Mistakes in Document Photos",
    description: "Avoid these mistakes when taking or uploading photos for government IDs.",
    slug: "common-mistakes-document-photos",
  },
  {
    id: 16,
    title: "How to Make Photos 35mm x 45mm Easily",
    description: "Resize your photo to 35x45 mm format for passports and visas easily.",
    slug: "make-photos-35x45mm",
  },
  {
    id: 17,
    title: "Free Online Photo Resizers You Should Try",
    description: "Explore the best free online photo resizing tools for documents.",
    slug: "free-online-photo-resizers",
  },
  {
    id: 18,
    title: "How to Reduce Photo Size for Job Portals",
    description: "Compress your resume photo for job applications without losing quality.",
    slug: "reduce-photo-size-for-job-portals",
  },
  {
    id: 19,
    title: "Online vs Offline Photo Studios: Which is Better?",
    description: "Compare online photo tools with traditional studios for document photos.",
    slug: "online-vs-offline-photo-studios",
  },
  {
    id: 20,
    title: "How to Master Any Slide Maker",
    description: "Learn the technical secrets of presentation software. Master align tools, Master Slides, format painters, and AI generators to build decks in half the time.",
    slug: "how-to-master-any-slide-maker",
  },
  {
    id: 21,
    title: "What to Wear for Passport and ID Photos",
    description: "Find out what clothing choices can help you get your photo approved on the first try.",
    slug: "what-to-wear-for-passport-id-photos",
  },
  {
    id: 22,
    title: "How to Resize Your Signature for Official Documents",
    description: "A complete technical guide on how to digitize your physical signature, fix background contrast, and resize the file weight to meet strict government and job portal limits.",
    slug: "resize-signature-for-official-documents",
  },
  {
    id: 23,
    title: "How to Take a Baby Passport Photo at Home",
    description: "Learn the secrets to taking a compliant baby or newborn passport photo at home.",
    slug: "how-to-take-baby-passport-photo-at-home",
  },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter blogs based on search input
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#111111] min-h-screen py-16 selection:bg-indigo-200 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">Guides & Tips</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10">
            Everything you need to know about preparing flawless documents, taking perfect ID photos, and mastering digital tools.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl leading-5 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              placeholder="Search for guides, sizes, tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Empty State for Search */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found matching "{searchQuery}".</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog.id} className="group flex flex-col">
              <div className="relative bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full flex-grow">
                
                <div className="p-8 flex flex-col flex-grow">
                  {/* Article Number Badge */}
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                    <span className="font-bold text-sm text-center w-full">{blog.id}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow line-clamp-3">
                    {blog.description}
                  </p>
                  
                  <div className="mt-8 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    Read Guide
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </div>

                {/* Animated Bottom Border */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}