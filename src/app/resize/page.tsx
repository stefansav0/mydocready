"use client";

import { useCallback, useState, useRef, ChangeEvent } from "react";
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
    const bmp = await fileToImageBitmap(selectedFile);
    setBitmap(bmp);

    setDimensions({ width: bmp.width, height: bmp.height });
    aspectRatio.current = bmp.width / bmp.height;
  }, []);

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    if (keepAspectRatio && aspectRatio.current) {
      const newHeight = Math.round(newWidth / aspectRatio.current);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions((prev) => ({ ...prev, width: newWidth }));
    }
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
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
                      <Input type="number" value={dimensions.width} onChange={handleWidthChange} className="bg-white border-slate-300"/>
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
                      <Input type="number" value={dimensions.height} onChange={handleHeightChange} className="bg-white border-slate-300"/>
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
      Free Online Image Resizer & Compressor
    </h2>

    <p className="text-slate-600 leading-relaxed mb-4">
      Resize, compress, and optimize your images instantly with our free
      online Image Resizer & Compressor. Whether you need to reduce an image
      to <strong>50KB, 100KB, or 200KB</strong>, resize dimensions for social
      media, optimize website images, or meet document upload requirements,
      our tool makes the process fast and effortless.
    </p>

    <p className="text-slate-600 leading-relaxed">
      Unlike many online tools, all image processing happens directly in your
      browser. Your photos are <strong>never uploaded to any server</strong>,
      ensuring complete privacy, security, and lightning-fast performance.
    </p>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      How to Resize and Compress an Image
    </h2>

    <div className="grid gap-4 md:grid-cols-3">
      {[
        {
          step: "1",
          title: "Upload Your Image",
          desc: "Select or drag and drop your JPG, PNG, JPEG, or WEBP image into the upload area.",
        },
        {
          step: "2",
          title: "Customize Settings",
          desc: "Choose image dimensions, quality level, or target file size such as 50KB or 100KB.",
        },
        {
          step: "3",
          title: "Compress & Download",
          desc: "Preview your optimized image and download it instantly with a single click.",
        },
      ].map((item) => (
        <div
          key={item.step}
          className="bg-slate-50 p-5 rounded-xl border border-slate-100 relative"
        >
          <span className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold border-4 border-white shadow-sm">
            {item.step}
          </span>

          <h3 className="font-semibold text-slate-800 mb-2 mt-2">
            {item.title}
          </h3>

          <p className="text-sm text-slate-600">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Why Choose Our Image Compressor?
    </h2>

    <ul className="space-y-5">
      <li className="flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <h3 className="font-semibold text-slate-800">
            Compress to Exact File Size
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            Easily reduce image size to 20KB, 50KB, 100KB, 200KB, or any custom
            size required for job applications, government forms, and online
            submissions.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <h3 className="font-semibold text-slate-800">
            Maintain Aspect Ratio
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            Resize images without stretching or distortion. Lock the aspect
            ratio and keep your photos looking professional.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <h3 className="font-semibold text-slate-800">
            100% Private & Secure
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            Your images never leave your device. Everything is processed locally
            in your browser using modern web technologies.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <h3 className="font-semibold text-slate-800">
            Fast Browser-Based Processing
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            No uploads, no waiting, and no server delays. Compress and resize
            images within seconds.
          </p>
        </div>
      </li>

      <li className="flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <h3 className="font-semibold text-slate-800">
            Unlimited Free Usage
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            Use the tool as many times as you want without creating an account
            or paying any fees.
          </p>
        </div>
      </li>
    </ul>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Perfect For
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        "Job Application Photos",
        "Government Form Uploads",
        "Website Image Optimization",
        "Blog & SEO Images",
        "Social Media Posts",
        "E-commerce Product Photos",
        "Email Attachments",
        "School & College Documents",
      ].map((item) => (
        <div
          key={item}
          className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-slate-700"
        >
          {item}
        </div>
      ))}
    </div>
  </section>

  <section className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Supported Formats
    </h2>

    <div className="flex flex-wrap gap-3">
      {["JPG", "JPEG", "PNG", "WEBP"].map((format) => (
        <span
          key={format}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium"
        >
          {format}
        </span>
      ))}
    </div>
  </section>

  <section>
    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Frequently Asked Questions
    </h2>

    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">
          Is this image compressor free?
        </h3>
        <p className="text-slate-600">
          Yes, our image compressor is completely free and can be used without
          registration.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">
          Can I compress images to 50KB or 100KB?
        </h3>
        <p className="text-slate-600">
          Yes, simply enter your desired target file size and our compression
          engine will optimize the image accordingly.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">
          Are my images uploaded to a server?
        </h3>
        <p className="text-slate-600">
          No. All image processing takes place locally in your browser for
          maximum privacy and security.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">
          Will image quality be affected?
        </h3>
        <p className="text-slate-600">
          Our tool maintains the best possible balance between image quality and
          file size reduction.
        </p>
      </div>
    </div>
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