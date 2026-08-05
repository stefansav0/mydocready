"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Script from 'next/script';
import { 
  UploadCloud, FileText, Download, Trash2, 
  Copy, Loader2, Check, X, Image as ImageIcon,
  Camera, Sparkles, Settings
} from 'lucide-react';

type FileItem = {
  id: string;
  file: File;
  preview: string;
};

// --- DESKTOP/MOBILE CAMERA MODAL ---
const CameraModal = ({ onCapture, onClose }: { onCapture: (file: File) => void, onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    // Request camera access (prefers back camera on mobile)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(err => {
        console.error("Camera error:", err);
        setError("Could not access camera. Please check your browser permissions.");
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `OCR_Capture_${Date.now()}.jpg`, { type: "image/jpeg" });
            onCapture(file);
          }
        }, "image/jpeg", 0.95);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="flex h-16 items-center justify-between px-6 bg-black text-white border-b border-white/10">
        <h2 className="font-medium flex items-center gap-2"><Camera size={18}/> Scan Text</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-red-400 p-6 text-center">{error}</div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      <div className="h-32 bg-black flex items-center justify-center pb-8 border-t border-white/10">
        <button 
          onClick={takePhoto}
          disabled={!stream}
          className="w-16 h-16 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-white rounded-full" />
        </button>
      </div>
    </div>
  );
};


export default function ImageToTextClient() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [result, setResult] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [ocrMode, setOcrMode] = useState<"standard" | "sparse">("standard");

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      items.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, [items]);

  // FIX: Bulletproof Engine Ready Checker
  // This actively polls for Tesseract in case Next.js script loading events miss.
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).Tesseract) {
        setEngineReady(true);
        clearInterval(checkInterval);
      }
    }, 500);
    
    return () => clearInterval(checkInterval);
  }, []);

  const addFiles = useCallback((filesList: FileList | File[]) => {
    const newItems = Array.from(filesList)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file)
      }));
    setItems(prev => [...prev, ...newItems]);
    setShowCamera(false); 
  }, []);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) addFiles(e.target.files);
  }

  function removeAt(idToRemove: string) {
    setItems(prev => {
      const filtered = prev.filter(item => item.id !== idToRemove);
      const removedItem = prev.find(item => item.id === idToRemove);
      if (removedItem) URL.revokeObjectURL(removedItem.preview);
      return filtered;
    });
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  // --- IMAGE PRE-PROCESSING ---
  const preprocessImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(URL.createObjectURL(file));
          return;
        }
        
        ctx.filter = 'grayscale(100%) contrast(250%) brightness(120%)';
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 1.0));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // --- OCR PROCESSING ---
  async function runOCR() {
    if (!items.length) return;
    
    const Tesseract = (window as any).Tesseract;
    if (!Tesseract) {
      alert("AI Engine is still loading. Please wait a second and try again.");
      return;
    }

    setBusy(true);
    setProgress(0);
    
    try {
      const worker = await Tesseract.createWorker('eng+hin', 1, {
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0', 
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const psmMode = ocrMode === "standard" ? 3 : 11;
      await worker.setParameters({
        tessedit_pageseg_mode: psmMode, 
      });

      let out = '';
      
      for (let i = 0; i < items.length; i++) {
        const enhancedImageUrl = await preprocessImage(items[i].file);
        
        const { data } = await worker.recognize(enhancedImageUrl);
        out += data.text + '\n\n';
        
        if (enhancedImageUrl.startsWith('data:')) {
           // Data URLs do not need to be revoked, but standard object URLs do
           // If we fall back to object URL in preprocessing it handles it.
        } else if (enhancedImageUrl.startsWith('blob:')) {
           URL.revokeObjectURL(enhancedImageUrl);
        }
      }

      await worker.terminate();
      
      setResult(prev => prev ? prev + '\n---\n\n' + out.trim() : out.trim());
      
      items.forEach(i => URL.revokeObjectURL(i.preview)); 
      setItems([]);

    } catch (e) {
      console.error('OCR Error:', e);
      alert('Failed to extract text. Check your connection and try again.');
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  // --- Actions ---
  function downloadTxt() {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Extracted_Text_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Script 
        src="https://unpkg.com/tesseract.js@5.0.5/dist/tesseract.min.js"
        strategy="afterInteractive" // Fixed Strategy
        onLoad={() => setEngineReady(true)}
        onReady={() => setEngineReady(true)}
      />

      {showCamera && (
        <CameraModal 
          onCapture={(file) => addFiles([file])} 
          onClose={() => setShowCamera(false)} 
        />
      )}

      <main className="min-h-screen bg-slate-50 pb-16 pt-10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              <FileText className="h-4 w-4" /> Smart OCR Engine
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Extract Text from Images
            </h1>
            <p className="text-slate-600 max-w-2xl">
              Upload photos of documents, receipts, or notes. Our AI will automatically enhance the image and extract a perfect, editable copy of the text.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            
            {/* LEFT COLUMN: UPLOAD & PROCESSING */}
            <div className="space-y-6">
              
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-200 ease-in-out ${
                  isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 shadow-sm shadow-slate-200 mb-6">
                  <UploadCloud className={`h-10 w-10 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Drop images here</h3>
                <p className="text-sm text-slate-500 mb-8">Supports JPG, PNG, WEBP (English & Hindi)</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <label className="cursor-pointer bg-slate-900 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ImageIcon className="w-5 h-5" />
                    Browse Files
                    <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </button>
                </div>
              </div>

              {items.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">Queue ({items.length})</h3>
                    <button 
                      onClick={() => { items.forEach(i => URL.revokeObjectURL(i.preview)); setItems([]); }}
                      className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} /> Clear All
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                        <img src={item.preview} alt="Upload preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeAt(item.id)}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 backdrop-blur-sm"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-full sm:w-auto flex-1">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        <Settings className="w-4 h-4 text-slate-400" />
                        Mode:
                        <select 
                          className="bg-transparent font-semibold text-indigo-700 outline-none ml-2 cursor-pointer"
                          value={ocrMode}
                          onChange={(e) => setOcrMode(e.target.value as any)}
                        >
                          <option value="standard">Standard Document</option>
                          <option value="sparse">Scattered Text (ID Cards/Receipts)</option>
                        </select>
                      </label>
                    </div>

                    <button 
                      onClick={runOCR} 
                      disabled={busy || !engineReady} 
                      className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {busy ? (
                        <><Loader2 size={20} className="animate-spin" /> Extracting ({progress}%)</>
                      ) : !engineReady ? (
                        <><Loader2 size={20} className="animate-spin" /> Loading...</>
                      ) : (
                        <><Sparkles size={20} /> Extract Text</>
                      )}
                    </button>
                  </div>
                  
                  {busy && (
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-6">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: RESULTS */}
            <div className="flex flex-col">
              <div className="bg-slate-900 rounded-3xl p-6 flex flex-col h-full shadow-lg border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Extracted Text
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      disabled={!result}
                      className="px-3 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button 
                      onClick={downloadTxt}
                      disabled={!result}
                      className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download size={14} /> Save
                    </button>
                  </div>
                </div>
                
                <textarea 
                  value={result} 
                  onChange={(e) => setResult(e.target.value)} 
                  placeholder={
                    busy 
                      ? "AI is reading your document...\n\nApplying high-contrast filters...\nScanning for characters..." 
                      : "The extracted text will appear here. \n\nYou can edit this text directly before copying or downloading it."
                  }
                  className="flex-1 w-full p-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-slate-300 leading-relaxed placeholder:text-slate-600 min-h-[400px] outline-none"
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}