"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

const blogs = [
  {
    
    title: "How to Resize a Photo to a Specific KB Size",
    description: "Learn simple ways to resize images for forms, applications, and upload limits without losing clarity.",
    slug: "resize-photos-by-kb",
  },
  {
    
    title: "How to Take a Baby Passport Photo at Home",
    description: "A practical guide to preparing a baby or newborn photo that is clear, well-lit, and easier to review before printing.",
    slug: "how-to-take-baby-passport-photo-at-home",
  },
  {
    
    title: "How to Create Passport Size Photos at Home",
    description: "Follow a clear step-by-step approach to create document-ready passport photos with a simple background and proper framing.",
    slug: "create-passport-photos",
  },
  {
    
    title: "Aadhaar and PAN Photo Guidelines for Applicants",
    description: "Understand the common photo requirements for Aadhaar and PAN applications so you can prepare files with more confidence.",
    slug: "aadhaar-pan-photo-guidelines",
  },
  {
    
    title: "Top Tips for a Professional Passport Photo",
    description: "Use these practical tips to improve lighting, posture, and image quality for passport and ID photos.",
    slug: "professional-passport-photo-tips",
  },
  {
    
    title: "Compress Photos Without Losing Quality",
    description: "Learn how to reduce file size for online uploads while keeping the image clear and usable.",
    slug: "digital-photo-compression",
  },
  {
    
    title: "Best Background Colors for ID and Passport Photos",
    description: "Explore the most common background choices and how they affect the final look of document photos.",
    slug: "best-background-colors-id-photos",
  },
  {
    
    title: "How to Take a Clear Selfie for Documents",
    description: "Get helpful advice on framing, lighting, and image quality for selfies used in official or online submissions.",
    slug: "take-perfect-selfie-for-documents",
  },
  {
   
    title: "Free Online Tools for Cropping and Editing ID Photos",
    description: "Compare practical online tools for cropping, resizing, and adjusting document photos before you submit them.",
    slug: "online-photo-editing-tools",
  },
  {
    
    title: "Government Photo Size Guidelines Explained",
    description: "Break down the common size, format, and print requirements that appear in government photo instructions.",
    slug: "government-photo-size-guidelines",
  },
  {
    
    title: "Why Official Photo Submissions Get Rejected",
    description: "Review the most common reasons document photos are rejected and how to avoid them.",
    slug: "why-photos-get-rejected",
  },
  {
    
    title: "DIY Studio Setup for Document Photos at Home",
    description: "Set up a simple home studio with basic lighting and a clean background for clear document-style portraits.",
    slug: "diy-studio-document-photos",
  },
  {
    
    title: "How to Change the Background of an ID Photo Online",
    description: "Learn a practical approach to changing or simplifying the background of a document photo for better presentation.",
    slug: "change-photo-background-online",
  },
  {
    
    title: "Best Lighting for ID Photos at Home",
    description: "Find out how natural light and simple lighting setups can improve the look of your document photos.",
    slug: "best-lighting-id-photos",
  },
  {
    
    title: "Common Mistakes in Document Photos to Avoid",
    description: "Avoid common issues such as poor lighting, awkward framing, and low-resolution images when preparing ID photos.",
    slug: "common-mistakes-document-photos",
  },
  {
    
    title: "How to Make a Photo 35mm x 45mm for Passports and Visas",
    description: "Get a clear explanation of how to prepare a small passport-style image for printing and submission.",
    slug: "make-photos-35x45mm",
  },
  {
    
    title: "Best Free Online Photo Resizers for Documents",
    description: "Explore reliable online tools that make resizing and formatting document photos easier.",
    slug: "free-online-photo-resizers",
  },
  {
    
    title: "How to Reduce Photo Size for Job Portals and Forms",
    description: "Learn practical methods for shrinking image files for job applications and online form uploads.",
    slug: "reduce-photo-size-for-job-portals",
  },
  {
    
    title: "Online vs Offline Photo Studios for Document Photos",
    description: "Compare online tools and traditional studios so you can choose the approach that fits your needs.",
    slug: "online-vs-offline-photo-studios",
  },
  {
    
    title: "What to Wear for Passport and ID Photos",
    description: "Find out which clothing choices help create a neat, simple, and more professional-looking document photo.",
    slug: "what-to-wear-for-passport-id-photos",
  },
  {
    
    title: "How to Resize a Signature for Official Documents",
    description: "A practical guide to resizing and preparing signatures for forms, job portals, and government submissions.",
    slug: "resize-signature-for-official-documents",
  },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
  trackEvent("blog_listing_view");
}, []);

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
            Practical guides for preparing ID photos, resizing images, improving document quality, and making everyday upload tasks simpler.
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
              onChange={(e) => {
  const value = e.target.value;
  setSearchQuery(value);

  if (value.length >= 3) {
    trackEvent("blog_search", {
      keyword: value,
    });
  }
}}
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
            <Link
  href={`/blog/${blog.slug}`}
  
  className="group flex flex-col"
  onClick={() =>
    trackEvent("blog_click", {
      
      slug: blog.slug,
      title: blog.title,
    })
  }
>
              <div className="relative bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full flex-grow">
                
                <div className="p-8 flex flex-col flex-grow">
                  
                  
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