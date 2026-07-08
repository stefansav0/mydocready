import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { blogContent } from "@/lib/blogData"; 
import ProgressBar from "@/components/ProgressBar"; // Adjust this path if necessary

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(blogContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!(slug in blogContent)) {
    return { title: "Article Not Found | MydocReady" };
  }

  const blog = blogContent[slug as keyof typeof blogContent];

  return {
    title: `${blog.title} | MydocReady`,
    description: blog.description,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  if (!(slug in blogContent)) {
    notFound();
  }

  const blog = blogContent[slug as keyof typeof blogContent] as any; 

  return (
    <>
      {/* Client-side scroll progress bar */}
      <ProgressBar />

      <div className="bg-[#FAFAFA] dark:bg-[#111111] min-h-screen selection:bg-indigo-200 selection:text-indigo-900">
        
        {/* Top Navigation Bar */}
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">
              &larr;
            </span>
            Back to Articles
          </Link>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <article>
            {/* Article Header (Hero Section) */}
            <header className="mb-12">
              {blog.category && (
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide text-sm uppercase mb-4 block">
                  {blog.category}
                </span>
              )}
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight leading-[1.1] mb-6">
                {blog.title}
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 font-light mb-8 leading-relaxed">
                {blog.description}
              </p>

              {/* Author & Meta Info */}
              <div className="flex items-center gap-4 py-6 border-y border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg overflow-hidden shrink-0">
                  {blog.authorImage ? (
                    <img src={blog.authorImage} alt={blog.author || "Author"} className="w-full h-full object-cover" />
                  ) : (
                    (blog.author || "M")[0].toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">
                    {blog.author || "MydocReady Team"}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span>{blog.date || "Published recently"}</span>
                    <span>&middot;</span>
                    <span>{blog.readTime || "5 min read"}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Optional Cover Image */}
            {blog.coverImage && (
              <figure className="mb-12 -mx-4 sm:mx-0">
                <img 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  className="w-full h-auto max-h-[500px] object-cover sm:rounded-2xl shadow-sm"
                />
              </figure>
            )}

            {/* Article Body */}
            <div className="prose prose-lg md:prose-xl dark:prose-invert prose-indigo mx-auto text-gray-800 dark:text-gray-200">
              <ReactMarkdown
                components={{
                  h2: ({ ...props }) => (
                    <h2 className="text-2xl sm:text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-gray-100 tracking-tight" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-6 leading-relaxed" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a 
                      className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-800 underline-offset-4 hover:decoration-indigo-600 dark:hover:decoration-indigo-400 transition-colors" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      {...props} 
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc pl-6 space-y-3 mb-6 marker:text-indigo-500" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal pl-6 space-y-3 mb-6 marker:text-indigo-500 marker:font-semibold" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li className="pl-2" {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote 
                      className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 text-gray-900 dark:text-gray-100 px-6 py-4 my-8 rounded-r-xl italic shadow-sm" 
                      {...props} 
                    />
                  ),
                  code: ({ className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !className;
                    return isInline ? (
                      <code className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                        {children}
                      </code>
                    ) : (
                      <div className="rounded-xl overflow-hidden my-8 shadow-lg">
                        <div className="bg-gray-800 text-gray-400 px-4 py-2 text-xs font-mono uppercase border-b border-gray-700 flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <span className="ml-2">{match?.[1] || 'Code'}</span>
                        </div>
                        <pre className="p-4 bg-gray-900 text-gray-100 overflow-x-auto text-sm font-mono">
                          <code {...props}>{children}</code>
                        </pre>
                      </div>
                    );
                  },
                }}
              >
                {blog.content || "*No content available.*"}
              </ReactMarkdown>
            </div>
          </article>
        </main>

        {/* Footer / Back to Top */}
        <footer className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 dark:border-gray-800 text-center">
          <a 
            href="#" 
            className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            &uarr; Back to top
          </a>
        </footer>
      </div>
    </>
  );
}