"use client";

import React, { useState, useRef, DragEvent } from 'react';
import { 
  FileText, FileUp, ArrowLeft, FileOutput, LayoutTemplate, 
  Settings, CheckCircle2, DownloadCloud, Loader2, X, Plus
} from 'lucide-react';
import Link from 'next/link';

// We import mammoth statically as it works fine in Node/Browser
import * as mammoth from 'mammoth';

type PageSize = 'a4' | 'letter';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function WordToPdfPro() {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [progress, setProgress] = useState({ current: 0, total: 100, status: '' });
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const hiddenContentRef = useRef<HTMLDivElement>(null);

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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) {
      setError("Please upload a valid Word document (.docx or .doc).");
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
    if (hiddenContentRef.current) hiddenContentRef.current.innerHTML = '';
  };

  // --- Core Conversion Logic ---
  const startConversion = async () => {
    if (!file || !hiddenContentRef.current) return;
    setAppState('converting');
    setError(null);
    
    try {
      // STEP 1: Parse Word to HTML
      setProgress({ current: 20, total: 100, status: 'Reading Word document...' });
      const arrayBuffer = await file.arrayBuffer();
      
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value; 
      
      if (!htmlContent) throw new Error("Could not extract content from this document.");

      // STEP 2: Inject HTML with CSS Styling for PDF Render
      // This CSS fixes the missing table borders, list formatting, and bolding seen in raw extractions
      hiddenContentRef.current.innerHTML = `
        <style>

        .word-render-wrapper {
  page-break-after: auto;
}

.word-render-wrapper table,
.word-render-wrapper img,
.word-render-wrapper p,
.word-render-wrapper h1,
.word-render-wrapper h2,
.word-render-wrapper h3 {
  page-break-inside: avoid;
}

.page-break {
  page-break-before: always;
}
          .word-render-wrapper {
            font-family: 'Arial', sans-serif;
            line-height: 1.5;
            color: #000;
            font-size: 11pt;
          }
          .word-render-wrapper h1, .word-render-wrapper h2, .word-render-wrapper h3 {
            font-weight: bold;
            margin-top: 14pt;
            margin-bottom: 8pt;
          }
          .word-render-wrapper h1 { font-size: 18pt; text-align: center; }
          .word-render-wrapper h2 { font-size: 14pt; }
          .word-render-wrapper p {
            margin-bottom: 10pt;
          }
          /* Fix for Tables */
          .word-render-wrapper table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10pt;
            margin-bottom: 14pt;
          }
          .word-render-wrapper th, .word-render-wrapper td {
            border: 1px solid #000;
            padding: 6pt;
            text-align: left;
            vertical-align: top;
          }
          /* Fix for Lists */
          .word-render-wrapper ul, .word-render-wrapper ol {
            margin-top: 0;
            margin-bottom: 10pt;
            padding-left: 24pt;
          }
          .word-render-wrapper li {
            margin-bottom: 4pt;
          }
          /* Typography Resets */
          .word-render-wrapper strong, .word-render-wrapper b {
            font-weight: bold !important;
          }
          .word-render-wrapper em, .word-render-wrapper i {
            font-style: italic !important;
          }
        </style>
        <div class="word-render-wrapper">
          ${htmlContent}
        </div>
      `;

      setProgress({ current: 50, total: 100, status: 'Formatting pages for PDF...' });

      // STEP 3: Convert HTML to PDF
      const html2pdf = (await import('html2pdf.js')).default;
      
      const formatMap = {
        'a4': 'a4',
        'letter': 'letter'
      };

      const opt = {
        margin:       [15, 15, 15, 15] as [number, number, number, number], 
        filename:     `${file.name.replace(/\.[^/.]+$/, "")}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
  scale: 4,
  useCORS: true,
  logging: false,
  letterRendering: true
},
        jsPDF:        { unit: 'mm' as const, format: formatMap[pageSize] as 'a4' | 'letter', orientation: 'portrait' as 'portrait' }
      };

      setProgress({ current: 80, total: 100, status: 'Generating final PDF...' });

      // Generate and save
      await html2pdf().set(opt).from(hiddenContentRef.current).save();

      setProgress({ current: 100, total: 100, status: 'Complete!' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process document. It might be corrupted or heavily protected.");
      setAppState('settings');
    }
  };

  const percentComplete = progress.current;

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex flex-col selection:bg-blue-200">
      
      {/* Hidden container to hold parsed HTML for PDF generation */}
      <div className="hidden">
        <div ref={hiddenContentRef} className="pdf-render-container"></div>
      </div>

      {/* Navbar (Minimal) */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors font-bold text-lg">
          <FileText className="text-[#1b64da]" size={28} />
          <span>ConvertHub<span className="text-[#1b64da]">PRO</span></span>
        </Link>
        <Link href="/converter" className="text-gray-500 hover:text-gray-900 text-sm font-semibold flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        
        {/* ================= STATE 1: UPLOAD ================= */}
        {appState === 'upload' && (
          <div className="text-center w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#2a2a35] mb-4 tracking-tight">Word to PDF</h1>
            <p className="text-[#64748b] text-lg md:text-xl mb-10">
              Make DOC and DOCX files easy to read by converting them to PDF.
            </p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-3xl p-16 md:p-24 transition-all duration-300 flex flex-col items-center justify-center bg-white ${
                isDragging ? 'border-[#1b64da] bg-blue-50/50 scale-[1.02] shadow-2xl' : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
              }`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".docx,.doc" 
                onChange={handleFileSelect} 
                title="Upload Word Document"
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#1b64da] text-white' : 'bg-blue-100 text-[#1b64da]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#1b64da] hover:bg-[#1554bb] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select Word file
              </button>
              <p className="text-gray-400 font-medium mt-6">or drop Word documents here</p>

              {error && (
                <div className="absolute bottom-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm z-20">
                  {error}
                </div>
              )}
            </div>
            
            <p className="mt-8 text-sm text-gray-400">
              * Note: Client-side conversion is optimized for text-heavy documents. Complex layouts may vary.
            </p>
          </div>
        )}


        {/* ================= STATE 2: SETTINGS / PREVIEW ================= */}
        {appState === 'settings' && file && (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            
            {/* Left: File Preview */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative group">
              <button onClick={resetApp} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors z-10">
                <X size={20} />
              </button>
              
              <div className="w-40 h-52 bg-white shadow-md border border-gray-200 flex flex-col relative group-hover:-translate-y-2 transition-transform duration-300">
                <div className="flex-1 flex items-center justify-center bg-blue-50 border-b border-gray-100 text-[#1b64da]">
                  <FileText size={48} strokeWidth={1.5} />
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
                <h2 className="text-xl font-bold text-gray-800">Word to PDF options</h2>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate size={16} /> Page Size
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${pageSize === 'a4' ? 'border-[#1b64da] bg-blue-50/50 text-[#1b64da]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={pageSize === 'a4'} onChange={() => setPageSize('a4')} />
                      <span className="font-bold block">A4</span>
                      <span className="text-xs opacity-70">210 × 297 mm</span>
                    </label>

                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${pageSize === 'letter' ? 'border-[#1b64da] bg-blue-50/50 text-[#1b64da]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={pageSize === 'letter'} onChange={() => setPageSize('letter')} />
                      <span className="font-bold block">US Letter</span>
                      <span className="text-xs opacity-70">215.9 × 279.4 mm</span>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 flex items-center gap-2 text-sm mb-1">
                    <FileOutput size={16} /> Smart Formatting
                  </h4>
                  <p className="text-sm text-blue-700/80 leading-relaxed">
                    Text, tables, and lists will be preserved. Complex floating elements may be simplified for standard PDF readability.
                  </p>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button 
                  onClick={startConversion}
                  className="w-full bg-[#1b64da] hover:bg-[#1554bb] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
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
            <Loader2 className="w-16 h-16 text-[#1b64da] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Converting Document</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#1b64da] h-3 rounded-full transition-all duration-300 ease-out relative" 
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
            <h2 className="text-4xl font-black text-[#2a2a35] mb-4">Task Complete!</h2>
            <p className="text-[#64748b] text-xl mb-10">Your Word document has been converted to a PDF.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={resetApp}
                className="w-full sm:w-auto px-8 py-4 bg-[#2a2a35] hover:bg-black text-white rounded-xl font-bold text-lg transition-all"
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