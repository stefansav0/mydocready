"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { downloadBlob, fileToImageBitmap, trimWhitespace } from "@/utils/image";
import {
  Download,
  Image as ImageIcon,
  Printer,
  ScanLine,
  Sparkles,
  Trash2,
  FileText,
  RotateCw,
  Loader2,
  CheckCircle2
} from "lucide-react";

const pageSizes = [
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
];

type ScanFilter = "original" | "grayscale" | "bw";

type ScanItem = {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number;
};

export default function ScanDocumentClient() {
  const [items, setItems] = useState<ScanItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [filter, setFilter] = useState<ScanFilter>("grayscale");
  const [autoCrop, setAutoCrop] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [items]);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | File[] | null) => {
      if (!selectedFiles) return;

      const fileArray = Array.isArray(selectedFiles)
        ? selectedFiles
        : Array.from(selectedFiles);

      const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"));
      if (!imageFiles.length) {
        alert("Please upload one or more valid image files.");
        return;
      }

      const newItems = imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        rotation: 0,
      }));

      setItems((prev) => [...prev, ...newItems]);
      setSuccessMessage("");
      setIsDragging(false);
    },
    []
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleFileSelect(event.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const removeItem = useCallback((idToRemove: string) => {
    setItems((prev) => {
      const item = prev.find(i => i.id === idToRemove);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== idToRemove);
    });
  }, []);

  const rotateItem = useCallback((idToRotate: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === idToRotate
          ? { ...item, rotation: (item.rotation + 90) % 360 }
          : item
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setSuccessMessage("");
  }, [items]);

  const createCleanCanvas = useCallback(
    async (item: ScanItem) => {
      const bitmap = await fileToImageBitmap(item.file);
      const canvas = document.createElement("canvas");
      
      // Adjust dimensions based on rotation
      const isRotated = item.rotation === 90 || item.rotation === 270;
      canvas.width = isRotated ? bitmap.height : bitmap.width;
      canvas.height = isRotated ? bitmap.width : bitmap.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      // Fill background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply scanner filters (Magic step)
      if (filter === "grayscale") {
        ctx.filter = "grayscale(100%) contrast(120%)";
      } else if (filter === "bw") {
        ctx.filter = "grayscale(100%) contrast(250%) brightness(110%)";
      }

      // Handle rotation matrix
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((item.rotation * Math.PI) / 180);
      ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);

      // Reset transforms
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.filter = "none";

      if (autoCrop) {
        return trimWhitespace(canvas);
      }

      return canvas;
    },
    [autoCrop, filter]
  );

  const downloadImages = useCallback(async () => {
    if (!items.length) return;
    setIsBusy(true);
    try {
      if (items.length === 1) {
        const canvas = await createCleanCanvas(items[0]);
        if (!canvas) return;
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((result) => resolve(result), "image/jpeg", 0.95);
        });
        if (!blob) throw new Error("Image creation failed");
        downloadBlob(blob, `${items[0].file.name.replace(/\.[^/.]+$/, "")}_scan.jpg`);
      } else {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();

        await Promise.all(
          items.map(async (item) => {
            const canvas = await createCleanCanvas(item);
            if (!canvas) return;
            const blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob((result) => resolve(result), "image/jpeg", 0.95);
            });
            if (!blob) throw new Error("Image creation failed");
            zip.file(`${item.file.name.replace(/\.[^/.]+$/, "")}_scan.jpg`, blob);
          })
        );

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, "scanned_documents.zip");
      }
      setSuccessMessage("Scanned image(s) downloaded successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not download scanned image(s). Please try again.");
    } finally {
      setIsBusy(false);
    }
  }, [createCleanCanvas, items]);

  const exportPdf = useCallback(async () => {
    if (!items.length) return;
    setIsBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      for (let index = 0; index < items.length; index++) {
        const canvas = await createCleanCanvas(items[index]);
        if (!canvas) continue;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.92); // Slightly compressed for PDF size
        
        if (index > 0) doc.addPage();

        const aspect = canvas.width / canvas.height;
        let renderWidth = maxWidth;
        let renderHeight = maxWidth / aspect;
        
        if (renderHeight > maxHeight) {
          renderHeight = maxHeight;
          renderWidth = maxHeight * aspect;
        }

        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;
        
        doc.addImage(dataUrl, "JPEG", x, y, renderWidth, renderHeight, undefined, "FAST");
      }

      doc.save(`scanned_documents_${Date.now()}.pdf`);
      setSuccessMessage("Print-ready PDF generated successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsBusy(false);
    }
  }, [createCleanCanvas, items, orientation, pageSize]);

  const printDocument = useCallback(async () => {
    if (!items.length) return;
    setIsBusy(true);
    try {
      const pageImages = await Promise.all(
        items.map(async (item) => {
          const canvas = await createCleanCanvas(item);
          if (!canvas) return null;
          return canvas.toDataURL("image/jpeg", 0.95);
        })
      );

      const validImages = pageImages.filter(Boolean) as string[];
      if (!validImages.length) return;

      const printWindow = window.open("", "_blank");
      if (!printWindow) throw new Error("Unable to open print window");

      printWindow.document.write(`
        <html>
          <head>
            <title>Scanned Document</title>
            <style>
              body { 
                margin: 0; 
                padding: 24px; 
                background: #525659; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
              }
              .page { 
                background: white; 
                margin-bottom: 24px; 
                padding: 24px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.3); 
                max-width: 1000px; 
                page-break-after: always; 
              }
              img { 
                width: 100%; 
                height: auto; 
                display: block; 
              }
              
              /* --- THIS REMOVES THE DATE, TITLE, AND URL --- */
              @page { 
                margin: 0; 
              }
              
              @media print {
                body { 
                  background: white; 
                  padding: 0; 
                }
                .page { 
                  box-shadow: none; 
                  margin: 0; 
                  padding: 0;
                  height: 100vh; /* Ensures it perfectly fills one page */
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                img {
                  max-width: 100%;
                  max-height: 100vh;
                  object-fit: contain; /* Prevents the image from stretching or cutting off */
                }
              }
            </style>
          </head>
          <body>
            ${validImages.map((src) => `<div class="page"><img src="${src}" alt="Scanned document" /></div>`).join("")}
            <script>
              window.onload = () => { 
                setTimeout(() => window.print(), 500); 
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      setSuccessMessage("Print preview opened.");
    } catch (error) {
      console.error(error);
      alert("Could not open print view.");
    } finally {
      setIsBusy(false);
    }
  }, [createCleanCanvas, items]);

  const selectedFileName = useMemo(() => {
    if (!items.length) return "No documents selected yet";
    if (items.length === 1) return items[0].file.name;
    return `${items.length} documents selected`;
  }, [items]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.95fr]">
          <div className="space-y-7">
            
            {/* Header Area */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                    <ScanLine className="h-4 w-4" /> Document Scanner
                  </p>
                  <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Scan, clean and export instantly
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Upload photos of papers, receipts, or forms. Apply filters, auto-crop, and export clean files as JPGs or a print-ready PDF.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900 px-5 py-4 text-slate-100 shadow-lg shadow-slate-900/10 min-w-[140px] text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">Documents</p>
                  <p className="mt-2 text-4xl font-bold">{items.length}</p>
                </div>
              </div>
            </div>

            {/* Main Controls */}
            <div className="grid gap-6 xl:grid-cols-[0.95fr_0.85fr]">
              <Card className="overflow-hidden border-slate-200 shadow-sm">
                <div className="bg-slate-900 px-6 py-4">
                  <CardTitle className="text-white text-lg">1. Upload & Setup</CardTitle>
                </div>
                <CardContent className="space-y-6 p-6 bg-white">
                  
                  {/* Dropzone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                      isDragging 
                        ? "border-indigo-500 bg-indigo-50" 
                        : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-50/50"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={(event) => handleFileSelect(event.target.files)}
                      title="Upload images"
                    />
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm shadow-slate-200 mb-4">
                      <ImageIcon className={`h-8 w-8 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">Drag & drop images</p>
                    <p className="mt-1 text-sm text-slate-500">Supports JPEG, PNG, WEBP</p>
                    
                    {items.length > 0 && (
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {selectedFileName}
                      </div>
                    )}
                  </div>

                  {/* Settings Grid */}
                  <div className="space-y-4">
                    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-sm font-medium text-slate-700 mb-2">Scanner Filter</span>
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={filter}
                        onChange={(event) => setFilter(event.target.value as ScanFilter)}
                      >
                        <option value="grayscale">Grayscale (Standard Scan)</option>
                        <option value="bw">Black & White (High Contrast)</option>
                        <option value="original">Original Color</option>
                      </select>
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <span className="block text-sm font-medium text-slate-700 mb-2">Page size</span>
                        <select
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
                          value={pageSize}
                          onChange={(event) => setPageSize(event.target.value as "a4" | "letter")}
                        >
                          {pageSizes.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>

                      <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <span className="block text-sm font-medium text-slate-700 mb-2">Orientation</span>
                        <select
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
                          value={orientation}
                          onChange={(event) => setOrientation(event.target.value as "portrait" | "landscape")}
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={autoCrop}
                      onChange={(event) => setAutoCrop(event.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Auto-crop white borders</span>
                  </label>
                </CardContent>
              </Card>

              {/* Actions Area */}
              <Card className="overflow-hidden border-slate-200 shadow-sm flex flex-col">
                <div className="bg-slate-900 px-6 py-4">
                  <CardTitle className="text-white text-lg">2. Export</CardTitle>
                </div>
                <CardContent className="space-y-4 p-6 bg-white flex-1 flex flex-col justify-between">
                  <div className="grid gap-3">
                    <Button
                      onClick={exportPdf}
                      disabled={!items.length || isBusy}
                      className="w-full justify-center bg-indigo-600 text-white hover:bg-indigo-700 h-12 rounded-xl text-base"
                    >
                      {isBusy ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileText className="mr-2 h-5 w-5" />}
                      Export Print-Ready PDF
                    </Button>
                    <Button
                      onClick={downloadImages}
                      disabled={!items.length || isBusy}
                      className="w-full justify-center bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-xl text-base"
                    >
                      {isBusy ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                      Download JPG{items.length > 1 ? "s" : ""}
                    </Button>
                    <Button
                      onClick={printDocument}
                      disabled={!items.length || isBusy}
                      variant="outline"
                      className="w-full justify-center border-slate-200 bg-white text-slate-900 hover:bg-slate-50 h-12 rounded-xl text-base"
                    >
                      {isBusy ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Printer className="mr-2 h-5 w-5" />}
                      Open Print Preview
                    </Button>
                  </div>

                  <div className="space-y-4 mt-6">
                    {successMessage && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> {successMessage}
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      onClick={clearAll}
                      disabled={isBusy || !items.length}
                      className="w-full justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 h-12 rounded-xl"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Clear all documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: Previews */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-slate-200 shadow-sm h-full flex flex-col">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <CardTitle className="text-white text-lg">Scan Preview</CardTitle>
                <span className="text-slate-400 text-sm">{items.length} page(s)</span>
              </div>
              
              <CardContent className="p-6 bg-white flex-1">
                {items.length ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    {items.map((item, index) => (
                      <div key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                        
                        <div className="relative p-2 aspect-[3/4] flex items-center justify-center bg-slate-100/50">
                          <img
                            src={item.previewUrl}
                            alt={`Page ${index + 1}`}
                            style={{ transform: `rotate(${item.rotation}deg)` }}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 shadow-sm"
                          />
                          
                          {/* Image Actions Overlay */}
                          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => rotateItem(item.id)}
                              className="rounded-full bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-indigo-50 hover:text-indigo-600 backdrop-blur-sm"
                              title="Rotate 90°"
                            >
                              <RotateCw className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="rounded-full bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-600 backdrop-blur-sm"
                              title="Remove page"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-slate-200 bg-white px-3 py-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500 truncate pr-2">
                            Page {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                    <ScanLine className="mb-4 h-12 w-12 text-slate-300" />
                    <p className="text-lg font-medium text-slate-900">No previews yet</p>
                    <p className="mt-2 text-sm text-slate-500 max-w-[200px]">
                      Upload documents to see them visualized here before exporting.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}