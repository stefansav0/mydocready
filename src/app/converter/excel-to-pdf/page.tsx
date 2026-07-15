"use client";

import React, { useState, DragEvent } from 'react';
import { 
  FileText, FileUp, ArrowLeft, Settings, 
  CheckCircle2, DownloadCloud, Loader2, X, Maximize,
  Crop
} from 'lucide-react';
import Link from 'next/link';
import ExcelToPdfContent from "@/components/ExcelToPdfContent";

type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function ExcelToPdfPro() {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [progress, setProgress] = useState({ current: 0, status: '' });
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError("Please upload a valid Excel or CSV document.");
      return;
    }
    setError(null);
    setFile(selectedFile);
    setAppState('settings');
  };

  const resetApp = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null);
    setAppState('upload');
    setProgress({ current: 0, status: '' });
    setError(null);
    setPdfUrl(null);
  };

  // --- Core Smart Conversion Logic ---
  const startConversion = async () => {
    if (!file) return;
    setAppState('converting');
    setError(null);

    try {
      setProgress({ current: 20, status: 'Reading spreadsheet matrix...' });

      // Dynamically import libraries to bypass Next.js SSR evaluation issues
      const XLSX = await import('xlsx');
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      // 1. Read the Excel File Buffer
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the sheet into a massive 2D array (including all empty rows Excel thinks exist)
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" }) as any[][];

      setProgress({ current: 40, status: 'Executing Smart Bounding Box crop...' });

      // 2. THE FIX: The Smart Bounding Box Algorithm
      // This scans every single cell to find the exact perimeter of actual text.
      let maxRow = -1;
      let maxCol = -1;

      for (let r = 0; r < rawData.length; r++) {
        const row = rawData[r];
        let rowHasData = false;
        
        for (let c = 0; c < row.length; c++) {
          const cell = row[c];
          // If the cell contains actual characters (not just spaces)
          if (cell !== null && cell !== undefined && String(cell).trim() !== "") {
            rowHasData = true;
            if (c > maxCol) maxCol = c; // Update furthest column
          }
        }
        if (rowHasData) {
          maxRow = r; // Update furthest row
        }
      }

      if (maxRow === -1) {
        throw new Error("The spreadsheet appears to be completely empty.");
      }

      setProgress({ current: 60, status: 'Compiling cleaned data structure...' });

      // 3. Crop the matrix exactly to the bounding box
      const cleanBody = [];
      for (let r = 0; r <= maxRow; r++) {
        const newRow = [];
        for (let c = 0; c <= maxCol; c++) {
          // Push the value, or an empty string if undefined.
          newRow.push(String(rawData[r]?.[c] || "").trim());
        }
        cleanBody.push(newRow);
      }

      setProgress({ current: 80, status: 'Drawing perfectly scaled PDF...' });

      // 4. Initialize PDF Canvas
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'pt',
        format: 'a4'
      });

      // 5. Draw the Table
      autoTable(doc, {
        body: cleanBody,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 5,
          textColor: [40, 40, 40],
          lineColor: [200, 200, 200],
          lineWidth: 0.5,
          valign: 'middle'
        },
        // Auto-scaling: Forces the table width to shrink to fit the page horizontally perfectly
        tableWidth: 'auto', 
        margin: { top: 40, right: 30, bottom: 40, left: 30 },
        // Visual polish: remove top margin for pure empty cells in the header rows
        didParseCell: function(data) {
          // If it's the very first row and it looks like a large title, bold it
          if (data.row.index === 0 && data.cell.text[0] !== "") {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [245, 245, 245];
          }
        }
      });

      setProgress({ current: 95, status: 'Finalizing file...' });

      // 6. Generate Output
      const pdfBlob = doc.output('blob');
      const generatedUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(generatedUrl);

      // Trigger Download automatically
      const link = document.createElement('a');
      link.href = generatedUrl;
      link.download = `${file.name.replace(/\.[^/.]+$/, "")}_Cleaned.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setProgress({ current: 100, status: 'Complete!' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to convert the document.");
      setAppState('settings');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f3] font-sans flex flex-col selection:bg-emerald-200">
      
      

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto">
        
        {/* ================= STATE 1: UPLOAD ================= */}
        {appState === 'upload' && (
          <div className="text-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#242e27] mb-4 tracking-tight">Excel to PDF</h1>
            <p className="text-[#556358] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Convert spreadsheets to perfect PDFs. Automatically crops phantom rows, scales wide tables, and removes blank pages.
            </p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-3xl p-16 md:p-24 transition-all duration-300 flex flex-col items-center justify-center bg-white mx-auto max-w-3xl ${
                isDragging ? 'border-[#107c41] bg-emerald-50/40 scale-[1.02] shadow-2xl' : 'border-gray-200 hover:border-emerald-300 hover:shadow-xl'
              }`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileSelect} 
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#107c41] text-white' : 'bg-emerald-50 text-[#107c41]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#107c41] hover:bg-[#0b592e] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select Excel file
              </button>
            </div>
          </div>
        )}

        {/* ================= STATE 2: SETTINGS ================= */}
        {appState === 'settings' && file && (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in duration-300">
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="text-gray-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Formatting Options</h2>
              </div>
              <button onClick={resetApp} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              
              {/* File Info */}
              <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Crop className="text-[#107c41]" size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">Smart Crop enabled. Empty grids will be deleted.</p>
                </div>
              </div>

              {/* Orientation Options */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Maximize size={16} /> Document Layout
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setOrientation('portrait')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${orientation === 'portrait' ? 'border-[#107c41] bg-emerald-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="w-12 h-16 border-2 border-gray-300 mx-auto mb-3 rounded-sm flex items-center justify-center">
                      <div className="w-8 h-1 bg-gray-200 mb-1"></div>
                    </div>
                    <p className="font-bold text-center text-gray-800">Portrait</p>
                    <p className="text-xs text-center text-gray-500 mt-1">Best for tall, narrow tables</p>
                  </button>

                  <button 
                    onClick={() => setOrientation('landscape')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${orientation === 'landscape' ? 'border-[#107c41] bg-emerald-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="w-16 h-12 border-2 border-gray-300 mx-auto mb-3 rounded-sm flex flex-col items-center justify-center gap-1">
                      <div className="w-12 h-1 bg-gray-200"></div>
                      <div className="w-12 h-1 bg-gray-200"></div>
                    </div>
                    <p className="font-bold text-center text-gray-800">Landscape</p>
                    <p className="text-xs text-center text-gray-500 mt-1">Best for multi-column claims</p>
                  </button>
                </div>
              </div>

              {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={startConversion}
                className="w-full bg-[#107c41] hover:bg-[#0b592e] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
              >
                Generate Clean PDF <ArrowLeft className="rotate-180" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STATE 3: CONVERTING ================= */}
        {appState === 'converting' && (
          <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
            <Loader2 className="w-16 h-16 text-[#107c41] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Optimizing Data</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#107c41] h-3 rounded-full transition-all duration-300 ease-out relative" 
                style={{ width: `${progress.current}%` }}
              />
            </div>
          </div>
        )}

        {/* ================= STATE 4: SUCCESS ================= */}
        {appState === 'success' && (
          <div className="w-full max-w-2xl text-center animate-in slide-in-from-bottom-8 duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-500 rounded-full mb-6">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-[#242e27] mb-4">Task Complete!</h2>
            <p className="text-[#556358] text-xl mb-10">Empty pages deleted. Data successfully cropped and scaled.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={resetApp}
                className="w-full sm:w-auto px-8 py-4 bg-[#242e27] hover:bg-black text-white rounded-xl font-bold text-lg transition-all"
              >
                Convert another file
              </button>
              
              {pdfUrl && (
                <a 
                  href={pdfUrl}
                  download={`${file?.name.replace(/\.[^/.]+$/, "")}_Cleaned.pdf`}
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  <DownloadCloud size={20} /> Download PDF
                </a>
              )}
            </div>
          </div>
        )}
        <ExcelToPdfContent />

      </main>
    </div>
  );
}