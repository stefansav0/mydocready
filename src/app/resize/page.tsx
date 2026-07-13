"use client";

import { useCallback, useEffect, useState, useRef, ChangeEvent } from "react";
import {
  compressToTargetKB,
  fileToImageBitmap,
  downloadBlob,
} from "@/utils/image";
import { 
  UploadCloud, 
  Lock, 
  Unlock, 
  Download, 
  ImageIcon, 
  Settings2, 
  ArrowRight,
  Zap,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

type ResultState = {
  url: string;
  blob: Blob;
  kb: number;
  quality: number;
};

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalURL, setOriginalURL] = useState<string | null>(null);
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  const [targetKB, setTargetKB] = useState<number>(50);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [result, setResult] = useState<ResultState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const aspectRatio = useRef<number>(1);

  const handleFileSelect = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;

    setFile(selectedFile);
    setResult(null);

    setOriginalURL((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return URL.createObjectURL(selectedFile);
    });

    const bmp = await fileToImageBitmap(selectedFile);
    setBitmap(bmp);

    setDimensions({ width: bmp.width, height: bmp.height });
    aspectRatio.current = bmp.width / bmp.height;
  }, []);

  useEffect(() => {
    return () => {
      if (originalURL) URL.revokeObjectURL(originalURL);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [originalURL, result]);

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    if (!Number.isFinite(newWidth) || newWidth <= 0) return;

    if (keepAspectRatio && aspectRatio.current) {
      const newHeight = Math.round(newWidth / aspectRatio.current);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions((prev) => ({ ...prev, width: newWidth }));
    }
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    if (!Number.isFinite(newHeight) || newHeight <= 0) return;

    if (keepAspectRatio && aspectRatio.current) {
      const newWidth = Math.round(newHeight * aspectRatio.current);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions((prev) => ({ ...prev, height: newHeight }));
    }
  };

  const doResizeAndCompress = useCallback(async () => {
    if (!bitmap || !dimensions.width || !dimensions.height) return;

    setIsBusy(true);
    setResult(null);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(bitmap, 0, 0, dimensions.width, dimensions.height);

      const { blob, objectURL, finalKB, quality } = await compressToTargetKB(
        canvas,
        Math.max(5, targetKB)
      );

      setResult({ url: objectURL, blob, kb: finalKB, quality });
    } finally {
      setIsBusy(false);
    }
  }, [bitmap, dimensions, targetKB]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const originalKB = file ? file.size / 1024 : 0;
  const savingsPercent = result ? (((originalKB - result.kb) / originalKB) * 100).toFixed(1) : 0;

  return (
    <main className="min-h-screen bg-slate-50 py-12 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Smart Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Resizer</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your photo, set your exact pixel dimensions and target file size, and let our smart engine optimize it instantly without losing quality.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 mb-16">
          
          {/* --- LEFT COLUMN: CONTROLS --- */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings2 className="w-5 h-5 text-indigo-400" />
                  Adjustment Controls
                </CardTitle>
              </div>
              <CardContent className="p-6 space-y-8 bg-white">
                
                {/* Upload Zone */}
                <div 
                  onDragOver={handleDragOver} 
                  onDragLeave={handleDragLeave} 
                  onDrop={handleDrop} 
                  className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${ 
                    isDragging 
                    ? "border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/20 scale-[1.02]" 
                    : file 
                      ? "border-emerald-500/50 bg-emerald-50/30" 
                      : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50" 
                  }`} 
                >
                  <div className={`p-4 rounded-full mb-4 transition-colors ${file ? 'bg-emerald-100' : 'bg-indigo-100 group-hover:bg-indigo-200'}`}>
                    {file ? <ImageIcon className="h-8 w-8 text-emerald-600" /> : <UploadCloud className="h-8 w-8 text-indigo-600" />}
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {file ? file.name : "Click or drag image here"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {file ? `${originalKB.toFixed(2)} KB` : "Supports JPG, PNG, WEBP"}
                  </p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} 
                  />
                </div>

                {/* Dimensions */}
                <div className={`space-y-4 transition-opacity duration-500 ${bitmap ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-700 font-semibold">Dimensions (Pixels)</Label>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex-1 space-y-1">
                      <span className="text-xs text-slate-500 font-medium px-1">Width</span>
                      <Input type="number" min={1} value={dimensions.width} onChange={handleWidthChange} className="bg-white border-slate-300"/>
                    </div>
                    <div className="pt-5">
                      <Toggle 
                        pressed={keepAspectRatio} 
                        onPressedChange={setKeepAspectRatio} 
                        aria-label="Toggle aspect ratio lock"
                        className="data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700 rounded-full w-10 h-10"
                      >
                        {keepAspectRatio ? <Lock size={16}/> : <Unlock size={16}/>}
                      </Toggle>
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs text-slate-500 font-medium px-1">Height</span>
                      <Input type="number" min={1} value={dimensions.height} onChange={handleHeightChange} className="bg-white border-slate-300"/>
                    </div>
                  </div>
                </div>

                {/* Target Size */}
                <div className={`space-y-4 transition-opacity duration-500 ${bitmap ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <Label className="text-slate-700 font-semibold">Target File Size</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input 
                        type="number" 
                        min={5} 
                        step={5} 
                        value={targetKB} 
                        onChange={(e) => setTargetKB(Number(e.target.value))}
                        className="pl-4 pr-12 bg-white border-slate-300 text-lg font-medium h-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">KB</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[20, 50, 100, 250].map(kb => (
                      <button 
                        key={kb} 
                        onClick={() => setTargetKB(kb)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                          targetKB === kb 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200" 
                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        {kb} KB
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={doResizeAndCompress} 
                  disabled={!file || isBusy} 
                  className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                  {isBusy ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-5 h-5" /> Compress Image
                    </span>
                  )}
                </Button>
                
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN: PREVIEWS --- */}
          <div className="lg:col-span-7">
            <Card className="border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  Live Preview
                </CardTitle>
                {result && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    SAVED {savingsPercent}%
                  </span>
                )}
              </div>
              <CardContent className="p-6 bg-slate-100 flex-1 flex flex-col">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Original Box */}
                  <PreviewBox 
                    title="Original Image" 
                    url={file ? URL.createObjectURL(file) : undefined}
                    kb={originalKB}
                    isPlaceholder={!file}
                  />
                  
                  {/* Resized Box */}
                  <PreviewBox 
                    title="Optimized Result" 
                    url={result?.url}
                    kb={result?.kb}
                    isPlaceholder={!result}
                    highlight
                  />
                </div>

                {result && (
                  <div className="mt-6 p-4 bg-white border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <ArrowRight className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Final Output Size</p>
                        <p className="text-xl font-bold text-slate-900">{result.kb.toFixed(2)} <span className="text-sm font-medium text-slate-500">KB</span></p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => downloadBlob(result.blob, `resized_${result.kb.toFixed(0)}KB.jpg`)} 
                      className="w-full sm:w-auto h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                    >
                      <Download className="mr-2 h-5 w-5"/>
                      Download Result
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- SEO ARTICLE SECTION --- */}
<article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 max-w-5xl mx-auto">
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-slate-900 mb-4">
      Free Online Image Resizer & Compressor for Worldwide Reach
    </h2>

    <p className="text-slate-600 leading-relaxed mb-4">
      Welcome to a browser-based image resizer and compressor for brands, publishers, e-commerce stores, content creators, and international marketers. This tool is designed to help you manage image size, improve page speed, and support better performance across devices.
    </p>

    <p className="text-slate-600 leading-relaxed mb-4">
      If you want to reach wider audiences and support better page performance, optimized images are an important improvement. Our free online image compressor helps you resize, compress, and prepare visuals for publishing without sacrificing quality.
    </p>

    <p className="text-slate-600 leading-relaxed mb-4">
      With support for precise file size targets like <strong>20KB, 50KB, 100KB, and 200KB</strong>, you can create images optimized for product listings, blog headers, social media posts, email campaigns, and mobile-first websites.
    </p>

    <p className="text-slate-600 leading-relaxed">
      All image processing happens locally in your browser. That means no uploads, no server storage, and total privacy for your photos and business assets.
    </p>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Why Image Optimization Matters for Government Documents and Job Applications</h2>

    <p className="text-slate-600 leading-relaxed mb-4">
      Optimizing photos and scanned documents is important for submitting government forms, job applications, ID photos, exam registrations, and other official paperwork online.
    </p>

    <p className="text-slate-600 leading-relaxed mb-4">
      Proper image size and file weight can help uploads complete successfully and ensure documents display correctly in portals for passports, visas, employment, licenses, and certificates.
    </p>

    <p className="text-slate-600 leading-relaxed mb-4">
      This resizer can help you prepare images that meet common upload requirements for government agencies and employers while keeping the content readable.
    </p>

    <p className="text-slate-600 leading-relaxed">
      Use the tool to make your documents easier to upload, faster to review, and more consistent across official submission systems.
    </p>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      How It Works: Resize, Compress, and Optimize</h2>

    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Step 1: Upload Your Image</h3>
        <p className="text-slate-600 leading-relaxed">
          Drag and drop or select a JPG, JPEG, PNG, or WEBP file. The upload zone is built to handle modern image formats so you can optimize photos, icons, banners, and illustrations without any hassle.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Step 2: Choose Dimensions</h3>
        <p className="text-slate-600 leading-relaxed">
          Enter the exact width and height you need. The aspect ratio lock keeps your images proportional, which is essential when resizing for responsive web design and professional layouts.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Step 3: Set a Target File Size</h3>
        <p className="text-slate-600 leading-relaxed">
          Choose a target like 50KB, 100KB, or 200KB to create lightweight images that still look great. This precision is key for optimizing page speed and meeting upload limits on global platforms.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Step 4: Compress and Preview</h3>
        <p className="text-slate-600 leading-relaxed">
          Preview the original and compressed versions side by side, then download the version that best balances quality and performance. This step is perfect for comparing how much file size you can save without losing image clarity.
        </p>
      </div>
    </div>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Benefits for Official Documents and Professional Use</h2>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3">Faster Upload and Review Experience</h3>
        <p className="text-slate-600 leading-relaxed">
          Optimized images reduce page weight and load faster anywhere in the world. This can support search ranking and user retention across international audiences.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3">Better Mobile Experience</h3>
        <p className="text-slate-600 leading-relaxed">
          Mobile-first indexing makes fast images essential. Smaller, compressed files help your site perform well on smartphones and tablets in every market.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3">Official Document Compatibility</h3>
        <p className="text-slate-600 leading-relaxed">
          Smaller, optimized images can help meet upload requirements for government portals, job application systems, and official document submission platforms.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3">Easier International Accessibility</h3>
        <p className="text-slate-600 leading-relaxed">
          Compressed images use less bandwidth and load faster for users in lower-speed internet regions. This makes your content more accessible and user-friendly globally.
        </p>
      </div>
    </div>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      SEO Best Practices for Image Optimization</h2>

    <p className="text-slate-600 leading-relaxed mb-4">
      Use descriptive file names and alt text to help search engines understand your images. Keywords like "fast image compressor", "free image resizer", and "worldwide image optimization" can improve how your visual content appears in search results.
    </p>

    <p className="text-slate-600 leading-relaxed mb-4">
      Keep your image dimensions aligned with page design, avoid oversized files, and always preview your compressed image before publishing. This saves bandwidth and improves the browsing experience.
    </p>

    <p className="text-slate-600 leading-relaxed mb-4">
      Compress images for online forms and document uploads — reduced file sizes can help ensure faster uploads and clearer display in official systems.
    </p>

    <p className="text-slate-600 leading-relaxed">
      Optimized images are one of the easier technical improvements you can make to support worldwide ranking and web monetization.
    </p>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Practical Use Cases for Worldwide Growth</h2>

    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">E-commerce Stores</h3>
        <p className="text-slate-600 leading-relaxed">
          Compress product images to improve catalog speed, help shoppers compare items faster, and reduce cart abandonment. Fast product pages are especially important for global buyers.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Blogs and News Websites</h3>
        <p className="text-slate-600 leading-relaxed">
          Bloggers and publishers can use optimized visuals to support long-form articles without slowing page load times. This helps content rank better in keyword-rich searches across regions.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Social Media Campaigns</h3>
        <p className="text-slate-600 leading-relaxed">
          Compress creative ads and social graphics for fast upload and crisp display. Optimized assets improve ad performance and usability on global platforms.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Email Marketing</h3>
        <p className="text-slate-600 leading-relaxed">
          Smaller image file sizes mean emails load faster and are less likely to be clipped. This improves the open and click-through rate for international email campaigns.
        </p>
      </div>
    </div>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Supported Formats for Global Image Workflows</h2>

    <div className="flex flex-wrap gap-3 mb-6">
      {["JPG", "JPEG", "PNG", "WEBP"].map((format) => (
        <span
          key={format}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium"
        >
          {format}
        </span>
      ))}
    </div>

    <p className="text-slate-600 leading-relaxed mb-4">
      JPG and JPEG are excellent for photographs and detailed visuals. PNG is best for transparent logos, icons, and graphics. WEBP provides the best balance of quality and compression for modern web projects.
    </p>

    <p className="text-slate-600 leading-relaxed">
      This tool supports all these popular formats, making it easy to prepare images for websites, ads, emails, and marketing campaigns that need worldwide delivery.
    </p>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Frequently Asked Questions About Worldwide Image Optimization</h2>

    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Is this image compressor free to use?</h3>
        <p className="text-slate-600 leading-relaxed">
          Yes, it is completely free to use, with no sign-up required. You can optimize unlimited images directly in your browser.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Can I compress images to exactly 50KB or 100KB?</h3>
        <p className="text-slate-600 leading-relaxed">
          Yes. Enter the target file size and the tool will compress your image as close as possible while preserving quality.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Does this tool support high-resolution images?</h3>
        <p className="text-slate-600 leading-relaxed">
          Yes, it supports high-resolution photos and allows you to resize them to the appropriate pixel dimensions for your page.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Do I need to upload images to a server?</h3>
        <p className="text-slate-600 leading-relaxed">
          No. Everything runs in your browser, so your images stay on your device and are never uploaded to a remote server.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Can optimized images help with government document uploads?</h3>
        <p className="text-slate-600 leading-relaxed">
          Optimized images can help reduce file size and improve upload reliability for government forms, job application portals, and official submission systems.
        </p>
      </div>
    </div>
  </section>

  <section>
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Start Optimizing Images for Global Reach Today</h2>

    <p className="text-slate-600 leading-relaxed mb-4">
      Useful content paired with optimized visual assets is a practical strategy for reaching worldwide audiences. Use this free image resizer and compressor to make your website faster, more accessible, and more consistent for search engines and document portals.
    </p>

    <p className="text-slate-600 leading-relaxed mb-4">
      Whether you are preparing images for a global blog, an international e-commerce store, or a content-driven website, this tool helps you deliver visuals that load quickly and keep visitors engaged.
    </p>

    <p className="text-slate-600 leading-relaxed mb-4">
      Focus on quality content, responsive design, and optimized images to support better page performance. Fast and lightweight images are a helpful part of that approach.
    </p>

    <p className="text-slate-600 leading-relaxed">
      Start using the resizer now to prepare images for government document uploads, job applications, and official online forms.</p>
  </section>
</article>

      </div>
    </main>
  );
}

/* --- ENHANCED PREVIEW COMPONENT --- */
interface PreviewBoxProps {
  title: string;
  url?: string;
  kb?: number;
  isPlaceholder: boolean;
  highlight?: boolean;
}

const PreviewBox = ({ title, url, kb, isPlaceholder, highlight }: PreviewBoxProps) => {
  return (
    <div className={`relative flex flex-col h-full min-h-[300px] rounded-xl overflow-hidden border-2 transition-all ${
      highlight && !isPlaceholder ? "border-indigo-400 shadow-md" : "border-slate-200"
    }`}>
      {/* Top Bar inside preview */}
      <div className="absolute top-0 left-0 w-full bg-slate-900/80 backdrop-blur-sm p-3 z-10 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {kb !== undefined && kb > 0 && (
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded font-mono">
            {kb.toFixed(2)} KB
          </span>
        )}
      </div>

      {/* Image Area */}
      <div 
        className="flex-1 w-full bg-slate-800 flex items-center justify-center p-4 pt-14"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #1e293b 25%, transparent 25%), 
            linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #1e293b 75%), 
            linear-gradient(-45deg, transparent 75%, #1e293b 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          backgroundColor: '#0f172a'
        }}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={url} 
            alt={`${title} preview`} 
            className="max-w-full max-h-full object-contain rounded drop-shadow-2xl" 
          />
        ) : (
          <div className="text-center text-slate-500 flex flex-col items-center">
            <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">{isPlaceholder ? "Awaiting Image" : "No Preview"}</p>
          </div>
        )}
      </div>
    </div>
  );
};