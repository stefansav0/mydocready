"use client";

import React, { useState } from "react";
import * as ImglyBackgroundRemoval from "@imgly/background-removal";
import { 
  UploadCloud, Image as ImageIcon, Palette, 
  ChevronDown, CheckCircle2, Trash2, Layers, BrainCircuit,
  HelpCircle
} from "lucide-react";

export default function BackgroundRemover() {
  // Application State
  const [file, setFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  
  // AI Progress State
  const [progressText, setProgressText] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Editor State
  const [customBgColor, setCustomBgColor] = useState<string>("transparent");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Background Swatches
  const bgSwatches = [
    "transparent", "#ffffff", "#000000", "#ef4444", "#f97316", 
    "#eab308", "#22c55e", "#3b82f6", "#06b6d4", "#3b8cf6", 
    "#6366f1", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    let selectedFile = e.target?.files?.[0] || e.dataTransfer?.files?.[0];
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setOriginalImageUrl(url);
    processBackground(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e);
  };

  const resetWorkspace = () => {
    setFile(null);
    setOriginalImageUrl("");
    if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
    setProcessedImageUrl("");
    setStatus('idle');
    setCustomBgColor("transparent");
    setProgressText("");
    setProgressPercent(0);
  };

  // --- TRUE AI BACKGROUND REMOVAL ENGINE (@imgly) ---
  const processBackground = async (imageUrl: string) => {
    setStatus('processing');
    setProgressText("Initializing AI Engine...");
    setProgressPercent(0);

    try {
      // The AI model runs completely in the browser. 
      // "isnet_quint8" is the smallest, fastest 8-bit quantized model.
      const imageBlob = await ImglyBackgroundRemoval.removeBackground(imageUrl, {
        model: "isnet_quint8", 
        progress: (key, current, total) => {
          // The library downloads the WASM AI model on the first run
          if (key.includes("fetch")) {
            setProgressText("Downloading Neural Model (Once)...");
          } else if (key.includes("compute")) {
            setProgressText("AI Isolating Subject...");
          }
          setProgressPercent(Math.round((current / total) * 100));
        }
      });

      const url = URL.createObjectURL(imageBlob);
      setProcessedImageUrl(url);
      setStatus('success');
    } catch (err) {
      console.error("AI BG Removal Error:", err);
      setStatus('idle');
      alert("Failed to process image. Please try a different photo.");
    }
  };

  // --- EXPORT ENGINE ---
  const downloadResult = async (format: 'png' | 'jpeg', quality: 'preview' | 'hd') => {
    setShowDownloadMenu(false);
    if (!processedImageUrl || !file) return;

    try {
      const img = new Image();
      img.src = processedImageUrl;
      await new Promise((res) => { img.onload = res; });

      const canvas = document.createElement("canvas");
      const scale = quality === 'preview' ? Math.min(1, 1000 / Math.max(img.width, img.height)) : 1;
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (customBgColor !== 'transparent') {
        ctx.fillStyle = customBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${file.name.split('.')[0]}_rmbg_${quality}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, `image/${format}`, 0.95);

    } catch(e) {
      console.error("Download Error:", e);
    }
  };

  // ============================================
  // VIEW 1: LANDING PAGE (UPLOAD + FAQ)
  // ============================================
  if (status === 'idle' && !originalImageUrl) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-900 flex flex-col">
        
        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center max-w-[1200px] mx-auto w-full px-6 py-12 lg:py-24">
          
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 lg:gap-24 mb-32">
            <div className="flex-1 text-center lg:text-left max-w-xl animate-in slide-in-from-left-8 duration-700">
              <h1 className="text-5xl lg:text-[72px] font-black text-slate-800 leading-[1.1] tracking-tight mb-6">
                Remove Image <br /> Background
              </h1>
              <p className="text-slate-500 leading-relaxed text-lg max-w-md mx-auto lg:mx-0">
                Instantly create perfect transparent backgrounds using local AI. Flawlessly cuts out hair, faces, and complex edges.
              </p>
            </div>

            <div className="flex-1 w-full max-w-md animate-in slide-in-from-right-8 duration-700">
              <div 
                className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 lg:p-12 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  
                  <label 
                    htmlFor="file-upload" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-5 px-8 rounded-full shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer mb-6 flex items-center justify-center gap-3"
                  >
                    <UploadCloud size={24} /> Upload Image
                  </label>
                  
                  <p className="text-slate-500 font-medium text-lg mb-2">or drop a file here</p>
                  <p className="text-slate-400 text-sm">Supports JPG, PNG, and WebP</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="w-full border-t border-slate-200 pt-20 mb-20 animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">How it Works</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Get perfect cutouts in seconds using our client-side Neural Network.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">1. Upload Image</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Drag and drop or select any photo from your device. We support all major image formats.</p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <BrainCircuit size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">2. AI Processing</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Our local neural network automatically detects the main subject and perfectly masks out the background.</p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <Palette size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">3. Edit & Download</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Add a new solid color background if needed, then download your high-resolution result instantly.</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="w-full mb-20 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Are my images uploaded to a server?</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">No. We use a specialized client-side AI model. This means the neural network downloads to your browser and processes your images locally. Your photos never leave your device, ensuring 100% privacy.</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Is this tool totally free?</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Yes, it is completely free to use. Because the processing happens on your own device rather than on expensive cloud servers, we can offer this tool without limits or watermarks.</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Can it handle difficult edges like hair?</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Yes. Our engine uses an advanced Semantic Segmentation model designed specifically to detect complex boundaries like hair, fur, and intricate object edges.</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Why did the first image take longer?</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">On your very first use, your browser needs to download the AI model file (a few megabytes). Once cached, subsequent image processing will be significantly faster.</p>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    );
  }

  // ============================================
  // VIEW 2: EDITOR & RESULTS WORKSPACE
  // ============================================
  return (
    <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-900 flex flex-col">
      <header className="w-full bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-50">
        <div className="flex items-center gap-2 font-black text-lg lg:text-xl text-slate-800 tracking-tight cursor-pointer" onClick={resetWorkspace}>
          
          <span className="hidden sm:inline">background<span className="text-slate-400">remover</span></span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={resetWorkspace} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" title="Delete & Restart">
            <Trash2 size={20} />
          </button>
          
          <div className="relative">
            <div className="flex shadow-lg shadow-blue-600/20 rounded-full">
              <button 
                onClick={() => downloadResult(customBgColor === 'transparent' ? 'png' : 'jpeg', 'hd')}
                disabled={status === 'processing'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-l-full text-xs sm:text-sm font-bold transition-all disabled:opacity-70 border-r border-blue-700/50"
              >
                {status === 'processing' ? 'Processing...' : 'Download'}
              </button>
              <button 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                disabled={status === 'processing'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-r-full flex items-center justify-center transition-all disabled:opacity-70"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {showDownloadMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 p-2">
                <button 
                  onClick={() => downloadResult(customBgColor === 'transparent' ? 'png' : 'jpeg', 'preview')}
                  className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2">Preview Image</div>
                    <div className="text-xs text-slate-500 mt-0.5">Standard resolution</div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Free</span>
                </button>
                <div className="h-px w-full bg-slate-100 my-1"></div>
                <button 
                  onClick={() => downloadResult(customBgColor === 'transparent' ? 'png' : 'jpeg', 'hd')}
                  className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl transition-colors text-left group"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover:text-blue-700">HD Image</div>
                    <div className="text-xs text-slate-500 mt-0.5">Full original resolution</div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Pro</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Visual Canvas Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:min-h-[600px] relative">
          
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={customBgColor === 'transparent' ? {
              // Show checkerboard ONLY if background is set to transparent
              backgroundImage: `repeating-linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), repeating-linear-gradient(45deg, #f0f0f0 25%, #ffffff 25%, #ffffff 75%, #f0f0f0 75%, #f0f0f0)`,
              backgroundPosition: `0 0, 10px 10px`,
              backgroundSize: `20px 20px`,
            } : {
              // Apply solid color covering the whole div
              backgroundColor: customBgColor
            }}
          ></div>

          {status === 'processing' && (
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <span className="text-sm font-bold text-slate-600 tracking-widest uppercase mb-3">
                {progressText || "Processing..."}
              </span>
              <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          )}

          <div className="relative z-10 flex-1 flex items-center justify-center p-4">
            <img 
              src={status === 'success' ? processedImageUrl : originalImageUrl} 
              alt="Workspace Canvas" 
              className="max-w-full max-h-full object-contain drop-shadow-xl transition-all duration-500"
              style={{ maxHeight: 'calc(100vh - 250px)' }}
            />
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white p-1 rounded-full shadow-lg border border-slate-200 flex">
             <button 
               className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${status === 'idle' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => { setStatus('idle'); setCustomBgColor("transparent"); }}
               disabled={status === 'processing'}
             >
               Original
             </button>
             <button 
               className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${status === 'success' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'}`}
               onClick={() => setStatus('success')}
               disabled={!processedImageUrl || status === 'processing'}
             >
               Removed BG
             </button>
          </div>
        </div>

        {/* Sidebar: Only Background Setup */}
        <aside className="w-full lg:w-[340px] bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col gap-8 flex-shrink-0 h-fit">
          
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Palette size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Background Setup</h3>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Color & Export</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-3">Solid Colors</label>
                <div className="flex flex-wrap gap-3">
                  {bgSwatches.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomBgColor(color)}
                      className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 relative flex items-center justify-center ${customBgColor === color ? 'border-blue-600 scale-110' : 'border-slate-200'}`}
                      style={{ 
                        backgroundColor: color === 'transparent' ? '#fff' : color,
                        backgroundImage: color === 'transparent' ? `repeating-linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), repeating-linear-gradient(45deg, #e2e8f0 25%, #ffffff 25%, #ffffff 75%, #e2e8f0 75%, #e2e8f0)` : 'none',
                        backgroundPosition: `0 0, 4px 4px`,
                        backgroundSize: `8px 8px`
                      }}
                      title={color === 'transparent' ? 'Transparent' : color}
                    >
                       {customBgColor === color && color !== 'transparent' && (
                         <CheckCircle2 size={16} className={color === '#ffffff' ? 'text-slate-800' : 'text-white'} />
                       )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 leading-relaxed">
                <strong>Export Note:</strong> Selecting a solid background color will automatically flatten and save your image as a high-quality <strong>JPEG</strong>. Transparent backgrounds save as <strong>PNG</strong>.
              </div>
            </div>
          </div>

        </aside>

      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}