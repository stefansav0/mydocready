"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { trimWhitespace } from '../../utils/image';
import { Camera, Image as ImageIcon, Download, Trash2, UploadCloud, X, Loader2, Plus } from 'lucide-react';

// Define our item type to handle previews without memory leaks
type ScanItem = {
  id: string;
  file: File;
  preview: string;
};

export default function IdCardScanClient() {
  const [items, setItems] = useState<ScanItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup object URLs to prevent memory leaks when component unmounts
  useEffect(() => {
    return () => {
      items.forEach(item => URL.revokeObjectURL(item.preview));
      closeCamera();
    };
  }, [items]);

  // Handle adding files safely
  const addFiles = useCallback((filesList: FileList | File[]) => {
    const newItems = Array.from(filesList).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file)
    }));
    setItems(prev => [...prev, ...newItems]);
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      addFiles(e.target.files);
    }
  }

  function removeAt(idToRemove: string) {
    setItems(prev => {
      const filtered = prev.filter(item => item.id !== idToRemove);
      // Clean up the URL for the removed item
      const removedItem = prev.find(item => item.id === idToRemove);
      if (removedItem) URL.revokeObjectURL(removedItem.preview);
      return filtered;
    });
  }

  function clearAll() {
    items.forEach(item => URL.revokeObjectURL(item.preview));
    setItems([]);
  }

  // --- Drag and Drop Handlers ---
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  // --- Camera Functions ---
  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOpen(true);
    } catch (e) {
      console.error(e);
      alert('Could not access camera. Please check permissions.');
    }
  }

  function closeCamera() {
    setCameraOpen(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }

  async function takePhoto() {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return alert('Canvas not supported');
    
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.92));
    
    if (!blob) return alert('Capture failed');
    const file = new File([blob], `scanned-id-${Date.now()}.jpg`, { type: 'image/jpeg' });
    addFiles([file]);
    closeCamera();
  }

  // --- PDF Export ---
  async function downloadPdf() {
    if (items.length === 0) return;
    setProcessing(true);
    
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      
      const fileToCanvas = (file: File): Promise<HTMLCanvasElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || img.width;
              canvas.height = img.naturalHeight || img.height;
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Canvas not supported'));
              ctx.drawImage(img, 0, 0);
              URL.revokeObjectURL(img.src);
              resolve(canvas);
            } catch (e) {
              reject(e);
            }
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = URL.createObjectURL(file);
        });
      };

      for (let i = 0; i < items.length; i++) {
        const canvas = await fileToCanvas(items[i].file);
        const trimmed = trimWhitespace(canvas); // Assuming this returns a canvas
        const dataUrl = trimmed.toDataURL('image/jpeg', 0.92);
        const imgProps = (doc as any).getImageProperties(dataUrl);
        
        // A4 size logic with margins
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40; 
        
        const maxW = pageWidth - (margin * 2);
        const maxH = pageHeight - (margin * 2);
        
        let pdfWidth = imgProps.width;
        let pdfHeight = imgProps.height;
        
        // Scale down to fit within page margins if necessary
        if (pdfWidth > maxW || pdfHeight > maxH) {
          const ratio = Math.min(maxW / pdfWidth, maxH / pdfHeight);
          pdfWidth = pdfWidth * ratio;
          pdfHeight = pdfHeight * ratio;
        }

        // Center horizontally and vertically
        const xOffset = (pageWidth - pdfWidth) / 2;
        const yOffset = (pageHeight - pdfHeight) / 2;

        if (i > 0) doc.addPage();
        doc.addImage(dataUrl, 'JPEG', xOffset, yOffset, pdfWidth, pdfHeight);
      }

      doc.save(`ID_Scans_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Make sure jspdf is installed.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <ImageIcon className="text-blue-600" size={24} />
            ID Scanner
          </h2>
          <p className="text-sm text-gray-500 mt-1">Capture or upload ID cards to export as a clean PDF.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button 
              onClick={clearAll} 
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
          <button 
            disabled={items.length === 0 || processing} 
            onClick={downloadPdf} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            {processing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {processing ? 'Processing...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Main Upload / Camera Area */}
      {!cameraOpen ? (
        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input 
            type="file" 
            id="file-upload" 
            multiple 
            accept="image/*" 
            onChange={handleInput} 
            className="hidden" 
          />
          
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
              <UploadCloud size={32} className="text-gray-400" />
            </div>
            <div>
              <p className="text-gray-700 font-medium">Drag & drop your images here</p>
              <p className="text-sm text-gray-500 mt-1">or use the buttons below to add files</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Browse Files
              </label>
              <span className="text-gray-400 text-sm">OR</span>
              <button 
                onClick={openCamera} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Camera size={16} />
                Open Camera
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center shadow-lg border border-gray-800">
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover" 
            playsInline 
            autoPlay 
            muted 
          />
          
          {/* Camera Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 z-10">
            <button 
              onClick={closeCamera} 
              className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all"
              title="Close Camera"
            >
              <X size={24} />
            </button>
            <button 
              onClick={takePhoto} 
              className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:scale-105 active:scale-95 shadow-xl transition-all"
              title="Take Photo"
            />
            {/* Empty div for flex spacing alignment */}
            <div className="w-[48px]"></div> 
          </div>
        </div>
      )}

      {/* Scanned Items Grid */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Scanned Documents ({items.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative bg-white border border-gray-200 p-2 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={item.preview} 
                    alt={`Scanned document ${index + 1}`} 
                    className="w-full h-full object-contain" 
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => removeAt(item.id)} 
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
                      title="Remove image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 px-1">
                  <p className="text-xs font-medium text-gray-600 truncate" title={item.file.name}>
                    {item.file.name || `Scanned Capture ${index + 1}`}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}