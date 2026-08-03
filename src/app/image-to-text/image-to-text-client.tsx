"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Script from 'next/script';
import { 
  UploadCloud, FileText, Download, Trash2, 
  Copy, Loader2, Check, X, Image as ImageIcon 
} from 'lucide-react';

type FileItem = {
  id: string;
  file: File;
  preview: string;
};

export default function ImageToTextClient() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [result, setResult] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    return () => {
      items.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, [items]);

  const addFiles = useCallback((filesList: FileList | File[]) => {
    const newItems = Array.from(filesList)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file)
      }));
    setItems(prev => [...prev, ...newItems]);
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

  // --- OCR Processing ---
  // --- OCR Processing ---
  async function runOCR() {
    if (!items.length) return;
    
    // Grab the global Tesseract object loaded by our Script tag
    const Tesseract = (window as any).Tesseract;
    if (!Tesseract) {
      alert("OCR Engine is still loading. Please wait a second and try again.");
      return;
    }

    setBusy(true);
    setProgress(0);
    setResult('');
    
    try {
      // FIX 1: Request BOTH English and Hindi ('eng+hin')
      const worker = await Tesseract.createWorker('eng+hin', 1, {
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0', // Standard trained data
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      // FIX 2: Set Page Segmentation Mode (PSM) to handle scattered ID card text better
      // PSM 6 assumes a single uniform block of text, PSM 11 finds sparse text. 
      // 3 is usually default, but 11 often works better for ID cards.
      await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT, 
      });

      let out = '';
      
      for (let i = 0; i < items.length; i++) {
        const { data } = await worker.recognize(items[i].file);
        out += data.text + '\n\n';
      }

      await worker.terminate();
      setResult(out.trim());
    } catch (e) {
      console.error('OCR Error:', e);
      alert('Failed to extract text. Check the console for details.');
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
    a.download = `extracted_text_${Date.now()}.txt`;
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
      {/* 
        THE FIX: Load Tesseract directly from unpkg. 
        This isolates the WASM core from Next.js and Turbopack.
      */}
      <Script 
        src="https://unpkg.com/tesseract.js@5.0.5/dist/tesseract.min.js"
        strategy="lazyOnload"
        onLoad={() => setEngineReady(true)}
      />

      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="text-indigo-600" size={24} />
              Image to Text (OCR)
            </h2>
            <p className="text-sm text-gray-500 mt-1">Upload images to extract text from them instantly.</p>
          </div>
        </div>

        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input 
            type="file" 
            id="ocr-file-upload" 
            multiple 
            accept="image/*" 
            onChange={handleFiles} 
            className="hidden" 
          />
          
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400">
              <UploadCloud size={32} />
            </div>
            <div>
              <p className="text-gray-700 font-medium">Drag & drop images here</p>
              <p className="text-sm text-gray-500 mt-1">Supports PNG, JPG, JPEG</p>
            </div>
            <label 
              htmlFor="ocr-file-upload" 
              className="cursor-pointer mt-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
            >
              Browse Files
            </label>
          </div>
        </div>

        {items.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Images to process ({items.length})</h3>
              <button 
                onClick={() => { items.forEach(i => URL.revokeObjectURL(i.preview)); setItems([]); setResult(''); }}
                className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={14} /> Clear Queue
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {items.map((item) => (
                <div key={item.id} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={item.preview} alt="Upload preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeAt(item.id)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={runOCR} 
              disabled={busy || items.length === 0 || !engineReady} 
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Extracting ({progress}%)
                </>
              ) : !engineReady ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Loading Engine...
                </>
              ) : (
                <>
                  <ImageIcon size={18} />
                  Extract Text Now
                </>
              )}
            </button>
            
            {busy && (
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Extracted Text</h3>
            <div className="flex gap-2">
              <button 
                onClick={copyToClipboard}
                disabled={!result}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button 
                onClick={downloadTxt}
                disabled={!result}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download size={14} />
                Save .txt
              </button>
            </div>
          </div>
          
          <textarea 
            value={result} 
            onChange={(e) => setResult(e.target.value)} 
            placeholder="Extracted text will appear here. You can edit this text directly before copying or saving."
            rows={10} 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y text-gray-700 leading-relaxed placeholder:text-gray-400"
          />
        </div>
      </div>
    </>
  );
}