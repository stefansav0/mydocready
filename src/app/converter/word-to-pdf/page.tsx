"use client";

import React, { useState, useRef, DragEvent } from 'react';
import { 
  FileText, FileUp, ArrowLeft, Settings, CheckCircle2, DownloadCloud, Loader2, X, Scaling, LayoutTemplate
} from 'lucide-react';
import Link from 'next/link';
import * as mammoth from 'mammoth';

type PageSize = 'a4' | 'letter';
type PageLayout = 'paginated' | 'single';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

interface ProgressState {
  current: number;
  total: number;
  status: string;
}

export default function WordToPdfPro() {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [pageLayout, setPageLayout] = useState<PageLayout>('paginated');
  const [progress, setProgress] = useState<ProgressState>({ current: 0, total: 100, status: '' });
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const hiddenContentRef = useRef<HTMLDivElement>(null);

  // Drag & Drop Handlers
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
    if (droppedFile) validateAndSetFile(droppedFile);
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
    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
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

  // Core conversion
  const startConversion = async () => {
    if (!file || !hiddenContentRef.current) return;
    setAppState('converting');
    setError(null);
    try {
      setProgress({ current: 20, total: 100, status: 'Reading Word document...' });
      const arrayBuffer = await file.arrayBuffer();

      // Convert Word to HTML
      const result = await mammoth.convertToHtml({ 
        arrayBuffer
      });
      const htmlContent = result.value;

      if (!htmlContent) throw new Error("Could not extract content from document.");

      // Inject HTML + CSS to match Word style
      hiddenContentRef.current.innerHTML = `
        <style>
          body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 11pt;
            line-height: 1.3;
            color: #000;
            margin: 0;
            padding: 0;
          }
          h1 {
            font-size: 16pt;
            text-align: center;
            font-weight: bold;
            margin-top: 0;
            margin-bottom: 12pt;
            text-transform: uppercase;
          }
          h2, h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 16pt;
            margin-bottom: 6pt;
            border: none;
          }
          p {
            margin-bottom: 6pt;
            text-align: left;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6pt;
            margin-bottom: 12pt;
          }
          th, td {
            border: 1px solid #000;
            padding: 4pt 6pt;
            font-size: 10.5pt;
            vertical-align: top;
            text-align: left;
          }
          th {
            font-weight: bold;
            background-color: transparent;
          }
          ul, ol {
            margin-top: 2pt;
            margin-bottom: 8pt;
            padding-left: 20pt;
          }
          li {
            margin-bottom: 2pt;
          }
          strong, b {
            font-weight: bold;
          }
          em, i {
            font-style: italic;
          }
        </style>
        <div>${htmlContent}</div>
      `;

      setProgress({ current: 50, total: 100, status: 'Formatting pages for PDF...' });

      // Generate PDF
      const html2pdf = (await import('html2pdf.js')).default;
      const formatDimensions: Record<PageSize, [number, number]> = {
        'a4': [210, 297],
        'letter': [215.9, 279.4]
      };
      let pdfFormat: [number, number] = formatDimensions[pageSize];

      if (pageLayout === 'single') {
        const contentHeightPx = hiddenContentRef.current.scrollHeight;
        const heightMm = (contentHeightPx * 0.264583) + 40; // add padding
        const widthMm = pageSize === 'a4' ? 210 : 215.9;
        const minHeightMm = pageSize === 'a4' ? 297 : 279.4;
        pdfFormat = [widthMm, Math.max(heightMm, minHeightMm)];
      }

      const options = {
        margin: [20, 20, 20, 20] as [number, number, number, number],
        filename: `${file.name.replace(/\.[^/.]+$/, "")}.pdf`,
        image: { type: 'jpeg' as const, quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: {
          unit: 'mm',
          format: pdfFormat,
          orientation: 'portrait' as const
        }
      };

      setProgress({ current: 80, total: 100, status: 'Generating PDF...' });
      await html2pdf().set(options).from(hiddenContentRef.current).save();

      setProgress({ current: 100, total: 100, status: 'Completed' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process document.');
      setAppState('settings');
    }
  };

  const percentComplete = progress.current;

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans flex flex-col selection:bg-blue-200">
      
      {/* Hidden container for PDF conversion */}
      <div className="hidden" aria-hidden="true">
        <div ref={hiddenContentRef}></div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors font-bold text-lg">
          <FileText size={28} className="text-[#1b64da]" />
          <span>ConvertHub<span className="text-[#1b64da]">PRO</span></span>
        </Link>
        <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm font-semibold flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        {appState === 'upload' && (
          <div className="text-center w-full max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-[#2a2a35] mb-4 tracking-tight">Word to PDF</h1>
            <p className="text-[#64748b] text-lg md:text-xl mb-10">
              Make DOC and DOCX files easy to read by converting them to PDF.
            </p>
            {/* Drag & Drop */}
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
          </div>
        )}

        {appState === 'settings' && file && (
          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* File Info */}
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
            </div>

            {/* Conversion Options */}
            <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center gap-3">
                <Settings className="text-gray-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Conversion Options</h2>
              </div>
              <div className="p-6 flex-1 space-y-8">
                {/* Page Size */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate size={16} /> Base Page Size
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPageSize('a4')}
                      className={`block border-2 rounded-xl p-3 text-center transition-all ${pageSize === 'a4' ? 'border-[#1b64da] bg-blue-50/50 text-[#1b64da]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      <span className="font-bold block">A4</span>
                      <span className="text-xs opacity-70">210 × 297 mm</span>
                    </button>
                    <button
                      onClick={() => setPageSize('letter')}
                      className={`block border-2 rounded-xl p-3 text-center transition-all ${pageSize === 'letter' ? 'border-[#1b64da] bg-blue-50/50 text-[#1b64da]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      <span className="font-bold block">US Letter</span>
                      <span className="text-xs opacity-70">215.9 × 279.4 mm</span>
                    </button>
                  </div>
                </div>
                {/* Page Layout */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Scaling size={16} /> Page Layout
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPageLayout('paginated')}
                      className={`block border-2 rounded-xl p-3 text-center transition-all ${pageLayout === 'paginated' ? 'border-[#1b64da] bg-blue-50/50 text-[#1b64da]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      <span className="font-bold block text-sm">Standard</span>
                      <span className="text-xs opacity-70">Split into pages</span>
                    </button>
                    <button
                      onClick={() => setPageLayout('single')}
                      className={`block border-2 rounded-xl p-3 text-center transition-all ${pageLayout === 'single' ? 'border-[#1b64da] bg-blue-50/50 text-[#1b64da]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      <span className="font-bold block text-sm">Continuous</span>
                      <span className="text-xs opacity-70">One long page</span>
                    </button>
                  </div>
                </div>
                {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
              </div>
              {/* Convert Button */}
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

        {appState === 'converting' && (
          <div className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center">
            <Loader2 className="w-16 h-16 text-[#1b64da] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Converting Document</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#1b64da] h-3 rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-right text-sm font-bold text-gray-400 mt-2">{percentComplete}%</p>
          </div>
        )}

        {appState === 'success' && (
          <div className="w-full max-w-2xl text-center">
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

      {/* Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}