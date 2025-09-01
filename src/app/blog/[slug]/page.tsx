// File: app/blog/[slug]/page.tsx

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { blogContent } from "@/lib/blogData"; // Make sure this is the correct path

// ✅ Generate static paths for all slugs
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return Object.keys(blogContent).map((slug) => ({ slug }));
}

// ✅ Generate dynamic metadata based on slug
export async function generateMetadata(props: unknown): Promise<Metadata> {
  const { params } = props as { params: { slug: string } };
  const blog = blogContent[params.slug];
  if (!blog) {
    return { title: "Blog Post Not Found | MydocReady" };
  }
  return {
    title: `${blog.title} | MydocReady`,
    description: blog.description,
  };
}

// ✅ Render the blog detail page
export default function BlogDetailPage(props: unknown) {
  const { params } = props as { params: { slug: string } };
  const blog = blogContent[params.slug];
  if (!blog) notFound();

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <article className="prose prose-lg dark:prose-invert">
          <Link
            href="/blog"
            className="text-sm text-primary no-underline hover:underline mb-4 inline-block"
          >
            &larr; Back to All Articles
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            {blog.title}
          </h1>

          <ReactMarkdown
            components={{
              h3: ({ ...props }) => (
                <h3 className="text-xl font-bold mt-6 mb-3" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc pl-5 space-y-2" {...props} />
              ),
              li: ({ ...props }) => (
                <li className="text-gray-700 dark:text-gray-300" {...props} />
              ),
              a: ({ ...props }) => (
                <a className="text-blue-500 underline" target="_blank" {...props} />
              ),
              strong: ({ ...props }) => (
                <strong className="font-semibold" {...props} />
              ),
            }}
          >
            {blog.content || "No content available."}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
