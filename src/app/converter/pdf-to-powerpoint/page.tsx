"use client";

import React, { useState, DragEvent } from 'react';
import { 
  Presentation, FileUp, ArrowLeft, Layout, Type, 
  Settings, CheckCircle2, DownloadCloud, Loader2, X, Plus
} from 'lucide-react';
import Link from 'next/link';

type ConvertMode = 'slides-as-images' | 'editable-text';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function PdfToPptxPro() {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [convertMode, setConvertMode] = useState<ConvertMode>('slides-as-images');
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
      setProgress({ current: 5, total: 100, status: 'Initializing presentation engine...' });

      // Dynamically import libraries to strictly bypass Next.js SSR evaluation issues
      const pdfjsLib = await import('pdfjs-dist');
      const PptxGenJS = (await import('pptxgenjs')).default;

      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      setProgress({ current: 15, total: 100, status: 'Parsing master presentation template...' });

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      // Create a brand new PowerPoint Presentation
      const pptx = new PptxGenJS();
      
      // Set to standard modern widescreen format (16:9 layout -> 10 x 5.625 inches)
      pptx.layout = 'LAYOUT_169'; 

      setProgress({ current: 25, total: 100, status: 'Processing layout slides...' });

      // Create an offscreen temporary canvas to draw the pages if converting to image mode
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      for (let p = 1; p <= totalPages; p++) {
        const currentProgress = 25 + Math.floor((p / totalPages) * 65);
        setProgress({ current: currentProgress, total: 100, status: `Building slide ${p} of ${totalPages}...` });

        const page = await pdf.getPage(p);
        const slide = pptx.addSlide();

        if (convertMode === 'slides-as-images') {
          if (!context) throw new Error("Could not initialize localized drawing canvas Context.");
          
          // Render page to image canvas at crisp scale high quality resolution
          const viewport = page.getViewport({ scale: 2.0 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvas: canvas, viewport: viewport }).promise;
          
          // Extract canvas image data
          const imgDataUrl = canvas.toDataURL('image/jpeg', 0.9);

          // Add image full-bleed directly covering modern widescreen dimensions (10 x 5.625 inches)
          slide.addImage({ 
            data: imgDataUrl, 
            x: 0, 
            y: 0, 
            w: 10, 
            h: 5.625 
          });
        } else {
          // Alternative: Text block extraction mode
          const textContent = await page.getTextContent();
          const items = textContent.items as any[];
          
          if (items.length > 0) {
            const pageText = items.map(item => item.str).join(" ");
            
            // Add editable text block onto the slide cleanly with padding margins
            slide.addText(pageText, { 
              x: 0.8, 
              y: 0.6, 
              w: 8.4, 
              h: 4.4, 
              fontSize: 14, 
              color: '333333',
              align: 'left',
              valign: 'top'
            });
          } else {
            slide.addText("[Empty Slide or Image Page Element]", { x: 1, y: 1, fontSize: 12, color: '888888' });
          }
        }
      }

      setProgress({ current: 95, total: 100, status: 'Compiling final PowerPoint presentation file...' });

      // Save PowerPoint directly via library stream methods
      const outputFileName = `${file.name.replace(/\.[^/.]+$/, "")}.pptx`;
      await pptx.writeFile({ fileName: outputFileName });

      setProgress({ current: 100, total: 100, status: 'Complete!' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to structure presentation decks. File could contain heavy system permission restrictions.");
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
            <h1 className="text-4xl md:text-5xl font-black text-[#3b2a24] mb-4 tracking-tight">PDF to PowerPoint</h1>
            <p className="text-[#6e5d56] text-lg md:text-xl mb-10">
              Convert your PDF documents into structured, easy-to-edit PowerPoint slide presentations.
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
                accept=".pdf" 
                onChange={handleFileSelect} 
                title="Upload PDF Presentation"
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#d83b01] text-white' : 'bg-orange-50 text-[#d83b01]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#d83b01] hover:bg-[#b83201] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select PDF file
              </button>
              <p className="text-gray-400 font-medium mt-6">or drop PDFs here</p>

              {error && (
                <div className="absolute bottom-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm z-20">
                  {error}
                </div>
              )}
            </div>
            
            <p className="mt-8 text-sm text-gray-400 max-w-xl mx-auto">
              * Local canvas rendering: Widescreen 16:9 output templates are built matching traditional screen configurations perfectly.
            </p>
          </div>
        )}

        {/* ================= STATE 2: SETTINGS / PREVIEW ================= */}
        {appState === 'settings' && file && (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            
            {/* Left: File Preview */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative group">
              <button onClick={resetApp} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors z-10">
                <X size={20} />
              </button>
              
              <div className="w-40 h-52 bg-white shadow-md border border-gray-200 flex flex-col relative group-hover:-translate-y-2 transition-transform duration-300">
                <div className="flex-1 flex items-center justify-center bg-orange-50/30 border-b border-gray-100 text-[#d83b01] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-40"></div>
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
                <h2 className="text-xl font-bold text-gray-800">PDF to PowerPoint options</h2>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Layout size={16} /> Extraction Sizing Mode
                  </h3>
                  <div className="space-y-3">
                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${convertMode === 'slides-as-images' ? 'border-[#d83b01] bg-orange-50/10' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4">
                        <input type="radio" name="conversion" className="mt-1 w-5 h-5 accent-[#d83b01]" checked={convertMode === 'slides-as-images'} onChange={() => setConvertMode('slides-as-images')} />
                        <div>
                          <h4 className="font-bold text-gray-900">Slides as Images</h4>
                          <p className="text-sm text-gray-500 mt-1">Highly Recommended. Renders pages as high-definition full bleed background layouts. Keeps your fonts, diagrams, tables, and spacing 100% accurate.</p>
                        </div>
                      </div>
                    </label>

                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${convertMode === 'editable-text' ? 'border-[#d83b01] bg-orange-50/10' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4">
                        <input type="radio" name="conversion" className="mt-1 w-5 h-5 accent-[#d83b01]" checked={convertMode === 'editable-text'} onChange={() => setConvertMode('editable-text')} />
                        <div>
                          <h4 className="font-bold text-gray-900">Raw Text Blocks</h4>
                          <p className="text-sm text-gray-500 mt-1">Strips the physical backing layout. Converts internal embedded text strings directly into editable text field layouts.</p>
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
                  className="w-full bg-[#d83b01] hover:bg-[#b83201] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  Convert to PPTX <ArrowLeft className="rotate-180" size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STATE 3: CONVERTING ================= */}
        {appState === 'converting' && (
          <div className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
            <Loader2 className="w-16 h-16 text-[#d83b01] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Generating Presentation Decks</h2>
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
            <p className="text-[#6e5d56] text-xl mb-10">Your PDF slides have been compiled into a PowerPoint document.</p>
            
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