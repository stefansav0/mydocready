"use client";

import { useState, useCallback, useRef, useEffect, ChangeEvent } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { 
  UploadCloud, 
  Download, 
  Sun, 
  Contrast, 
  Droplet, 
  RotateCw, 
  FlipHorizontal,
  FlipVertical,
  Palette,
  Image as ImageIcon,
  Crop as CropIcon,
  Settings2,
  RefreshCcw,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

// Helper to calculate centered crop based on aspect ratio
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  
  const [activeTab, setActiveTab] = useState<'adjust' | 'crop'>('adjust');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Transform State (Applied before cropping)
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  
  // Adjust State (CSS Filters applied visually, then baked on export)
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(false);
  
  // Crop State
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  // 1. Handle File Upload
  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
    
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setSourceImageUrl(url);
    resetAllSettings();
  }, []);

  const resetAllSettings = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(false);
    setRotation(0);
    setFlipX(1);
    setFlipY(1);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setAspect(undefined);
    setActiveTab('adjust');
  };

  // 2. Bake Rotation/Flipping into a new image URL so ReactCrop handles it flawlessly
  useEffect(() => {
    if (!sourceImageUrl) return;
    
    setIsProcessing(true);
    const img = new Image();
    img.src = sourceImageUrl;
    img.onload = () => {
      if (rotation === 0 && flipX === 1 && flipY === 1) {
        setProcessedImageUrl(sourceImageUrl);
        setIsProcessing(false);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const isRotated = rotation === 90 || rotation === 270;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipX, flipY);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob((blob) => {
        if (blob) {
          setProcessedImageUrl(URL.createObjectURL(blob));
          // Reset crop box since dimensions changed
          setCrop(undefined); 
          setCompletedCrop(undefined);
        }
        setIsProcessing(false);
      }, "image/png"); 
    };
  }, [sourceImageUrl, rotation, flipX, flipY]);

  // Handle Preset Aspect Ratio Clicks
  const handlePresetAspect = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (newAspect && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    } else {
      setCrop(undefined);
    }
  };

  // 3. Export Logic (Combines Crop + Filters)
  const handleDownload = async () => {
    if (!processedImageUrl || !file) return;

    const img = new Image();
    img.src = processedImageUrl;
    await new Promise((r) => (img.onload = r));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to crop size, or full image size
    const targetWidth = completedCrop?.width || img.width;
    const targetHeight = completedCrop?.height || img.height;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Apply CSS filters to context
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${grayscale ? 'grayscale(100%)' : ''}`;

    // Draw the specific cropped region (or full image)
    if (completedCrop && completedCrop.width && completedCrop.height) {
      ctx.drawImage(
        img,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        targetWidth,
        targetHeight
      );
    } else {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    }

    // Export and trigger download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `edited_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, file.type, 0.95);
  };

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Pro Document <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">Editor</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Crop perfectly, fix lighting, and align your official photos right in your browser.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* --- LEFT COLUMN: CONTROLS --- */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-white text-base">
                  <Settings2 className="w-5 h-5 text-violet-400" />
                  Workspace Tools
                </CardTitle>
                {sourceImageUrl && (
                  <button onClick={resetAllSettings} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                    <RefreshCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
              
              <CardContent className="p-6 space-y-8 bg-white flex-1 overflow-y-auto">
                
                {/* Upload Zone (Hides when image is loaded) */}
                {!sourceImageUrl && (
                  <div 
                    onDragOver={handleDragOver} 
                    onDragLeave={handleDragLeave} 
                    onDrop={handleDrop} 
                    className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${ 
                      isDragging 
                      ? "border-violet-500 bg-violet-50 ring-4 ring-violet-500/20 scale-[1.02]" 
                      : "border-slate-300 hover:border-violet-400 hover:bg-slate-50" 
                    }`} 
                  >
                    <div className="p-4 rounded-full mb-4 bg-violet-100 group-hover:bg-violet-200 transition-colors">
                      <UploadCloud className="h-8 w-8 text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">Click or drag image here</h3>
                    <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP</p>
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files?.[0] || null)} />
                  </div>
                )}

                {sourceImageUrl && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    
                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setActiveTab('adjust')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'adjust' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <Sliders className="w-4 h-4" /> Adjust
                      </button>
                      <button 
                        onClick={() => setActiveTab('crop')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'crop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <CropIcon className="w-4 h-4" /> Crop & Align
                      </button>
                    </div>

                    {/* Adjust Mode */}
                    {activeTab === 'adjust' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Label className="text-slate-700 flex items-center gap-2"><Sun className="w-4 h-4 text-slate-400"/> Brightness</Label>
                            <span className="text-xs text-slate-400 font-mono">{brightness}%</span>
                          </div>
                          <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-violet-600" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Label className="text-slate-700 flex items-center gap-2"><Contrast className="w-4 h-4 text-slate-400"/> Contrast</Label>
                            <span className="text-xs text-slate-400 font-mono">{contrast}%</span>
                          </div>
                          <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-violet-600" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Label className="text-slate-700 flex items-center gap-2"><Droplet className="w-4 h-4 text-slate-400"/> Saturation</Label>
                            <span className="text-xs text-slate-400 font-mono">{saturation}%</span>
                          </div>
                          <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full accent-violet-600" />
                        </div>

                        <div className="pt-2">
                          <Toggle pressed={grayscale} onPressedChange={setGrayscale} className="w-full gap-2 border border-slate-200 data-[state=on]:bg-slate-900 data-[state=on]:text-white h-11">
                            Convert to Black & White
                          </Toggle>
                        </div>
                      </div>
                    )}

                    {/* Crop & Align Mode */}
                    {activeTab === 'crop' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="space-y-3">
                          <Label className="text-slate-700 font-semibold">Aspect Ratio</Label>
                          <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => handlePresetAspect(undefined)} className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-colors ${!aspect ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                              <CropIcon className="w-5 h-5 mb-1" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Free</span>
                            </button>
                            <button onClick={() => handlePresetAspect(1)} className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-colors ${aspect === 1 ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                              <Square className="w-5 h-5 mb-1" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">1:1</span>
                            </button>
                            <button onClick={() => handlePresetAspect(16/9)} className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-colors ${aspect === 16/9 ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                              <RectangleHorizontal className="w-5 h-5 mb-1" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">16:9</span>
                            </button>
                            <button onClick={() => handlePresetAspect(3.5/4.5)} className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-colors ${aspect === 3.5/4.5 ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                              <RectangleVertical className="w-5 h-5 mb-1" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Pass</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <Label className="text-slate-700 font-semibold">Transform Image</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={() => setRotation((r) => (r + 90) % 360)} className="w-full gap-2 border-slate-200 text-slate-700 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200">
                              <RotateCw className="w-4 h-4" /> Rotate 90°
                            </Button>
                            <Button variant="outline" onClick={() => setFlipX((f) => f * -1)} className="w-full gap-2 border-slate-200 text-slate-700 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200">
                              <FlipHorizontal className="w-4 h-4" /> Flip Horiz
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-6">
                      <Button onClick={handleDownload} className="w-full h-12 text-base font-semibold bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200">
                        <Download className="w-5 h-5 mr-2" /> Export Image
                      </Button>
                    </div>

                  </div>
                )}
                
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN: PREVIEW --- */}
          <div className="lg:col-span-8">
            <Card className="border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center z-10">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <ImageIcon className="w-5 h-5 text-violet-400" />
                  Live Preview
                </CardTitle>
                
                {sourceImageUrl && (
                  <div className="flex gap-3 items-center">
                    {completedCrop && (
                      <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1 rounded text-xs font-mono tracking-wide">
                        {Math.round(completedCrop.width)} x {Math.round(completedCrop.height)} px
                      </span>
                    )}
                    <div className="relative overflow-hidden cursor-pointer">
                      <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors border border-slate-700">
                        <UploadCloud className="w-3 h-3" /> Change Photo
                      </button>
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                )}
              </div>
              
              <CardContent className="p-0 flex-1 relative bg-slate-800">
                {/* Checkerboard Background for visibility */}
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #1e293b 25%, transparent 25%), 
                      linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #1e293b 75%), 
                      linear-gradient(-45deg, transparent 75%, #1e293b 75%)
                    `,
                    backgroundSize: '24px 24px',
                    backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
                    backgroundColor: '#0f172a'
                  }}
                />

                <div className="absolute inset-0 z-10 flex items-center justify-center p-6 overflow-hidden">
                  {processedImageUrl ? (
                    <div className={`relative max-w-full max-h-full transition-opacity duration-300 ${isProcessing ? 'opacity-50' : 'opacity-100'}`}>
                      {/* ReactCrop handles the cropping overlay */}
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        disabled={activeTab !== 'crop'} // Disable drawing new crops if in Adjust mode
                        className={activeTab === 'adjust' ? 'pointer-events-none' : ''} // Optional visual cue
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          ref={imgRef}
                          src={processedImageUrl}
                          alt="Editor Preview"
                          style={{
                            maxHeight: 'calc(100vh - 250px)',
                            objectFit: 'contain',
                            // We apply the CSS filters here so the user sees them live inside the crop box
                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${grayscale ? 'grayscale(100%)' : ''}`
                          }}
                          className="shadow-2xl border border-slate-700/50 rounded"
                        />
                      </ReactCrop>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 bg-slate-900/50 p-8 rounded-2xl backdrop-blur-sm border border-slate-700/50">
                      <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-medium text-lg text-slate-300 mb-1">No Image Selected</p>
                      <p className="text-sm">Upload a photo to start editing</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}