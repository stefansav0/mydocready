"use client";

import React, { useState, useRef } from 'react';
import { FileImage, FileUp, Download, RefreshCw, ArrowLeft, Layers, Image as ImageIcon, FileArchive } from 'lucide-react';
import Link from 'next/link';

// Import libraries
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type ConversionMode = 'pages' | 'extract' | null;

export default function PdfToJpgPro() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<ConversionMode>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Handlers ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError("Please upload a valid PDF file.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
      setMode(null); // Reset mode when new file is uploaded
    }
  };

  // --- Core Conversion Logic ---
  const startConversion = async () => {
    if (!file || !canvasRef.current || !mode) return;
    setIsConverting(true);
    setError(null);
    setProgress({ current: 0, total: 0, status: 'Reading PDF...' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const zip = new JSZip();
      const folderName = `${file.name.split('.')[0]}_Images`;
      const imgFolder = zip.folder(folderName);
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context || !imgFolder) throw new Error("Initialization failed");

      if (mode === 'pages') {
        // MODE 1: Every Page to JPG
        for (let i = 1; i <= totalPages; i++) {
          setProgress({ current: i, total: totalPages, status: `Converting page ${i} of ${totalPages}...` });
          
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // Scale 2.0 for high quality
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport, canvas: canvas }).promise;

          // Remove the data:image/jpeg;base64, prefix to save to zip
          const imgData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
          imgFolder.file(`Page_${i}.jpg`, imgData, { base64: true });
        }
      } else {
        // MODE 2: Extract Images (Basic Implementation)
        // Note: Client-side image extraction from raw PDF data is complex due to color spaces. 
        // This renders the page and attempts to capture image objects.
        setProgress({ current: 0, total: totalPages, status: `Scanning pages for images...` });
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
                // Creating a tiny temporary canvas to draw the raw image data
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = imgObj.width;
                tempCanvas.height = imgObj.height;
                const tempCtx = tempCanvas.getContext('2d');
                
                if (tempCtx) {
                  const imageData = new ImageData(new Uint8ClampedArray(imgObj.data), imgObj.width, imgObj.height);
                  tempCtx.putImageData(imageData, 0, 0);
                  const base64Data = tempCanvas.toDataURL('image/jpeg', 0.9).split(',')[1];
                  imgFolder.file(`Extracted_Image_${imageCount}.jpg`, base64Data, { base64: true });
                }
              } catch (e) {
                console.warn("Could not extract a specific image object", e);
              }
            }
          }
        }
        
        if (imageCount === 0) {
          throw new Error("No extractable images found in this PDF.");
        }
      }

      // Generate ZIP and Download
      setProgress({ current: totalPages, total: totalPages, status: 'Zipping files...' });
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `${folderName}.zip`);

      setIsConverting(false);
      setProgress({ current: 0, total: 0, status: '' });
      setMode(null);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process PDF. It might be corrupted or heavily encrypted.");
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans flex flex-col items-center py-12">
      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="max-w-4xl w-full space-y-8">
        <Link href="/converter" className="inline-flex items-center text-gray-500 hover:text-gray-800 font-bold transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Hub
        </Link>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl mb-2">
            <FileImage size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">PDF to JPG</h1>
          <p className="text-gray-500 text-lg">Convert every page to a JPG or extract all embedded images instantly.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
          
          {/* STEP 1: UPLOAD FILE */}
          {!file ? (
            <div className="border-3 border-dashed border-orange-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-orange-50/50 hover:bg-orange-50 transition-colors relative group">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf" onChange={handleFileSelect} />
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform text-orange-500">
                <FileUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Select a PDF file</h3>
              <p className="text-gray-500 text-sm">Secure, local conversion.</p>
              {error && <p className="text-red-500 font-bold mt-4 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* File Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800 truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {!isConverting && (
                  <button onClick={() => { setFile(null); setMode(null); }} className="text-gray-400 hover:text-red-500 font-bold text-sm bg-white border px-3 py-1.5 rounded-lg shadow-sm">Remove</button>
                )}
              </div>

              {/* STEP 2: CHOOSE MODE */}
              {!mode && !isConverting ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95">
                  <button 
                    onClick={() => setMode('pages')}
                    className="border-2 border-gray-200 hover:border-orange-500 rounded-2xl p-8 text-left transition-all hover:shadow-md group"
                  >
                    <Layers className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Page to JPG</h3>
                    <p className="text-gray-500 text-sm">Convert every single page of this PDF into its own high-quality JPG image.</p>
                  </button>

                  <button 
                    onClick={() => setMode('extract')}
                    className="border-2 border-gray-200 hover:border-orange-500 rounded-2xl p-8 text-left transition-all hover:shadow-md group"
                  >
                    <ImageIcon className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Extract Images</h3>
                    <p className="text-gray-500 text-sm">Scan the PDF and pull out only the photos and images embedded inside it.</p>
                  </button>
                </div>
              ) : null}

              {/* STEP 3: CONVERTING & PROGRESS */}
              {mode && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {isConverting && (
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl space-y-3">
                      <div className="flex justify-between text-sm font-bold text-blue-800">
                        <span>{progress.status}</span>
                        <span>{Math.round((progress.current / progress.total) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {error && <div className="p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200">{error}</div>}

                  <button 
                    onClick={startConversion} disabled={isConverting}
                    className={`w-full py-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isConverting ? 'bg-orange-400 text-white cursor-not-allowed opacity-50' : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-[0.99]'}`}
                  >
                    {isConverting ? (
                      <><RefreshCw className="animate-spin" size={24} /> Compressing...</>
                    ) : (
                      <><FileArchive size={24} /> Convert & Download ZIP</>
                    )}
                  </button>
                  
                  {!isConverting && (
                    <button onClick={() => setMode(null)} className="w-full text-gray-400 font-bold hover:text-gray-600 text-sm">Change Mode</button>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}