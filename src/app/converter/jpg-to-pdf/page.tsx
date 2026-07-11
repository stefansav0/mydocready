"use client";

import React, { useState, DragEvent } from 'react';
import { 
  Image as ImageIcon, FileUp, ArrowLeft, LayoutTemplate, FileOutput,
  Settings, CheckCircle2, DownloadCloud, Loader2, X, Plus, Trash2, Maximize
} from 'lucide-react';
import Link from 'next/link';
import JpgToPdfContent from "@/components/JpgToPdfContent";

type OrientationMode = 'portrait' | 'landscape';
type PageSizeMode = 'a4' | 'letter';
type MarginMode = 'none' | 'small' | 'big';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function JpgToPdfPro() {
  const [files, setFiles] = useState<File[]>([]);
  const [appState, setAppState] = useState<AppState>('upload');
  const [orientation, setOrientation] = useState<OrientationMode>('portrait');
  const [pageSize, setPageSize] = useState<PageSizeMode>('a4');
  const [margin, setMargin] = useState<MarginMode>('small');
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
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (incomingFiles: File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const filtered = incomingFiles.filter(file => validTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png)$/i));
    
    if (filtered.length === 0) {
      setError("Please upload valid image files (.jpg, .jpeg, .png).");
      return;
    }

    setError(null);
    setFiles(prev => [...prev, ...filtered]);
    setAppState('settings');
  };

  const removeFile = (indexToRemove: number) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updated);
    if (updated.length === 0) {
      resetApp();
    }
  };

  const resetApp = () => {
    setFiles([]);
    setAppState('upload');
    setProgress({ current: 0, total: 100, status: '' });
    setError(null);
  };

  // Helper utility to safely load an image profile into browser memory to capture aspect ratios
  const loadImageElement = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to decode image data stream."));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read local file structures."));
      reader.readAsDataURL(file);
    });
  };

  // --- Core Conversion Logic ---
  const startConversion = async () => {
    if (files.length === 0) return;
    setAppState('converting');
    setError(null);

    try {
      setProgress({ current: 5, total: 100, status: 'Booting client canvas engines...' });

      // Dynamically import jsPDF to eliminate Next.js server compilation hydration errors
      const { jsPDF } = await import('jspdf');

      // Define native dimension baselines in millimeters (jsPDF configuration models)
      const pageDimensions = {
        a4: { portrait: [210, 297], landscape: [297, 210] },
        letter: { portrait: [215.9, 279.4], landscape: [279.4, 215.9] }
      };

      const [pWidth, pHeight] = pageDimensions[pageSize][orientation];

      // Margin specifications in millimeters
      const marginMap = { none: 0, small: 8, big: 18 };
      const selectedMargin = marginMap[margin];

      // Initialize the Document Core Context
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
      });

      const totalImages = files.length;

      for (let i = 0; i < totalImages; i++) {
        const currentProgress = 10 + Math.floor((i / totalImages) * 80);
        setProgress({ current: currentProgress, total: 100, status: `Embedding image asset ${i + 1} of ${totalImages}...` });

        // Add a new layout canvas page frame if index steps past the first asset initialization
        if (i > 0) doc.addPage();

        const imageFile = files[i];
        
        // Load image to compute true geometrical scales cleanly
        const loadedImg = await loadImageElement(imageFile);
        
        // Max bounds calculated against user margin settings
        const maxW = pWidth - (selectedMargin * 2);
        const maxH = pHeight - (selectedMargin * 2);

        // Scale calculations protecting original image aspect ratios from distortion
        let targetW = maxW;
        let targetH = (loadedImg.height * targetW) / loadedImg.width;

        if (targetH > maxH) {
          targetH = maxH;
          targetW = (loadedImg.width * targetH) / loadedImg.height;
        }

        // Center alignment placement math matching master workspace grids
        const finalX = selectedMargin + (maxW - targetW) / 2;
        const finalY = selectedMargin + (maxH - targetH) / 2;

        // Compress and cleanly stream data tracks straight into internal binary layers
        doc.addImage(loadedImg.src, 'JPEG', finalX, finalY, targetW, targetH);
      }

      setProgress({ current: 95, total: 100, status: 'Finalizing encryption tracks...' });
      
      const standardFileName = files.length === 1 
        ? `${files[0].name.replace(/\.[^/.]+$/, "")}.pdf`
        : `Compiled_Images_Package.pdf`;

      doc.save(standardFileName);

      setProgress({ current: 100, total: 100, status: 'Complete!' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to stack image components. Data tracks may read invalid structural bits.");
      setAppState('settings');
    }
  };

  const percentComplete = progress.current;

  return (
    <div className="min-h-screen bg-[#fff5f5] font-sans flex flex-col selection:bg-red-100">
      
      {/* Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-red-600 transition-colors font-bold text-lg">
          <ImageIcon className="text-[#e5322d]" size={28} />
          <span>ConvertHub<span className="text-[#e5322d]">PRO</span></span>
        </Link>
        <Link href="/converter" className="text-gray-500 hover:text-gray-900 text-sm font-semibold flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        
        {/* ================= STATE 1: UPLOAD ================= */}
        {appState === 'upload' && (
          <div className="text-center w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#3b2624] mb-4 tracking-tight">JPG to PDF</h1>
            <p className="text-[#735e5b] text-lg md:text-xl mb-10">
              Convert and merge multiple JPG, JPEG, and PNG images into a clean, single PDF document.
            </p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-3xl p-16 md:p-24 transition-all duration-300 flex flex-col items-center justify-center bg-white ${
                isDragging ? 'border-[#e5322d] bg-red-50/40 scale-[1.02] shadow-2xl' : 'border-gray-200 hover:border-red-300 hover:shadow-xl'
              }`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".jpg,.jpeg,.png" 
                multiple
                onChange={handleFileSelect} 
                title="Upload Images"
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#e5322d] text-white' : 'bg-red-50 text-[#e5322d]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#e5322d] hover:bg-[#c92622] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select Image files
              </button>
              <p className="text-gray-400 font-medium mt-6">or drop image packs directly here</p>

              {error && (
                <div className="absolute bottom-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm z-20">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= STATE 2: SETTINGS / PREVIEW ================= */}
        {appState === 'settings' && files.length > 0 && (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            
            {/* Left: Interactive File Queue Previews */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[450px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <span>Queue Monitor</span>
                  <span className="bg-red-100 text-[#e5322d] text-xs px-2.5 py-0.5 rounded-full font-black">{files.length} {files.length === 1 ? 'Image' : 'Images'}</span>
                </h3>
                <button onClick={resetApp} className="text-xs text-gray-400 hover:text-red-500 font-bold transition-colors">Clear All</button>
              </div>

              {/* Grid Array mapping loaded images dynamically */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[380px] p-1.5 custom-scrollbar">
                {files.map((f, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-3 relative flex flex-col items-center justify-between group shadow-sm hover:shadow transition-all hover:border-red-200">
                    <button 
                      onClick={() => removeFile(idx)} 
                      className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 text-gray-400 p-1 rounded-full hover:text-red-600 hover:border-red-100 shadow-sm transition-colors z-20"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-gray-400 border border-gray-100 relative">
                      <ImageIcon size={28} className="opacity-40 group-hover:scale-110 transition-transform" />
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">#{idx+1}</span>
                    </div>

                    <p className="w-full text-[11px] font-bold text-gray-700 mt-2 truncate text-center">{f.name}</p>
                    <p className="text-[10px] text-gray-400">{(f.size / 1024).toFixed(0)} KB</p>
                  </div>
                ))}

                {/* Inline upload adapter block letting users append elements easily */}
                <label className="border-2 border-dashed border-gray-200 hover:border-red-400 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 cursor-pointer transition-colors hover:bg-red-50/20 group aspect-[4/3]">
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png" multiple onChange={handleFileSelect} />
                  <Plus size={24} className="group-hover:scale-110 transition-transform text-gray-300 group-hover:text-red-400" />
                  <span className="text-[10px] font-bold mt-1 group-hover:text-red-500">Add More</span>
                </label>
              </div>
            </div>

            {/* Right: Options Panel Sidebar Container */}
            <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center gap-3">
                <Settings className="text-gray-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">JPG to PDF options</h2>
              </div>
              
              <div className="p-6 flex-1 space-y-5 overflow-y-auto max-h-[480px]">
                
                {/* Setting 1: Page Orientation */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <LayoutTemplate size={14} /> Page Orientation
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${orientation === 'portrait' ? 'border-[#e5322d] bg-red-50/20 text-[#e5322d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={orientation === 'portrait'} onChange={() => setOrientation('portrait')} />
                      <span className="font-bold block text-sm">Portrait</span>
                    </label>

                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${orientation === 'landscape' ? 'border-[#e5322d] bg-red-50/20 text-[#e5322d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={orientation === 'landscape'} onChange={() => setOrientation('landscape')} />
                      <span className="font-bold block text-sm">Landscape</span>
                    </label>
                  </div>
                </div>

                {/* Setting 2: Page Size Setup */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Maximize size={14} /> Page Dimensions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${pageSize === 'a4' ? 'border-[#e5322d] bg-red-50/20 text-[#e5322d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={pageSize === 'a4'} onChange={() => setPageSize('a4')} />
                      <span className="font-bold block text-sm">A4 Standard</span>
                    </label>

                    <label className={`block border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${pageSize === 'letter' ? 'border-[#e5322d] bg-red-50/20 text-[#e5322d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={pageSize === 'letter'} onChange={() => setPageSize('letter')} />
                      <span className="font-bold block text-sm">US Letter</span>
                    </label>
                  </div>
                </div>

                {/* Setting 3: Margin Options */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <FileOutput size={14} /> Border Margin
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {/* None */}
                    <label className={`block border-2 rounded-xl py-2.5 px-1 cursor-pointer text-center transition-all ${margin === 'none' ? 'border-[#e5322d] bg-red-50/20 text-[#e5322d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={margin === 'none'} onChange={() => setMargin('none')} />
                      <span className="font-bold block text-xs">None</span>
                    </label>
                    {/* Small */}
                    <label className={`block border-2 rounded-xl py-2.5 px-1 cursor-pointer text-center transition-all ${margin === 'small' ? 'border-[#e5322d] bg-red-50/20 text-[#e5322d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={margin === 'small'} onChange={() => setMargin('small')} />
                      <span className="font-bold block text-xs">Small</span>
                    </label>
                    {/* Big */}
                    <label className={`block border-2 rounded-xl py-2.5 px-1 cursor-pointer text-center transition-all ${margin === 'big' ? 'border-[#e5322d] bg-red-50/20 text-[#e5322d]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" className="hidden" checked={margin === 'big'} onChange={() => setMargin('big')} />
                      <span className="font-bold block text-xs">Wide</span>
                    </label>
                  </div>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button 
                  onClick={startConversion}
                  className="w-full bg-[#e5322d] hover:bg-[#c92622] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
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
            <Loader2 className="w-16 h-16 text-[#e5322d] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Compiling PDF Album</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#e5322d] h-3 rounded-full transition-all duration-300 ease-out relative" 
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
            <h2 className="text-4xl font-black text-[#3b2624] mb-4">Task Complete!</h2>
            <p className="text-[#735e5b] text-xl mb-10">Your images have been successfully stacked and converted to a PDF.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={resetApp}
                className="w-full sm:w-auto px-8 py-4 bg-[#3b2624] hover:bg-black text-white rounded-xl font-bold text-lg transition-all"
              >
                Convert more images
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
        <JpgToPdfContent />

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bcbcbc;
        }
      `}} />
    </div>
  );
}