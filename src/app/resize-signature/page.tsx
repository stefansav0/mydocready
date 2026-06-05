"use client";

import { useState, useCallback, ChangeEvent } from "react";
import {
  compressToTargetKB,
  downloadBlob,
  trimWhitespace,
} from "@/utils/image";
import { 
  UploadCloud, 
  Download, 
  Scissors,
  PenTool,
  Settings2,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ResultState = {
  url: string;
  blob: Blob;
  kb: number;
};

export default function ResizeSignaturePage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [targetKB, setTargetKB] = useState<number>(20);
  const [result, setResult] = useState<ResultState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setResult(null);
  }, []);

  const doProcessSignature = useCallback(async () => {
    if (!file) return;

    setIsBusy(true);
    setResult(null);
    try {
      const originalImage = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      canvas.getContext("2d")?.drawImage(originalImage, 0, 0);

      const trimmedCanvas = trimWhitespace(canvas);

      const { blob, objectURL, finalKB } = await compressToTargetKB(
        trimmedCanvas,
        targetKB
      );
      setResult({ url: objectURL, blob, kb: finalKB });

    } catch (error) {
      console.error("Failed to process signature:", error);
    } finally {
      setIsBusy(false);
    }
  }, [file, targetKB]);

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
    <main className="min-h-screen bg-slate-50 py-12 selection:bg-blue-100 selection:text-blue-900">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Smart Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Cleaner</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your signature. We&apos;ll automatically trim the excess white space and compress it to your exact required file size for official portals.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 mb-16">
          
          {/* --- LEFT COLUMN: CONTROLS --- */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings2 className="w-5 h-5 text-blue-400" />
                  Processing Controls
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
                    ? "border-blue-500 bg-blue-50 ring-4 ring-blue-500/20 scale-[1.02]" 
                    : file 
                      ? "border-emerald-500/50 bg-emerald-50/30" 
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50" 
                  }`} 
                >
                  <div className={`p-4 rounded-full mb-4 transition-colors ${file ? 'bg-emerald-100' : 'bg-blue-100 group-hover:bg-blue-200'}`}>
                    {file ? <CheckCircle2 className="h-8 w-8 text-emerald-600" /> : <UploadCloud className="h-8 w-8 text-blue-600" />}
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {file ? file.name : "Click or drag signature here"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {file ? `${originalKB.toFixed(2)} KB` : "Supports JPG, PNG, WEBP"}
                  </p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files?.[0] || null)} 
                  />
                </div>

                {/* Target Size Input */}
                <div className={`space-y-4 transition-opacity duration-500 ${file ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <Label htmlFor="targetKB" className="text-slate-700 font-semibold">Maximum Target Size</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input 
                        id="targetKB"
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
                    {[10, 20, 50, 100].map(kb => (
                      <button 
                        key={kb} 
                        onClick={() => setTargetKB(kb)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                          targetKB === kb 
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" 
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {kb} KB
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={doProcessSignature} 
                  disabled={!file || isBusy} 
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                  {isBusy ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Scissors className="w-5 h-5" /> Trim & Compress
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
                  <PenTool className="w-5 h-5 text-blue-400" />
                  Signature Preview
                </CardTitle>
                {result && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    SAVED {savingsPercent}%
                  </span>
                )}
              </div>
              <CardContent className="p-6 bg-slate-100 flex-1 flex flex-col space-y-6">
                
                <div className="flex-1 flex flex-col gap-6">
                  {/* Original Box */}
                  <PreviewBox 
                    title="Original Signature" 
                    url={originalUrl || undefined}
                    kb={originalKB}
                    isPlaceholder={!file}
                  />
                  
                  {/* Processed Box */}
                  <PreviewBox 
                    title="Trimmed & Optimized Result" 
                    url={result?.url}
                    kb={result?.kb}
                    isPlaceholder={!result}
                    highlight
                  />
                </div>

                {result && (
                  <div className="p-4 bg-white border border-blue-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <ArrowRight className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Final Output Size</p>
                        <p className="text-xl font-bold text-slate-900">{result.kb.toFixed(2)} <span className="text-sm font-medium text-slate-500">KB</span></p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => downloadBlob(result.blob, `signature_${result.kb.toFixed(0)}KB.jpg`)} 
                      className="w-full sm:w-auto h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                    >
                      <Download className="mr-2 h-5 w-5"/>
                      Download Signature
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- SEO ARTICLE SECTION --- */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 max-w-4xl mx-auto">
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Free Online Signature Cropper & Compressor</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              When applying for jobs, university admissions, or filling out official government forms, you are often required to upload a digital copy of your signature. However, portals frequently reject images because they contain too much blank space or exceed strict file size limits (like 10KB, 20KB, or 50KB). 
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our Smart Signature Cleaner solves this problem instantly. It automatically detects your pen strokes, crops out the unnecessary white space, and compresses the final image to your exact target size. Because everything runs locally in your browser, <strong>your signature remains 100% private and secure</strong>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Optimize Your Signature</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { step: "1", title: "Take a Photo", desc: "Sign a blank piece of white paper with a dark pen. Take a clear photo and upload it here." },
                { step: "2", title: "Set File Size", desc: "Check the requirements of your form (e.g., Max 20KB) and enter that number into our tool." },
                { step: "3", title: "Trim & Download", desc: "Click process. We will automatically crop the edges and compress the file for immediate download." }
              ].map((item) => (
                <div key={item.step} className="bg-slate-50 p-5 rounded-xl border border-slate-100 relative">
                  <span className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold border-4 border-white shadow-sm">
                    {item.step}
                  </span>
                  <h3 className="font-semibold text-slate-800 mb-2 mt-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Use Our Signature Tool?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Automatic White Space Trimming</h4>
                  <p className="text-slate-600 text-sm mt-1">Stop manually cropping photos on your phone. Our smart algorithm scans your image and perfectly crops to the edges of your actual handwriting.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Bypass Portal Restrictions</h4>
                  <p className="text-slate-600 text-sm mt-1">Government and university portals are notorious for strict limits. Easily compress your signature to under 10KB, 20KB, or 50KB without losing readability.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Total Data Privacy</h4>
                  <p className="text-slate-600 text-sm mt-1">Your signature is highly sensitive personal data. We utilize HTML5 browser technology so your image is never uploaded, stored, or seen by our servers.</p>
                </div>
              </li>
            </ul>
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
    <div className={`relative flex flex-col w-full h-48 rounded-xl overflow-hidden border-2 transition-all ${
      highlight && !isPlaceholder ? "border-blue-400 shadow-md" : "border-slate-200"
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
            className="max-w-full max-h-full object-contain drop-shadow-lg" 
          />
        ) : (
          <div className="text-center text-slate-500 flex flex-col items-center">
            <PenTool className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm font-medium">{isPlaceholder ? "Awaiting Signature" : "No Preview"}</p>
          </div>
        )}
      </div>
    </div>
  );
};