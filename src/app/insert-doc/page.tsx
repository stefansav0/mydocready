"use client";

import { useState, useEffect, useCallback } from "react";
import { fileToImageBitmap } from "@/utils/image";
import { jsPDF } from "jspdf";
import { 
  UploadCloud, 
  FileText, 
  Download, 
  Settings2, 
  CheckCircle2, 
  Grid, 
  UserSquare,
  FileBadge2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SLOT = { w: 35, h: 45 }; // Passport photo slot in mm

export default function InsertDocPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Clean up object URL when file or component changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, [preview]);

  const makePDF = async () => {
    if (!file) return;
    setIsBusy(true);

    try {
      // Convert image to base64 for jsPDF
      const dataURL = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(file);
      });

      // Determine image format from Data URL
      const formatMatch = dataURL.match(/^data:image\/(jpeg|png|jpg);base64,/);
      const imgFormat = formatMatch
        ? formatMatch[1].toUpperCase() === "JPG"
          ? "JPEG"
          : formatMatch[1].toUpperCase()
        : "JPEG";

      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      if (!isMultiple) {
        // --- Single Slot Layout ---
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Official Document Registration", 20, 20);

        const x = 20;
        const y = 35;

        // Slot border
        doc.setDrawColor(180);
        doc.rect(x, y, SLOT.w, SLOT.h);

        // Scale and position image
        const img = await fileToImageBitmap(file);
        const iw = img.width, ih = img.height, ir = iw / ih;
        const sr = SLOT.w / SLOT.h;
        let w = SLOT.w, h = SLOT.h, ox = 0, oy = 0;

        if (ir > sr) {
          h = SLOT.h;
          w = h * ir;
          ox = x + (SLOT.w - w) / 2;
          oy = y;
        } else {
          w = SLOT.w;
          h = w / ir;
          ox = x;
          oy = y + (SLOT.h - h) / 2;
        }

        doc.addImage(dataURL, imgFormat, ox, oy, w, h, undefined, "FAST");

        // Info fields
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Full Name: _________________________________", x, y + SLOT.h + 15);
        doc.text("Date of Birth: _______________________________", x, y + SLOT.h + 25);
        doc.text("Identification No: ___________________________", x, y + SLOT.h + 35);
        doc.text("Signature: _________________________________", x, y + SLOT.h + 55);
      } else {
        // --- Multiple Photo Grid Layout ---
        doc.setFontSize(14);
        doc.text("Passport Photos (35x45mm) - A4 Print Ready", 20, 20);
        
        const cols = 4, rows = 5, gap = 6;
        const startX = 20;
        const startY = 30;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const gx = startX + c * (SLOT.w + gap);
            const gy = startY + r * (SLOT.h + gap);
            // Draw faint cut lines
            doc.setDrawColor(220);
            doc.rect(gx, gy, SLOT.w, SLOT.h);
            doc.addImage(dataURL, imgFormat, gx, gy, SLOT.w, SLOT.h, undefined, "FAST");
          }
        }
      }

      doc.save(`Passport_Photos_${isMultiple ? 'Grid' : 'Doc'}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Printable <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Passport Photos</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your portrait and instantly generate an A4 PDF. Choose between a single official document layout or a multi-photo grid for printing.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 mb-16">
          
          {/* --- LEFT COLUMN: CONTROLS --- */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings2 className="w-5 h-5 text-indigo-400" />
                  Setup & Layout
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
                    {file ? <CheckCircle2 className="h-8 w-8 text-emerald-600" /> : <UploadCloud className="h-8 w-8 text-indigo-600" />}
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {file ? file.name : "Click or drag portrait here"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {file ? "Ready to generate" : "Supports JPG, PNG formats"}
                  </p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} 
                  />
                </div>

                {/* Print Layout Selection */}
                <div className={`space-y-4 transition-opacity duration-500 ${file ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <label className="text-slate-700 font-semibold block">Select Print Layout</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsMultiple(false)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        !isMultiple 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                      }`}
                    >
                      <UserSquare className={`w-6 h-6 ${!isMultiple ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className="text-sm font-bold">Registration Form</span>
                    </button>
                    
                    <button
                      onClick={() => setIsMultiple(true)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isMultiple 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                      }`}
                    >
                      <Grid className={`w-6 h-6 ${isMultiple ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className="text-sm font-bold">Print Grid (20x)</span>
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={makePDF} 
                  disabled={!file || isBusy} 
                  className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                  {isBusy ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> Generating PDF...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Generate A4 PDF
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
                  <FileBadge2 className="w-5 h-5 text-indigo-400" />
                  Live Preview
                </CardTitle>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                  STANDARD 35x45mm
                </span>
              </div>
              <CardContent className="p-6 bg-slate-100 flex-1 flex flex-col items-center justify-center">
                
                {preview ? (
                  <div className="relative bg-white p-6 shadow-xl border border-slate-200 w-full max-w-sm rounded-lg flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                      <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                    </div>
                    
                    {/* Simulated A4 Document / Grid look */}
                    <div className={`border-2 border-dashed border-indigo-200 p-1 mb-4 ${isMultiple ? 'grid grid-cols-2 gap-2' : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={preview} 
                        alt="Passport Preview" 
                        className="w-[105px] h-[135px] object-cover bg-slate-100" // 35x45 scaled ratio
                      />
                      {isMultiple && (
                        <>
                          <div className="w-[105px] h-[135px] bg-slate-100 border border-slate-200 opacity-50"></div>
                          <div className="w-[105px] h-[135px] bg-slate-100 border border-slate-200 opacity-30"></div>
                          <div className="w-[105px] h-[135px] bg-slate-100 border border-slate-200 opacity-10"></div>
                        </>
                      )}
                    </div>
                    
                    {!isMultiple && (
                      <div className="w-full space-y-2 mt-2 opacity-50 grayscale">
                        <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                        <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                        <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center p-12">
                    <UserSquare className="w-16 h-16 mb-4 opacity-50 text-indigo-300" />
                    <p className="text-sm font-medium text-slate-500">Upload a photo to see preview</p>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- SEO ARTICLE SECTION --- */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 max-w-4xl mx-auto">
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Free Printable Passport Photo Maker</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
  Create perfectly formatted <strong>35×45mm passport-size photos</strong> from any portrait in just a few clicks. Upload your photo, and our free tool automatically converts it into a print-ready passport or visa photo that meets standard size requirements.
</p>

            <p className="text-slate-600 leading-relaxed">
              We perfectly size and scale your image onto an A4 PDF document that you can print directly at home or at a local print shop. Because all PDF generation happens securely in your browser, your personal photos are entirely private and are never uploaded to our servers.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Make a Passport Photo PDF</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { step: "1", title: "Upload Portrait", desc: "Take a clear photo against a plain background and upload it into the tool." },
                { step: "2", title: "Choose Layout", desc: "Select a single registration form layout, or a grid of 20 photos for bulk printing." },
                { step: "3", title: "Download PDF", desc: "Click generate to instantly download your perfectly sized A4 printable PDF." }
              ].map((item) => (
                <div key={item.step} className="bg-slate-50 p-5 rounded-xl border border-slate-100 relative">
                  <span className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold border-4 border-white shadow-sm">
                    {item.step}
                  </span>
                  <h3 className="font-semibold text-slate-800 mb-2 mt-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Features</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Exact 35x45mm Dimensions</h4>
                  <p className="text-slate-600 text-sm mt-1">We automatically calculate the DPI and millimeters required to ensure your photo prints at exactly the globally accepted 35mm by 45mm standard.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Multiple Copies (Print Grid)</h4>
                  <p className="text-slate-600 text-sm mt-1">Need multiple copies? Select the Print Grid option to automatically arrange up to 20 identical passport photos on a single A4 page with perfect cut-lines.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800">Client-Side Privacy</h4>
                  <p className="text-slate-600 text-sm mt-1">Unlike other online converters, your photo never leaves your computer. We use jsPDF to build the document entirely within your local browser memory.</p>
                </div>
              </li>
            </ul>
          </section>
        </article>

      </div>
    </main>
  );
}