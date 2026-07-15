"use client";

import React, { useState, DragEvent } from 'react';
import { 
  FileText, FileUp, ArrowLeft, FileType, AlignLeft, 
  Settings, CheckCircle2, DownloadCloud, Loader2, X, Plus
} from 'lucide-react';
import Link from 'next/link';
import PdfToWordContent from "@/components/PdfToWordContent";

// Import docx and file-saver safely (they handle SSR better or are called client-side)
import { Document, Packer, Paragraph, TextRun, PageBreak } from 'docx';
import { saveAs } from 'file-saver';

type LayoutMode = 'continuous' | 'page-breaks';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function PdfToWordPro() {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('page-breaks');
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
    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF document.");
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
      setProgress({ current: 5, total: 100, status: 'Initializing conversion engine...' });

      // FIX: Dynamically import pdfjs-dist ONLY on the client side
      const pdfjsLib = await import('pdfjs-dist');
      
      // Configure the worker securely dynamically
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      setProgress({ current: 15, total: 100, status: 'Analyzing PDF structure...' });
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const docChildren: any[] = [];

      setProgress({ current: 25, total: 100, status: 'Extracting text content...' });

      for (let i = 1; i <= totalPages; i++) {
        const currentProgress = 25 + Math.floor((i / totalPages) * 55);
        setProgress({ current: currentProgress, total: 100, status: `Reading page ${i} of ${totalPages}...` });
        
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items as any[];
        
        if (items.length > 0) {
          const strings = items.map(item => item.str);
          const pageText = strings.join(" ");

          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: pageText, size: 24 })],
              spacing: { after: 200 }
            })
          );
        } else {
          docChildren.push(new Paragraph({ text: "[Blank Page or Image-Only Page]" }));
        }

        if (layoutMode === 'page-breaks' && i < totalPages) {
          docChildren.push(new Paragraph({ children: [new PageBreak()] }));
        }
      }

      setProgress({ current: 85, total: 100, status: 'Compiling Word document...' });

      const doc = new Document({
        creator: "ConvertHub PRO",
        description: "Converted from PDF",
        sections: [{ children: docChildren }]
      });

      setProgress({ current: 95, total: 100, status: 'Saving file...' });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${file.name.replace(/\.[^/.]+$/, "")}.docx`);

      setProgress({ current: 100, total: 100, status: 'Complete!' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process document. It might be an image-based scan or heavily protected.");
      setAppState('settings');
    }
  };

  const percentComplete = progress.current;

  return (
    <div className="min-h-screen bg-[#f3f0ec] font-sans flex flex-col selection:bg-indigo-200">
      
      <Link href="/converter" className="text-gray-500 hover:text-gray-900 text-sm font-semibold flex items-center gap-1">
                <ArrowLeft size={16} /> Back to Tools
              </Link>
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        
        {/* ================= STATE 1: UPLOAD ================= */}
        {appState === 'upload' && (
          <div className="text-center w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#2a2a35] mb-4 tracking-tight">PDF to Word</h1>
            <p className="text-[#64748b] text-lg md:text-xl mb-10">
              Extract text from your PDF and turn it into an editable Word document.
            </p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-3xl p-16 md:p-24 transition-all duration-300 flex flex-col items-center justify-center bg-white ${
                isDragging ? 'border-[#4f46e5] bg-indigo-50/50 scale-[1.02] shadow-2xl' : 'border-gray-200 hover:border-indigo-300 hover:shadow-xl'
              }`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".pdf" 
                onChange={handleFileSelect} 
                title="Upload PDF Document"
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#4f46e5] text-white' : 'bg-indigo-100 text-[#4f46e5]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select PDF file
              </button>
              <p className="text-gray-400 font-medium mt-6">or drop PDFs here</p>

              {error && (
                <div className="absolute bottom-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm z-20">
                  {error}
                </div>
              )}
            </div>
            
            <p className="mt-8 text-sm text-gray-500 max-w-xl mx-auto">
              * Local text extraction mode: Best for text-heavy documents. Images and complex layouts will not be transferred.
            </p>
          </div>
        )}

        {/* ================= STATE 2: SETTINGS / PREVIEW ================= */}
        {appState === 'settings' && file && (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            
            {/* Left: File Preview */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative group">
              <button onClick={resetApp} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors z-10">
                <X size={20} />
              </button>
              
              <div className="w-40 h-52 bg-white shadow-md border border-gray-200 flex flex-col relative group-hover:-translate-y-2 transition-transform duration-300">
                <div className="flex-1 flex items-center justify-center bg-indigo-50 border-b border-gray-100 text-[#e5322d] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-indigo-100 opacity-50"></div>
                  <FileType size={48} strokeWidth={1.5} className="z-10 text-[#4f46e5]" />
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
                <h2 className="text-xl font-bold text-gray-800">PDF to Word options</h2>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <AlignLeft size={16} /> Document Layout
                  </h3>
                  <div className="space-y-3">
                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${layoutMode === 'page-breaks' ? 'border-[#4f46e5] bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4">
                        <input type="radio" name="layout" className="mt-1 w-5 h-5 accent-[#4f46e5]" checked={layoutMode === 'page-breaks'} onChange={() => setLayoutMode('page-breaks')} />
                        <div>
                          <h4 className="font-bold text-gray-900">Preserve Pages</h4>
                          <p className="text-sm text-gray-500 mt-1">Inserts a page break for every page found in the PDF.</p>
                        </div>
                      </div>
                    </label>

                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${layoutMode === 'continuous' ? 'border-[#4f46e5] bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4">
                        <input type="radio" name="layout" className="mt-1 w-5 h-5 accent-[#4f46e5]" checked={layoutMode === 'continuous'} onChange={() => setLayoutMode('continuous')} />
                        <div>
                          <h4 className="font-bold text-gray-900">Continuous Flow</h4>
                          <p className="text-sm text-gray-500 mt-1">Strips page breaks and merges all text into a single continuous stream.</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button 
                  onClick={startConversion}
                  className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  Convert to Word <ArrowLeft className="rotate-180" size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STATE 3: CONVERTING ================= */}
        {appState === 'converting' && (
          <div className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
            <Loader2 className="w-16 h-16 text-[#4f46e5] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Converting Document</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#4f46e5] h-3 rounded-full transition-all duration-300 ease-out relative" 
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
            <p className="text-[#64748b] text-xl mb-10">Your PDF text has been exported to a Word document.</p>
            
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
        <PdfToWordContent />

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