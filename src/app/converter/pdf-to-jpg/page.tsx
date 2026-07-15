"use client";

import React, { useState, useRef, DragEvent } from 'react';
import { 
  FileImage, FileUp, ArrowLeft, Layers, Image as ImageIcon, 
  Settings, CheckCircle2, DownloadCloud, Loader2, X, Plus
} from 'lucide-react';
import Link from 'next/link';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PdfToJpgContent from "@/components/PdfToJpgContent";

type ConversionMode = 'pages' | 'extract';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function PdfToJpgPro() {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [mode, setMode] = useState<ConversionMode>('pages');
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      setError("Please upload a valid PDF file format.");
      return;
    }
    setError(null);
    setFile(file);
    setAppState('settings');
  };

  const resetApp = () => {
    setFile(null);
    setAppState('upload');
    setProgress({ current: 0, total: 0, status: '' });
    setError(null);
  };

  // --- Core Conversion Logic ---
  const startConversion = async () => {
    if (!file || !canvasRef.current || !mode) return;
    setAppState('converting');
    setError(null);
    setProgress({ current: 0, total: 0, status: 'Initializing conversion engine...' });

    try {
      // FIX: Dynamically import pdfjs-dist ONLY inside client interaction space
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      setProgress({ current: 0, total: 0, status: 'Reading PDF data...' });
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const zip = new JSZip();
      const folderName = `${file.name.replace('.pdf', '')}_Images`;
      const imgFolder = zip.folder(folderName);
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context || !imgFolder) throw new Error("Canvas initialization failed");

      if (mode === 'pages') {
        // MODE 1: Every Page to JPG
        for (let i = 1; i <= totalPages; i++) {
          setProgress({ current: i, total: totalPages, status: `Converting page ${i} of ${totalPages}...` });
          
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.5 }); // High-quality scale
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport, canvas: canvas }).promise;

          const imgData = canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
          imgFolder.file(`Page_${i.toString().padStart(3, '0')}.jpg`, imgData, { base64: true });
        }
      } else {
        // MODE 2: Extract Embedded Images
        setProgress({ current: 0, total: totalPages, status: `Scanning pages for embedded images...` });
        let imageCount = 0;

        for (let i = 1; i <= totalPages; i++) {
          setProgress({ current: i, total: totalPages, status: `Scanning page ${i} of ${totalPages}...` });
          const page = await pdf.getPage(i);
          const ops = await page.getOperatorList();
          
          for (let j = 0; j < ops.fnArray.length; j++) {
            if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject || ops.fnArray[j] === pdfjsLib.OPS.paintXObject) {
              imageCount++;
              const objId = ops.argsArray[j][0];
              try {
                const imgObj = await page.objs.get(objId);
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = imgObj.width;
                tempCanvas.height = imgObj.height;
                const tempCtx = tempCanvas.getContext('2d');
                
                if (tempCtx) {
                  const imageData = new ImageData(new Uint8ClampedArray(imgObj.data), imgObj.width, imgObj.height);
                  tempCtx.putImageData(imageData, 0, 0);
                  const base64Data = tempCanvas.toDataURL('image/jpeg', 0.95).split(',')[1];
                  imgFolder.file(`Extracted_Image_${imageCount.toString().padStart(3, '0')}.jpg`, base64Data, { base64: true });
                }
              } catch (e) {
                console.warn("Could not extract an image object", e);
              }
            }
          }
        }
        
        if (imageCount === 0) {
          throw new Error("No extractable images were found inside this PDF.");
        }
      }

      // Generate ZIP and Download
      setProgress({ current: totalPages, total: totalPages, status: 'Zipping your images...' });
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `${folderName}.zip`);

      setAppState('success');
    } catch (err: unknown) {
      console.error(err);
      const errorObj = err as Error;
      setError(errorObj.message || "Failed to process PDF. The file might be corrupted or protected.");
      setAppState('settings');
    }
  };

  const percentComplete = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f3f0ec] font-sans flex flex-col selection:bg-red-200">
      <canvas ref={canvasRef} className="hidden"></canvas>

      <Link href="/converter" className="text-gray-500 hover:text-gray-900 text-sm font-semibold flex items-center gap-1">
                <ArrowLeft size={16} /> Back to Tools
              </Link>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        
        {/* ================= STATE 1: UPLOAD ================= */}
        {appState === 'upload' && (
          <div className="text-center w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#33333b] mb-4 tracking-tight">PDF to JPG</h1>
            <p className="text-[#707079] text-lg md:text-xl mb-10">
              Convert each PDF page into a JPG or extract all images contained in a PDF.
            </p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-3xl p-16 md:p-24 transition-all duration-300 flex flex-col items-center justify-center bg-white ${
                isDragging ? 'border-[#e5322d] bg-red-50 scale-[1.02] shadow-2xl' : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
              }`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".pdf" 
                onChange={handleFileSelect} 
                title="Upload PDF"
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#e5322d] text-white' : 'bg-red-100 text-[#e5322d]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#e5322d] hover:bg-[#cc2c28] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select PDF file
              </button>
              <p className="text-gray-400 font-medium mt-6">or drop PDFs here</p>

              {error && (
                <div className="absolute bottom-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm z-20">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= STATE 2: SETTINGS / PREVIEW ================= */}
        {appState === 'settings' && file && (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            
            {/* Left: File Preview */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative group">
              <button onClick={resetApp} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors z-10">
                <X size={20} />
              </button>
              
              <div className="w-40 h-52 bg-white shadow-md border border-gray-200 flex flex-col relative group-hover:-translate-y-2 transition-transform duration-300">
                <div className="flex-1 flex items-center justify-center bg-gray-50 border-b border-gray-100 text-[#e5322d]">
                  <FileImage size={48} strokeWidth={1.5} />
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
                <h2 className="text-xl font-bold text-gray-800">PDF to JPG options</h2>
              </div>
              
              <div className="p-6 flex-1 space-y-4">
                {/* Option 1 */}
                <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${mode === 'pages' ? 'border-[#e5322d] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-start gap-4">
                    <input type="radio" name="mode" className="mt-1 w-5 h-5 accent-[#e5322d]" checked={mode === 'pages'} onChange={() => setMode('pages')} />
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2"><Layers size={18} className="text-[#e5322d]" /> Page to JPG</h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">All pages of this PDF will be converted into individual JPG files.</p>
                    </div>
                  </div>
                </label>

                {/* Option 2 */}
                <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${mode === 'extract' ? 'border-[#e5322d] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-start gap-4">
                    <input type="radio" name="mode" className="mt-1 w-5 h-5 accent-[#e5322d]" checked={mode === 'extract'} onChange={() => setMode('extract')} />
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2"><ImageIcon size={18} className="text-[#e5322d]" /> Extract images</h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">All embedded images inside the PDF will be extracted as JPGs.</p>
                    </div>
                  </div>
                </label>

                {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button 
                  onClick={startConversion}
                  className="w-full bg-[#e5322d] hover:bg-[#cc2c28] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  Convert to JPG <ArrowLeft className="rotate-180" size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STATE 3: CONVERTING ================= */}
        {appState === 'converting' && (
          <div className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
            <Loader2 className="w-16 h-16 text-[#e5322d] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Processing Document</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#e5322d] h-3 rounded-full transition-all duration-500 ease-out relative" 
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
            <h2 className="text-4xl font-black text-[#33333b] mb-4">Task Complete!</h2>
            <p className="text-[#707079] text-xl mb-10">Your PDF has been successfully converted to JPGs.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={resetApp}
                className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold text-lg transition-all"
              >
                Convert another PDF
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
        <PdfToJpgContent />

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