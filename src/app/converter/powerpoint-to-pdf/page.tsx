"use client";

import React, { useState, DragEvent } from 'react';
import { 
  Presentation, FileUp, ArrowLeft, FileOutput, LayoutTemplate, 
  Settings, CheckCircle2, DownloadCloud, Loader2, X, Plus
} from 'lucide-react';
import Link from 'next/link';
import PptToPdfContent from "@/components/PptToPdfContent";

type OrientationMode = 'landscape' | 'portrait';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function PptxToPdfPro() {
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
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pptx')) {
      setError("Please upload a valid PowerPoint document (.pptx).");
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
      setProgress({ current: 5, total: 100, status: 'Initializing PDF engine...' });

      // Dynamically import libraries to bypass Next.js SSR window errors
      const JSZip = (await import('jszip')).default;
      const { jsPDF } = await import('jspdf');

      setProgress({ current: 15, total: 100, status: 'Unpacking PowerPoint structure...' });

      // 1. Read and Unzip the PPTX file
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      setProgress({ current: 30, total: 100, status: 'Extracting slide geometries...' });

      // 2. Locate all slide XML files inside the PPTX structure
      const slideFiles = Object.keys(zip.files).filter(name => name.match(/ppt\/slides\/slide\d+\.xml/));
      
      if (slideFiles.length === 0) {
        throw new Error("No slides found in this document. It may be empty or corrupted.");
      }

      // 3. Sort slides numerically (otherwise slide10 comes before slide2)
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0', 10);
        const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0', 10);
        return numA - numB;
      });

      // 4. Initialize jsPDF
      const doc = new jsPDF({ 
        orientation: orientation, 
        unit: 'mm', 
        format: 'a4' 
      });

      // Get document dimensions for text wrapping
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxLineWidth = pageWidth - (margin * 2);

      setProgress({ current: 40, total: 100, status: 'Compiling PDF pages...' });

      // 5. Parse each slide and render to PDF
      for (let i = 0; i < slideFiles.length; i++) {
        const currentProgress = 40 + Math.floor((i / slideFiles.length) * 50);
        setProgress({ current: currentProgress, total: 100, status: `Rendering slide ${i + 1} of ${slideFiles.length}...` });

        if (i > 0) doc.addPage();

        // Add a subtle slide header
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Slide ${i + 1}`, margin, 15);

        // Read XML content
        const slideXml = await zip.files[slideFiles[i]].async("text");

        // Extract text from <a:t> XML nodes using regex
        const textMatches = slideXml.match(/<a:t>(.*?)<\/a:t>/g) || [];
        
        let cursorY = 30;
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);

        if (textMatches.length === 0) {
          doc.setFontSize(12);
          doc.setTextColor(200, 200, 200);
          doc.text("[Image or Blank Slide]", margin, cursorY);
        } else {
          // Clean the XML tags and combine text blocks roughly
          let combinedText = "";
          
          textMatches.forEach((tag, index) => {
            // Strip tags
            const rawText = tag.replace(/<\/?a:t>/g, '');
            // Simple heuristic: if it ends in punctuation, add a newline, else a space
            if (rawText.trim()) {
              combinedText += rawText + (/[.!?:]$/.test(rawText.trim()) ? "\n\n" : " ");
            }
          });

          // Use jsPDF's built-in text splitter for multi-line wrapping
          const lines = doc.splitTextToSize(combinedText.trim(), maxLineWidth);
          
          doc.text(lines, margin, cursorY);
        }
      }

      setProgress({ current: 95, total: 100, status: 'Saving final PDF...' });

      // 6. Save the PDF
      doc.save(`${file.name.replace(/\.[^/.]+$/, "")}.pdf`);

      setProgress({ current: 100, total: 100, status: 'Complete!' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process presentation. It might be heavily encrypted or contain complex unsupported macros.");
      setAppState('settings');
    }
  };

  const percentComplete = progress.current;

  return (
    <div className="min-h-screen bg-[#fff9f6] font-sans flex flex-col selection:bg-orange-200">
      
      {/* Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-orange-600 transition-colors font-bold text-lg">
          <Presentation className="text-[#d83b01]" size={28} />
          <span>ConvertHub<span className="text-[#d83b01]">PRO</span></span>
        </Link>
        <Link href="/converter" className="text-gray-500 hover:text-gray-900 text-sm font-semibold flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        
        {/* ================= STATE 1: UPLOAD ================= */}
        {appState === 'upload' && (
          <div className="text-center w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#3b2a24] mb-4 tracking-tight">PowerPoint to PDF</h1>
            <p className="text-[#6e5d56] text-lg md:text-xl mb-10">
              Convert your PPTX presentations to PDF format for easy sharing and viewing.
            </p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-3xl p-16 md:p-24 transition-all duration-300 flex flex-col items-center justify-center bg-white ${
                isDragging ? 'border-[#d83b01] bg-orange-50/40 scale-[1.02] shadow-2xl' : 'border-gray-200 hover:border-orange-300 hover:shadow-xl'
              }`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".pptx" 
                onChange={handleFileSelect} 
                title="Upload PowerPoint Document"
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#d83b01] text-white' : 'bg-orange-50 text-[#d83b01]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#d83b01] hover:bg-[#b83201] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select PPTX file
              </button>
              <p className="text-gray-400 font-medium mt-6">or drop presentations here</p>

              {error && (
                <div className="absolute bottom-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm z-20">
                  {error}
                </div>
              )}
            </div>
            
            <p className="mt-8 text-sm text-gray-400 max-w-xl mx-auto">
              * Text-Extraction Mode: Client-side conversion extracts textual data from slides. Heavy background vectors/images may be simplified.
            </p>
          </div>
        )}

        {/* ================= STATE 2: SETTINGS / PREVIEW ================= */}
        {appState === 'settings' && file && (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            
            {/* Left: File Preview */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative group">
              <button onClick={resetApp} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors z-10">
                <X size={20} />
              </button>
              
              <div className="w-40 h-52 bg-white shadow-md border border-gray-200 flex flex-col relative group-hover:-translate-y-2 transition-transform duration-300">
                <div className="flex-1 flex items-center justify-center bg-orange-50/30 border-b border-gray-100 text-[#d83b01] relative overflow-hidden">
                  {/* Subtle transition visual from PPT Orange to PDF Red */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-50"></div>
                  <Presentation size={48} strokeWidth={1.5} className="z-10 text-[#d83b01]" />
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
                <h2 className="text-xl font-bold text-gray-800">PPTX to PDF options</h2>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <LayoutTemplate size={16} /> Output Layout
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${orientation === 'landscape' ? 'border-[#d83b01] bg-orange-50/40 text-[#d83b01]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={orientation === 'landscape'} onChange={() => setOrientation('landscape')} />
                      <span className="font-bold block">Slides</span>
                      <span className="text-xs opacity-70">Landscape mode</span>
                    </label>

                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${orientation === 'portrait' ? 'border-[#d83b01] bg-orange-50/40 text-[#d83b01]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={orientation === 'portrait'} onChange={() => setOrientation('portrait')} />
                      <span className="font-bold block">Document</span>
                      <span className="text-xs opacity-70">Portrait mode</span>
                    </label>
                  </div>
                </div>

                <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100">
                  <h4 className="font-bold text-[#d83b01] flex items-center gap-2 text-sm mb-1">
                    <FileOutput size={16} /> Smart Extraction
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    This tool unpacks the presentation and extracts raw slide text natively in your browser, generating crisp, readable PDF pages.
                  </p>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button 
                  onClick={startConversion}
                  className="w-full bg-[#d83b01] hover:bg-[#b83201] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
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
            <Loader2 className="w-16 h-16 text-[#d83b01] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Generating PDF Pages</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#d83b01] h-3 rounded-full transition-all duration-300 ease-out relative" 
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
            <h2 className="text-4xl font-black text-[#3b2a24] mb-4">Task Complete!</h2>
            <p className="text-[#6e5d56] text-xl mb-10">Your PowerPoint slides have been compiled into a PDF document.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={resetApp}
                className="w-full sm:w-auto px-8 py-4 bg-[#3b2a24] hover:bg-black text-white rounded-xl font-bold text-lg transition-all"
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
        <PptToPdfContent />

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