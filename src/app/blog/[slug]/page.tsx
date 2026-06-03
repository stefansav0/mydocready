import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { blogContent } from "@/lib/blogData"; 

// Next.js 15+ requires params to be a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params for all slugs
export async function generateStaticParams() {
  return Object.keys(blogContent).map((slug) => ({ slug }));
}

// Generate dynamic metadata based on slug
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params!
  const { slug } = await params;

  if (!(slug in blogContent)) {
    return { title: "Blog Post Not Found | MydocReady" };
  }

  const blog = blogContent[slug as keyof typeof blogContent];

  return {
    title: `${blog.title} | MydocReady`,
    description: blog.description,
  };
}

// Render the blog detail page
export default async function BlogDetailPage({ params }: Props) {
  // Await the params!
  const { slug } = await params;

  // If the slug isn't in our blogData.ts file, show 404
  if (!(slug in blogContent)) {
    notFound();
  }

  const blog = blogContent[slug as keyof typeof blogContent];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <article className="prose prose-lg dark:prose-invert">
          <Link
            href="/blog"
            className="text-sm font-bold text-indigo-600 no-underline hover:text-indigo-800 mb-6 inline-flex items-center gap-2 transition-colors"
          >
            &larr; Back to All Articles
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            {blog.title}
          </h1>

          <div className="text-gray-700 dark:text-gray-300">
            <ReactMarkdown
              components={{
                h3: ({ ...props }) => (
                  <h3 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-5 space-y-2 my-4" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="text-gray-700 dark:text-gray-300" {...props} />
                ),
                a: ({ ...props }) => (
                  <a className="text-indigo-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                strong: ({ ...props }) => (
                  <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="mb-4 leading-relaxed" {...props} />
                )
              }}
            >
              {blog.content || "No content available."}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}