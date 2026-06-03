"use client";

import React, { useState, DragEvent } from 'react';
import { 
  FileSpreadsheet, FileUp, ArrowLeft, LayoutTemplate, FileOutput,
  Settings, CheckCircle2, DownloadCloud, Loader2, X, Plus
} from 'lucide-react';
import Link from 'next/link';

type OrientationMode = 'landscape' | 'portrait';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function ExcelToPdfPro() {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [orientation, setOrientation] = useState<OrientationMode>('landscape');
  const [progress, setProgress] = useState({ current: 0, total: 100, status: '' });
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
      setError("Please upload a valid Excel spreadsheet (.xlsx, .xls, .csv).");
      return;
    }
    setError(null);
    setFile(file);
    setAppState('settings');
  };

  const resetApp = () => {
    setFile(null);
    setAppState('upload');
    setProgress({ current: 0, total: 100, status: '' });
    setError(null);
  };

  // --- Core Conversion Logic ---
  const startConversion = async () => {
    if (!file) return;
    setAppState('converting');
    setError(null);

    try {
      setProgress({ current: 10, total: 100, status: 'Loading spreadsheet engine...' });

      // Dynamically import libraries to bypass Next.js SSR evaluation issues
      const XLSX = await import('xlsx');
      const html2pdf = (await import('html2pdf.js')).default;

      setProgress({ current: 30, total: 100, status: 'Reading spreadsheet data...' });

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      setProgress({ current: 50, total: 100, status: 'Formatting tables for PDF...' });

      // Convert all sheets into styled HTML tables
      let combinedHtml = `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333;">`;
      
      workbook.SheetNames.forEach((sheetName, index) => {
        const sheet = workbook.Sheets[sheetName];
        const htmlTable = XLSX.utils.sheet_to_html(sheet);
        
        // Add page break between worksheets
        if (index > 0) {
          combinedHtml += `<div style="page-break-before: always;"></div>`;
        }
        
        // Add Sheet Title
        combinedHtml += `<h2 style="color: #107c41; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #107c41; padding-bottom: 4px;">${sheetName}</h2>`;
        
        // Inject the generated HTML table (we will style it via global CSS block)
        combinedHtml += htmlTable;
      });
      
      combinedHtml += `</div>`;

      // Inject Custom CSS to make the raw HTML tables look like professional Excel grids
      const styledHtml = `
        <style>
          table { border-collapse: collapse; width: 100%; margin-bottom: 30px; font-size: 10px; }
          th, td { border: 1px solid #d2d2d2; padding: 6px 8px; text-align: left; word-wrap: break-word; }
          th { background-color: #f3f6f3; font-weight: bold; color: #107c41; }
          tr:nth-child(even) { background-color: #fafafa; }
        </style>
        ${combinedHtml}
      `;

      // Create a hidden temporary container for html2pdf to read
      const hiddenElement = document.createElement('div');
      hiddenElement.innerHTML = styledHtml;

      setProgress({ current: 75, total: 100, status: 'Rendering final PDF document...' });

      const opt = {
        margin:       [15, 15, 15, 15] as [number, number, number, number],
        filename:     `${file.name.replace(/\.[^/.]+$/, "")}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, // Scale 2 for sharp text
        jsPDF:        { unit: 'mm', format: 'a4', orientation: orientation }
      };

      // Generate PDF
      await html2pdf().set(opt).from(hiddenElement).save();

      setProgress({ current: 100, total: 100, status: 'Complete!' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process spreadsheet. The file might be corrupted or password protected.");
      setAppState('settings');
    }
  };

  const percentComplete = progress.current;

  return (
    <div className="min-h-screen bg-[#f3f6f3] font-sans flex flex-col selection:bg-emerald-200">
      
      {/* Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-emerald-600 transition-colors font-bold text-lg">
          <FileSpreadsheet className="text-[#107c41]" size={28} />
          <span>ConvertHub<span className="text-[#107c41]">PRO</span></span>
        </Link>
        <Link href="/converter" className="text-gray-500 hover:text-gray-900 text-sm font-semibold flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        
        {/* ================= STATE 1: UPLOAD ================= */}
        {appState === 'upload' && (
          <div className="text-center w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#242e27] mb-4 tracking-tight">Excel to PDF</h1>
            <p className="text-[#556358] text-lg md:text-xl mb-10">
              Make Excel spreadsheets easy to read by converting them to PDF documents.
            </p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-3xl p-16 md:p-24 transition-all duration-300 flex flex-col items-center justify-center bg-white ${
                isDragging ? 'border-[#107c41] bg-emerald-50/40 scale-[1.02] shadow-2xl' : 'border-gray-200 hover:border-emerald-300 hover:shadow-xl'
              }`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleFileSelect} 
                title="Upload Excel Spreadsheet"
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#107c41] text-white' : 'bg-emerald-50 text-[#107c41]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#107c41] hover:bg-[#0b592e] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select Excel file
              </button>
              <p className="text-gray-400 font-medium mt-6">or drop spreadsheets here</p>

              {error && (
                <div className="absolute bottom-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm z-20">
                  {error}
                </div>
              )}
            </div>
            
            <p className="mt-8 text-sm text-gray-400 max-w-xl mx-auto">
              * Client-side rendering: Your data remains secure on your device. All tabs will be exported as separate pages in the PDF.
            </p>
          </div>
        )}

        {/* ================= STATE 2: SETTINGS / PREVIEW ================= */}
        {appState === 'settings' && file && (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            
            {/* Left: File Preview */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative group">
              <button onClick={resetApp} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-colors z-10">
                <X size={20} />
              </button>
              
              <div className="w-40 h-52 bg-white shadow-md border border-gray-200 flex flex-col relative group-hover:-translate-y-2 transition-transform duration-300">
                <div className="flex-1 flex items-center justify-center bg-emerald-50/40 border-b border-gray-100 text-[#107c41] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-red-50 opacity-40"></div>
                  <FileSpreadsheet size={48} strokeWidth={1.5} className="z-10 text-[#107c41]" />
                </div>
                <div className="h-12 bg-white p-2 text-center overflow-hidden">
                  <p className="text-[10px] font-bold text-gray-800 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              <button className="mt-8 flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold text-sm transition-colors relative z-10">
                <Plus size={16} /> Add more files (Coming soon)
              </button>
            </div>

            {/* Right: Settings Sidebar */}
            <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center gap-3">
                <Settings className="text-gray-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Excel to PDF options</h2>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate size={16} /> Page Orientation
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${orientation === 'portrait' ? 'border-[#107c41] bg-emerald-50/40 text-[#107c41]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={orientation === 'portrait'} onChange={() => setOrientation('portrait')} />
                      <span className="font-bold block">Portrait</span>
                      <span className="text-xs opacity-70">Good for narrow tables</span>
                    </label>

                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${orientation === 'landscape' ? 'border-[#107c41] bg-emerald-50/40 text-[#107c41]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={orientation === 'landscape'} onChange={() => setOrientation('landscape')} />
                      <span className="font-bold block">Landscape</span>
                      <span className="text-xs opacity-70">Best for wide sheets</span>
                    </label>
                  </div>
                </div>

                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-[#107c41] flex items-center gap-2 text-sm mb-1">
                    <FileOutput size={16} /> Auto-Formatting
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Tables are automatically rendered with borders and alternating row colors for perfect readability. Empty cells are preserved.
                  </p>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button 
                  onClick={startConversion}
                  className="w-full bg-[#107c41] hover:bg-[#0b592e] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  Convert to PDF <ArrowLeft className="rotate-180" size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STATE 3: CONVERTING ================= */}
        {appState === 'converting' && (
          <div className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
            <Loader2 className="w-16 h-16 text-[#107c41] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Generating PDF Document</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#107c41] h-3 rounded-full transition-all duration-300 ease-out relative" 
                style={{ width: `${percentComplete}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-right text-sm font-bold text-gray-400 mt-2">{percentComplete}%</p>
          </div>
        )}

        {/* ================= STATE 4: SUCCESS ================= */}
        {appState === 'success' && (
          <div className="w-full max-w-2xl text-center animate-in slide-in-from-bottom-8 duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-500 rounded-full mb-6">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-[#242e27] mb-4">Task Complete!</h2>
            <p className="text-[#556358] text-xl mb-10">Your Excel spreadsheets have been compiled into a PDF document.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={resetApp}
                className="w-full sm:w-auto px-8 py-4 bg-[#242e27] hover:bg-black text-white rounded-xl font-bold text-lg transition-all"
              >
                Convert another file
              </button>
              
              <button 
                onClick={() => alert("Your download should have started automatically. Check your downloads folder!")}
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                <DownloadCloud size={20} /> Download again
              </button>
            </div>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}