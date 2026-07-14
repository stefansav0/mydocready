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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Free Online Signature Cropper and Compressor for Forms, Portals, and Documents</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A digital signature is often required when applying for jobs, opening accounts, submitting university forms, or completing official paperwork. In many cases, the image has to meet a strict size requirement and also look clear enough to be accepted. If the file contains too much surrounding white space, the image can look larger than necessary, and some portals may reject it even if the signature itself is perfectly legible.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              This page is designed to help you prepare a signature image in a more practical format. The process is simple: upload your signature, trim unnecessary background around the strokes, reduce the file size if needed, and download the result. The goal is not to change the signature itself, but to make it easier to use in places where file size limits and image layout matter.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Because the workflow is browser-based, the image stays in your own browser session while you work with it. That can be helpful when you want to keep the process simple and avoid sending the file to external systems. The tool is meant to support everyday form preparation, scanning cleanup, and signature resizing for common document needs.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Signature Images Often Need Cropping and Compression</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A signature image created from a phone camera or scanner can include extra blank space around the handwritten strokes. That blank area may not be visible at first, but it can increase the file size significantly. When the same image is uploaded to a form, the portal may reject it because the image is too large, too wide, or too tall for the allowed format.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Many portals ask for a smaller file even when the visual quality of the signature is otherwise acceptable. A crop can remove unnecessary margins, and a compression step can reduce the amount of data the image carries. The result is often a cleaner file that fits better into a required upload area.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This is especially common with scanned signatures, photos taken under bright light, or images captured from a phone that include a large background area. The simple act of trimming the extra space can make a noticeable difference in how the file behaves during upload.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Prepare a Signature for Upload</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { step: "1", title: "Create a Clean Signature", desc: "Sign on plain white paper with a dark pen so the strokes are visible and the image has good contrast." },
                { step: "2", title: "Capture the Image Clearly", desc: "Use good lighting and keep the phone or scanner level so the signature remains readable and not tilted." },
                { step: "3", title: "Trim and Resize", desc: "Upload the image, remove extra white space, and set a target size that matches your form requirement." }
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

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What Affects Signature File Size</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              File size is shaped by several factors, not only by the visible content. The dimensions of the image, its resolution, the amount of blank space, and the chosen file format all matter. A larger image with more pixels will usually take more space, especially if it includes a lot of empty background around the signature.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Compression can reduce the file size by simplifying the image data, but it should be applied carefully. If too much compression is used, the signature may become blurry or lose fine edges. The most practical approach is to trim the image first and then compress just enough to fit the required target size while keeping the signature legible.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This is why a simple workflow works well: remove what is unnecessary, keep the actual handwriting visible, and only adjust the size as much as needed. That makes the final image easier to upload and easier to review on the receiving side.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How the Trimming Process Helps</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Trimming is one of the most effective ways to make a signature image easier to use. If the background area around the strokes is large, the image can look visually weak and may take more space than necessary. By removing that excess area, the main part of the signature becomes the focus and the file becomes more manageable.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              A cropped signature can also fit better into smaller upload areas on web forms. Some portals display signatures inside a limited box, so a file that is too wide or too tall may be awkward to position. A tighter crop can make the signature feel more balanced and easier for the form to display.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For this reason, cropping is often the first step in preparing a signature image for anything from a job application to a college admission form. Once the surrounding space is reduced, the next adjustment is usually file-size compression.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Best Practices for Taking a Signature Photo</h2>
            <ul className="space-y-3 text-slate-600 leading-relaxed list-disc pl-6">
              <li>Use plain white or very light paper so the signature stands out clearly.</li>
              <li>Write with a dark pen and avoid faint strokes that may disappear after compression.</li>
              <li>Keep the camera directly above the paper to avoid distortion or slanted lines.</li>
              <li>Make sure the signature fills a good portion of the image without touching the edges too closely.</li>
              <li>Use even lighting so there are no shadows or glare that could make the signature harder to read.</li>
              <li>Take one or two extra photos in case the first result is blurred or uneven.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Choosing a Target Size for Your Form</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Different portals have different requirements. Some may allow a larger upload, while others may require a very small file such as 10KB, 20KB, or 50KB. Before you upload, it is useful to check the instructions carefully and choose a target size that matches what the form expects.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              If a target size is not specified, a modest reduction is often sufficient. The most important thing is that the signature still looks clear and readable. This is why the tool is useful: it lets you adjust the size without forcing you to manually edit the image in another application.
            </p>
            <p className="text-slate-600 leading-relaxed">
              In many cases, the ideal result is a file that is small enough to upload comfortably but not so compressed that the signature becomes muddy or hard to recognize. A balanced outcome is usually the best choice.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">When to Use a Signature Compressor</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A signature compressor is helpful whenever an image needs to be made lighter for upload. This can happen with forms that limit the size of attachments, portals that require a specific thumbnail size, or systems that resize images automatically when they are added to a profile or document.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Compression is also useful when you want to send a signature image by email or through a document system that stores images more efficiently. Even if a portal does not enforce a strict maximum file size, a smaller image can still be easier to handle and faster to upload.
            </p>
            <p className="text-slate-600 leading-relaxed">
              It is worth remembering that compression and cropping are two different steps. Cropping removes excess space, while compression reduces the amount of data in the image. Both are useful, but they solve slightly different problems.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Keep Your Signature Clear After Resizing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Clear signatures usually come from good habits before the image is processed. If the initial photo is sharp, the contrast is strong, and the handwriting is dark enough, the final result is more likely to remain readable after reduction. A signature that is too faint may become difficult to see after compression, especially if the file is made very small.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              One practical approach is to test a few adjustments and compare the results. If the image looks acceptable at a lower size, the file is likely suitable for upload. If the lines become too soft, you can return to the original image, improve the capture, or use a slightly higher target size.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The best result is often a simple balance between compactness and clarity. That balance is what makes a signature upload more likely to be accepted without issues.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Mistakes to Avoid</h2>
            <ul className="space-y-3 text-slate-600 leading-relaxed list-disc pl-6">
              <li>Using a photo taken from too far away, which makes the signature appear small and less readable.</li>
              <li>Allowing too much background around the signature, which increases file size without improving the image.</li>
              <li>Compressing the file too aggressively, which can blur the stroke edges.</li>
              <li>Uploading an image that is tilted, shadowed, or too bright to read clearly.</li>
              <li>Ignoring the portal’s exact requirements and assuming a generic image size will work.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why a Browser-Based Signature Tool Can Be Helpful</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A browser-based tool is convenient because you can work with your image directly without moving between several applications. You can upload a file, review it in a preview, make adjustments, and download a revised version quickly. For many people, that simple flow is enough to prepare a signature for a form without added hassle.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              It can also be useful when you are working from a phone or a shared computer and do not want to install anything. The process remains lightweight, which makes it easier to repeat whenever you need to prepare a new signature image for another form.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The overall experience is often most successful when the workflow is simple: capture a clean signature, crop the extra area, reduce the size if needed, and review the result before uploading it.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">Can I use this tool for official forms?</h3>
                <p className="text-sm text-slate-600">Yes, it can help prepare a signature image for common form uploads, but the requirements of each portal may differ. It is a good idea to review the form instructions before submitting the final file.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">Will trimming change my signature?</h3>
                <p className="text-sm text-slate-600">The signature itself remains the same. The process mainly removes excess background so the file is easier to use.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">Is compression always necessary?</h3>
                <p className="text-sm text-slate-600">No. Compression is only needed when the image is too large for the form or when you want a smaller file for convenience.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">What if my signature looks blurry after resizing?</h3>
                <p className="text-sm text-slate-600">Try a slightly larger target size or improve the original photo by using better lighting and darker ink.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">Can I use this on a phone?</h3>
                <p className="text-sm text-slate-600">Yes, the page is designed to be simple to open and use on a modern phone or desktop browser.</p>
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