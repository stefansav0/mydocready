"use client";

import { useState, useEffect, useCallback } from "react";
import { fileToImageBitmap } from "@/utils/image";
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
      const { jsPDF } = await import("jspdf");
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Free Printable Passport Photo Maker for Home Printing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you need a passport photo, visa photo, or a simple ID-style portrait for personal use, a printable layout can make the process much easier. This page gives you a practical way to upload a portrait, choose a layout, and generate an A4 document that can be printed at home or taken to a local photo shop. Whether you are preparing paperwork for travel, school, or a professional application, this guide focuses on making the process clearer, more convenient, and easier to understand.
            </p>
            <p className="text-slate-600 leading-relaxed">
              A good passport-style photo is not only about size. Lighting, face position, background, image clarity, and print quality all matter. Because requirements can differ by country, organization, or application type, it is always wise to confirm the current rules with the relevant authority before final submission. This tool is designed to help you prepare a layout for printing and review, not to replace official instructions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why People Use a Passport Photo Layout Tool</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Many people want to avoid long waits, high prices, or inconvenient visits to a photo studio. A digital photo layout tool offers a straightforward alternative for creating a print-ready document from a portrait already stored on a phone or computer. It can be useful for anyone who wants to produce a few copies for a family record, a travel folder, or a document submission that needs multiple prints.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              The value of a simple layout tool is that it reduces the manual work of resizing and arranging images. Instead of trying to position a portrait correctly on paper by hand, you can upload your image, pick a layout, and download a document that is ready to print. This can save time, reduce mistakes, and make it easier to compare multiple versions before printing.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For people who are preparing documents in a hurry, a printable sheet can also be helpful for reviewing the final output before sending it to a printer. It gives you a way to check the crop, alignment, and spacing before you commit to a physical print.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What Makes a Good Passport-Style Photo</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Clear face and natural expression",
                  desc: "A visible face with a neutral or natural expression is usually easier to use than a heavily styled or dramatic pose. The subject should be easy to recognize and not hidden by shadows or accessories."
                },
                {
                  title: "Even lighting",
                  desc: "Soft daylight or balanced studio lighting helps avoid harsh shadows, glare, and washed-out skin tones. Good lighting makes the final print look cleaner and easier to review."
                },
                {
                  title: "Simple background",
                  desc: "A plain or lightly textured background is often the safest choice for portrait-based document photos. It helps the face stand out and keeps the image focused on the subject."
                },
                {
                  title: "High image quality",
                  desc: "A sharp image with enough resolution will print more clearly. Blurry or heavily compressed photos can look worse once they are printed at a small size."
                }
              ].map((item) => (
                <div key={item.title} className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How the Tool Works</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The workflow is intentionally simple. You begin by uploading a portrait from your device. After the image is selected, you can choose between a single document-style layout or a grid layout for printing multiple copies. When you generate the file, the page produces an A4 PDF that can be opened and printed from a browser, a desktop application, or a local print service.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              This approach is useful if you want to create a print-ready document without needing advanced design software. The layout is built to be straightforward, and the output is intended to be reviewed before printing. It is especially helpful for people who want a quick draft or an easy way to prepare several copies at once.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Because the document is generated in the browser, the upload and processing stay local to your device for the image handling steps. That means your photo is not sent to an external service for the export process, which can be appealing for privacy-conscious users.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Choosing the Right Layout</h2>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Single layout for a document or form</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This option is helpful when you want one photo placed in a document-style arrangement. It is often used for a personal record, a registration form, or a simple printable sheet where you want one portrait to appear clearly and neatly.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Grid layout for multiple copies</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The grid option is useful when you need several identical prints at once. It can be practical for families, students, or anyone preparing several documents around the same time. It also helps you review the full sheet before printing.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Printing Tips for Better Results</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Even a well-prepared design can look different depending on the printer and paper used. A home printer may produce good results for occasional use, while a professional print shop may offer more consistent color and sharper edges. If you are printing at home, it is a good idea to test one page first before printing several copies.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Use a good-quality paper or photo paper if available, especially if you want the print to look sharper and more polished.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Check the printer settings to make sure scaling is not unexpectedly altered during the print job.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Review the output at normal size before cutting or trimming anything, especially if the page will be used for a form or official submission.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Mistakes to Avoid</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              A few simple mistakes can make a passport-style photo less useful than it should be. The most common issues are poor lighting, facial obstruction, low-resolution photos, and overly busy backgrounds. Photos that are too dark, too bright, or slightly blurry can appear less clear once printed at a small size.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Another common problem is using a photo that was cropped too tightly. If the image is cut too close to the head or shoulders, the final print may look awkward or incomplete. For this reason, it is usually better to start with a slightly wider image and adjust the crop carefully before generating the PDF.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Accessories, strong shadows, and unusual facial expressions can also make a photo less suitable. If you are unsure what the destination authority expects, it is worth reviewing their current guidance before submitting anything.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Privacy and Local Processing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Privacy is an important consideration when working with personal photographs. This page is built around a browser-based workflow, which means the image is handled locally in the session as part of the document generation process. In practical terms, that means your portrait is not sent to a separate server just to create the PDF export.
            </p>
            <p className="text-slate-600 leading-relaxed">
              That said, it is still good practice to only upload images you are comfortable using, and to remove any file from your device if you no longer need it. If you are using a shared or public computer, you may also want to clear your browser download history and temporary files after completing the process.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Can I make a passport photo from any photo?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">You can use many portrait-style photos, but the final result depends heavily on image quality, lighting, background, and subject positioning. It is best to use a clear image rather than a casual snapshot taken in poor conditions.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Is this tool suitable for official documents?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">It can be useful for preparing a printable layout, but official requirements may vary by country or organization. Always verify the current guidelines before submitting a photo for a formal application.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Can I print multiple copies on one page?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Yes, the grid option is designed for that purpose. It can help you organize several copies on a single A4 document for review and printing.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Do I need special software?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">No advanced software is required. You can upload your image, select a layout, and download the PDF directly from the page.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Will the photo be uploaded to a server?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">The export workflow is designed to stay local to your browser session, so the image handling remains on your device as part of the document generation process.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Final Thoughts</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Preparing a passport-style photo does not have to be complicated. With a clear image, a simple layout, and a reliable printing method, you can create a document that is easy to review and print. The most important part is to start with a good portrait and confirm the requirements that matter for your specific case.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Whether you are making one printable copy or several, the goal is the same: to produce a clean, readable layout that is easy to inspect, print, and use. If you need a practical starting point, this page can help you get from an image file to a print-ready document without unnecessary steps.
            </p>
          </section>
        </article>

      </div>
    </main>
  );
}
