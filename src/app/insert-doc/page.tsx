"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fileToImageBitmap } from "@/utils/image";
import { jsPDF } from "jspdf";

const SLOT = { w: 35, h: 45 }; // Passport photo slot in mm

export default function InsertDocPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [multiple, setMultiple] = useState(false);

  // Clean up object URL when file or component changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const makePDF = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Convert image to base64 for jsPDF
      const dataURL = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(file);
      });

      // Determine image format from Data URL (e.g. data:image/png;base64,...)
      const formatMatch = dataURL.match(/^data:image\/(jpeg|png|jpg);base64,/);
      // jsPDF supports only 'JPEG' or 'PNG' here; uppercase required
      const imgFormat = formatMatch
        ? formatMatch[1].toUpperCase() === "JPG"
          ? "JPEG"
          : formatMatch[1].toUpperCase()
        : "JPEG"; // default JPEG

      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      // Title
      doc.setFontSize(14);
      doc.text("Document with Passport Photo", 20, 20);

      if (!multiple) {
        // Single slot layout
        const x = 20;
        const y = 30;

        // Slot border
        doc.setDrawColor(180);
        doc.rect(x, y, SLOT.w, SLOT.h);

        // Scale and position image
        const img = await fileToImageBitmap(file);
        const iw = img.width,
          ih = img.height,
          ir = iw / ih;
        const sr = SLOT.w / SLOT.h;
        let w = SLOT.w,
          h = SLOT.h,
          ox = 0,
          oy = 0;

        if (ir > sr) {
          // image wider -> match height
          h = SLOT.h;
          w = h * ir;
          ox = x + (SLOT.w - w) / 2;
          oy = y;
        } else {
          // image taller -> match width
          w = SLOT.w;
          h = w / ir;
          ox = x;
          oy = y + (SLOT.h - h) / 2;
        }

        doc.addImage(dataURL, imgFormat, ox, oy, w, h, undefined, "FAST");

        // Info fields
        doc.setFontSize(10);
        doc.text("Name: ____________________", x, y + SLOT.h + 12);
        doc.text("DOB:  ____________________", x, y + SLOT.h + 20);
        doc.text("ID:   ____________________", x, y + SLOT.h + 28);
      } else {
        // Multiple photo grid layout
        const cols = 3,
          rows = 4,
          gap = 8;
        const startX = 20;
        const startY = 30;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const gx = startX + c * (SLOT.w + gap);
            const gy = startY + r * (SLOT.h + gap);
            doc.addImage(dataURL, imgFormat, gx, gy, SLOT.w, SLOT.h, undefined, "FAST");
          }
        }
      }

      doc.save("photo_document.pdf");
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800">Insert Photo into A4 PDF</h1>
      <p className="mt-2 text-sm text-gray-500">
        Generate an A4 PDF with a passport photo slot (35×45 mm) or multiple copies for printing.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {/* Upload Section */}
        <label className="block text-sm font-medium text-gray-700" htmlFor="upload-photo">
          Upload Photo
        </label>
        <input
          id="upload-photo"
          type="file"
          accept="image/*"
          className="mt-2 w-full cursor-pointer rounded border border-gray-300 p-2"
          onChange={handleInput}
        />

        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Preview */}
          <div className="rounded border border-gray-200 p-3 bg-gray-50">
            <div className="text-xs text-gray-500 mb-2">Preview</div>
            {preview ? (
              <Image
                src={preview}
                alt="Uploaded preview"
                className="rounded"
                style={{ objectFit: "contain" }}
                width={400} // approximate container width
                height={224} // approximate height to keep ratio with h-56 (224px)
                unoptimized={true} // blob URLs can't be optimized by Next.js
              />
            ) : (
              <div className="flex h-56 items-center justify-center text-xs text-gray-400">
                No image selected
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="flex flex-col justify-between">
            <div className="text-sm text-gray-700">
              <p>A4 Size: 210 × 297 mm</p>
              <p>Photo Slot: 35 × 45 mm</p>

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="multiple"
                  checked={multiple}
                  onChange={(e) => setMultiple(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="multiple" className="text-sm text-gray-700">
                  Generate multiple copies on one page
                </label>
              </div>
            </div>

            <button
              disabled={!file || loading}
              onClick={makePDF}
              className="mt-6 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {loading ? "Generating PDF..." : "Generate & Download PDF"}
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Tip: For photo studios or official documents, use high-resolution images for best print quality.
        </p>
      </div>
    </div>
  );
}
