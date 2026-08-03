'use client';

import { useState } from 'react';

export default function AddPageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState('bottom-right');
  const [fontSize, setFontSize] = useState(12);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      // 1. Load the uploaded PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // 2. Embed a standard font (You can also load custom .ttf files for strict typography control)
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      // 3. Iterate through each page and add the number
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const text = `${index + 1}`;
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        
        let x = 0;
        let y = 0;
        const margin = 30;

        // Calculate exact dimensions based on selected position
        switch (position) {
          case 'bottom-right':
            x = width - textWidth - margin;
            y = margin;
            break;
          case 'bottom-center':
            x = (width / 2) - (textWidth / 2);
            y = margin;
            break;
          case 'top-right':
            x = width - textWidth - margin;
            y = height - margin - fontSize;
            break;
          case 'top-center':
            x = (width / 2) - (textWidth / 2);
            y = height - margin - fontSize;
            break;
        }

        // Draw the text onto the page
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0), // Black text
        });
      });

      // 4. Save and trigger download
      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(pdfBytes);
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `numbered_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Failed to process the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Add Page Numbers</h1>
      
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload PDF</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="block w-full text-sm border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Layout & Typography Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <select 
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="top-right">Top Right</option>
              <option value="top-center">Top Center</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Typography Size</label>
            <input 
              type="number" 
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2"
              min="8"
              max="72"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={processPdf}
          disabled={!file || isProcessing}
          className="w-full bg-black text-white py-3 rounded-md font-medium disabled:bg-gray-400 transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Add Page Numbers'}
        </button>
      </div>
    </div>
  );
}
