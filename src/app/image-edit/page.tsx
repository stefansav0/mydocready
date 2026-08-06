"use client";

import { useState, useCallback, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { 
  UploadCloud, Download, RotateCw, FlipHorizontal, Type,
  Crop as CropIcon, Layers, Sliders, Sparkles, CircleDashed, Eraser, Zap, 
  Aperture, Undo2, Redo2, Scissors, Play, Trash2, HelpCircle, CheckCircle2, 
  Save
} from "lucide-react";

// Helper to center crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

const FILTER_PRESETS = {
  Original: { brightness: 100, contrast: 100, saturation: 100, sepia: 0, hueRotate: 0, grayscale: false, temp: 0, tint: 0 },
  Cinematic: { brightness: 95, contrast: 125, saturation: 110, sepia: 10, hueRotate: 15, grayscale: false, temp: 10, tint: -5 },
  Portrait: { brightness: 105, contrast: 95, saturation: 90, sepia: 5, hueRotate: 0, grayscale: false, temp: 5, tint: 5 },
  Vintage: { brightness: 110, contrast: 90, saturation: 85, sepia: 40, hueRotate: -10, grayscale: false, temp: 20, tint: 10 },
  Cyberpunk: { brightness: 100, contrast: 120, saturation: 140, sepia: 0, hueRotate: 280, grayscale: false, temp: -20, tint: 30 },
  Film: { brightness: 105, contrast: 115, saturation: 85, sepia: 15, hueRotate: 0, grayscale: false, temp: 5, tint: 15 },
};

// Text Layer Interface
interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  fontFamily: string;
  bold: boolean;
}

export default function UltimatePremiumEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string>("");
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
  
  const [activeTab, setActiveTab] = useState<'transform' | 'ai' | 'presets' | 'adjust' | 'retouch' | 'text' | 'export'>('transform');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Transform
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  
  // Adjust: Light, Color, Effects
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [temp, setTemp] = useState(0); 
  const [tint, setTint] = useState(0); 
  const [sepia, setSepia] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [grain, setGrain] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  
  // Text Layers
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  
  // Brushes (Retouch/Liquify)
  const [activeBrushTool, setActiveBrushTool] = useState<'heal' | 'smooth' | null>(null);
  const [brushSize, setBrushSize] = useState(50);
  const [brushStrength, setBrushStrength] = useState(50);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // AI & BG Removal States
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [bgRemoved, setBgRemoved] = useState(false);
  const [bgThreshold, setBgThreshold] = useState<number>(20);
  const [beforeAfter, setBeforeAfter] = useState(false);

  // Export & Crop
  const [exportScale, setExportScale] = useState(1);
  const [exportFormat, setExportFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');
  const [exportQuality, setExportQuality] = useState(90);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- Core Handlers ---
  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setSourceImageUrl(url);
    resetAllSettings();
  }, []);

  const handleRemoveImage = () => {
    setFile(null);
    setSourceImageUrl("");
    setProcessedImageUrl("");
    resetAllSettings();
  };

  const resetAllSettings = () => {
    applyPreset('Original');
    setBlur(0); setVignette(0); setGrain(0); setRotation(0); setFlipX(1); setFlipY(1);
    setCrop(undefined); setCompletedCrop(undefined); setAspect(undefined);
    setExportScale(1); setActiveBrushTool(null); setTextLayers([]); setBgRemoved(false);
    setActiveTab('transform');
    clearDrawCanvas();
  };

  const applyPreset = (presetName: keyof typeof FILTER_PRESETS) => {
    const p = FILTER_PRESETS[presetName];
    setBrightness(p.brightness); setContrast(p.contrast); setSaturation(p.saturation);
    setSepia(p.sepia); setHueRotate(p.hueRotate); setGrayscale(p.grayscale);
    setTemp(p.temp); setTint(p.tint);
  };

  // --- REAL BACKGROUND REMOVAL ENGINE ---
  const performBgRemoval = async () => {
    if (!processedImageUrl && !sourceImageUrl) return;
    setIsAiProcessing(true);
    setAiMessage("Analyzing background pixels...");

    setTimeout(async () => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = processedImageUrl || sourceImageUrl;
        await new Promise((res) => { img.onload = res; });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Sample background colors from 4 corners
        const corners = [
          [0, 0], [img.width - 1, 0], 
          [0, img.height - 1], [img.width - 1, img.height - 1]
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        corners.forEach(([x, y]) => {
          const idx = (y * img.width + x) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR /= 4; bgG /= 4; bgB /= 4;

        const maxDiff = bgThreshold * 3.5;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate color distance from detected background
          const diff = Math.sqrt(
            Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
          );

          if (diff < maxDiff) {
            // Smooth edge transparency falloff
            const alphaFactor = Math.max(0, (diff / maxDiff));
            data[i + 3] = alphaFactor < 0.2 ? 0 : Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imgData, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const newUrl = URL.createObjectURL(blob);
            setProcessedImageUrl(newUrl);
            setBgRemoved(true);
            setExportFormat('image/png'); // Preserve alpha on export
          }
          setIsAiProcessing(false);
        }, "image/png");

      } catch (err) {
        console.error("BG Removal Error:", err);
        setIsAiProcessing(false);
      }
    }, 300);
  };

  const runAITool = (toolName: string) => {
    if (toolName === 'Auto Color') {
      setIsAiProcessing(true);
      setAiMessage("Applying neural color balance...");
      setTimeout(() => {
        setIsAiProcessing(false);
        applyPreset('Film');
      }, 1000);
    }
  };

  const addTextLayer = () => {
    setTextLayers([...textLayers, {
      id: Math.random().toString(36).substr(2, 9),
      text: "NEW TEXT", x: 50, y: 50, size: 40, color: "#111827", fontFamily: "Inter", bold: true
    }]);
  };
  
  const updateTextLayer = (id: string, key: keyof TextLayer, value: any) => {
    setTextLayers(textLayers.map(t => t.id === id ? { ...t, [key]: value } : t));
  };
  
  const removeTextLayer = (id: string) => setTextLayers(textLayers.filter(t => t.id !== id));

  // Base Image Rotation & Flip Processing
  useEffect(() => {
    if (!sourceImageUrl) return;
    setIsProcessing(true);
    const img = new Image();
    img.src = sourceImageUrl;
    img.onload = () => {
      if (rotation === 0 && flipX === 1 && flipY === 1) {
        setProcessedImageUrl(sourceImageUrl);
        setIsProcessing(false); return;
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
          setCrop(undefined); setCompletedCrop(undefined);
        }
        setIsProcessing(false);
      }, "image/png"); 
    };
  }, [sourceImageUrl, rotation, flipX, flipY]);

  // Handle Preset Aspect Ratio
  const handlePresetAspect = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (newAspect && imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, newAspect);
      setCrop(newCrop);
      setCompletedCrop({
        x: (newCrop.x / 100) * width, y: (newCrop.y / 100) * height,
        width: (newCrop.width / 100) * width, height: (newCrop.height / 100) * height, unit: 'px'
      });
    } else {
      setCrop(undefined); setCompletedCrop(undefined);
    }
  };

  // --- REAL PIXEL RETOUCH & BRUSH ENGINE ---
  const handleCanvasMouse = (e: ReactMouseEvent<HTMLCanvasElement>, type: 'down' | 'move' | 'up') => {
    if (!activeBrushTool) return;
    if (type === 'down') setIsDrawing(true);
    if (type === 'up') { setIsDrawing(false); return; }
    if (type === 'move' && !isDrawing) return;

    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // For touch devices if needed, but primarily mouse driven
    const clientX = 'touches' in e ? (e as any).touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? (e as any).touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = activeBrushTool === 'heal' ? `rgba(239, 68, 68, 0.4)` : `rgba(99, 102, 241, 0.4)`;
    ctx.fill();
  };

  // Bakes the drawn retouch mask directly onto the image canvas
  const applyRetouchToImage = async () => {
    if (!drawCanvasRef.current || !imgRef.current) return;
    setIsAiProcessing(true);
    setAiMessage("Baking pixel edits...");

    setTimeout(() => {
      try {
        const maskCanvas = drawCanvasRef.current;
        const img = imgRef.current;
        if (!maskCanvas || !img) return;

        const mainCanvas = document.createElement("canvas");
        mainCanvas.width = img.naturalWidth;
        mainCanvas.height = img.naturalHeight;
        const ctx = mainCanvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        // Apply spot-healing or smoothing pixel averaging over drawn mask
        const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        const maskCtx = maskCanvas.getContext("2d");
        if (!maskCtx) return;

        const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        const scaleX = mainCanvas.width / maskCanvas.width;
        const scaleY = mainCanvas.height / maskCanvas.height;

        for (let my = 0; my < maskCanvas.height; my += 2) {
          for (let mx = 0; mx < maskCanvas.width; mx += 2) {
            const maskIdx = (my * maskCanvas.width + mx) * 4;
            if (maskData.data[maskIdx + 3] > 0) { 
              const px = Math.floor(mx * scaleX);
              const py = Math.floor(my * scaleY);
              const imgIdx = (py * mainCanvas.width + px) * 4;

              if (activeBrushTool === 'heal') {
                const leftIdx = Math.max(0, imgIdx - 16);
                const rightIdx = Math.min(imgData.data.length - 4, imgIdx + 16);
                imgData.data[imgIdx] = (imgData.data[leftIdx] + imgData.data[rightIdx]) / 2;
                imgData.data[imgIdx + 1] = (imgData.data[leftIdx + 1] + imgData.data[rightIdx + 1]) / 2;
                imgData.data[imgIdx + 2] = (imgData.data[leftIdx + 2] + imgData.data[rightIdx + 2]) / 2;
              } else {
                const blurR = (imgData.data[imgIdx] + imgData.data[imgIdx + 4] + imgData.data[imgIdx - 4]) / 3;
                imgData.data[imgIdx] = blurR;
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        mainCanvas.toBlob((blob) => {
          if (blob) {
            setProcessedImageUrl(URL.createObjectURL(blob));
            clearDrawCanvas();
          }
          setIsAiProcessing(false);
        }, "image/png");

      } catch (err) {
        console.error("Retouch error:", err);
        setIsAiProcessing(false);
      }
    }, 200);
  };

  const clearDrawCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Export Logic
  const handleDownload = () => {
    if (!imgRef.current || !processedImageUrl || !file) return;

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = (img.naturalWidth / img.width) * exportScale;
    const scaleY = (img.naturalHeight / img.height) * exportScale;
    const scaledBlur = blur * Math.max(scaleX, scaleY);

    const sepiaAdjust = temp > 0 ? temp * 0.5 : 0; 
    const hueAdjust = hueRotate + (tint * 0.5);
    
    let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia + sepiaAdjust}%) hue-rotate(${hueAdjust}deg) blur(${scaledBlur}px)`;
    if (grayscale) filterStr += ' grayscale(100%)';
    ctx.filter = filterStr;

    let cWidth = img.naturalWidth * exportScale;
    let cHeight = img.naturalHeight * exportScale;
    let drawX = 0, drawY = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;

    if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      cWidth = completedCrop.width * scaleX / exportScale;
      cHeight = completedCrop.height * scaleY / exportScale;
      drawX = completedCrop.x * scaleX / exportScale;
      drawY = completedCrop.y * scaleY / exportScale;
      sWidth = completedCrop.width * scaleX / exportScale;
      sHeight = completedCrop.height * scaleY / exportScale;
    }

    canvas.width = cWidth; canvas.height = cHeight;
    ctx.drawImage(img, drawX, drawY, sWidth, sHeight, 0, 0, cWidth, cHeight);

    if (vignette > 0) {
      const gradient = ctx.createRadialGradient(cWidth/2, cHeight/2, 0, cWidth/2, cHeight/2, Math.max(cWidth, cHeight)/2);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cWidth, cHeight);
    }

    if (grain > 0) {
      const imgData = ctx.getImageData(0, 0, cWidth, cHeight);
      const data = imgData.data;
      const grainIntensity = grain * 2.5; 
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * grainIntensity;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);
    }

    ctx.filter = 'none'; 
    textLayers.forEach(layer => {
      ctx.font = `${layer.bold ? 'bold ' : ''}${layer.size * exportScale}px ${layer.fontFamily}`;
      ctx.fillStyle = layer.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const actualX = (layer.x / 100) * cWidth;
      const actualY = (layer.y / 100) * cHeight;
      ctx.fillText(layer.text, actualX, actualY);
    });

    const extension = exportFormat.split('/')[1];
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `StudioExport_${file.name.split('.')[0]}_${exportScale}x.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, exportFormat, exportQuality / 100);
  };

  const dynamicFilter = beforeAfter 
    ? 'none' 
    : `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia + (temp > 0 ? temp*0.5 : 0)}%) hue-rotate(${hueRotate + (tint*0.5)}deg) blur(${blur}px) ${grayscale ? 'grayscale(100%)' : ''}`;

  return (
    <div className="w-full min-h-screen bg-[#f4f6fa] flex flex-col font-sans text-slate-800">
      
      {/* Hide scrollbars for the tabs globally */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* ========================================================================= */}
      {/* TOP EDITOR WORKSPACE */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1600px] mx-auto p-2 sm:p-6 lg:p-8 pt-4 sm:pt-8 flex flex-col gap-8 flex-shrink-0">
        
        <div 
          className="w-full bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden relative z-0"
          style={{ height: '85vh', minHeight: '600px', maxHeight: '1200px' }}
        >
          {/* TOP NAVBAR */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 shrink-0 z-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Aperture className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-slate-900 font-bold tracking-widest uppercase text-[10px] sm:text-xs">Studio Pro</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex bg-slate-50 rounded-lg p-1 border border-slate-200">
                <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors"><Undo2 className="w-4 h-4"/></button>
                <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors"><Redo2 className="w-4 h-4"/></button>
              </div>

              {sourceImageUrl && (
                <div className="flex items-center gap-2">
                  <button onClick={handleRemoveImage} className="w-8 h-8 sm:w-auto sm:h-9 sm:px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 flex items-center justify-center gap-1.5 transition-all">
                    <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> 
                    <span className="hidden sm:inline text-xs font-bold">Delete</span>
                  </button>

                  <button onClick={handleDownload} className="h-8 px-3 sm:h-9 sm:px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-xs font-bold rounded-lg shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all">
                    <Download className="hidden sm:block w-3.5 h-3.5" /> 
                    <span className="hidden sm:inline">Export Media</span> 
                    <span className="sm:hidden flex items-center gap-1"><Download className="w-3 h-3"/> Save</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* RESPONSIVE FLEX LAYOUT */}
          {/* Mobile: Canvas -> Settings -> Tabs */}
          {/* Desktop: Tabs -> Settings -> Canvas */}
          <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden min-h-0 min-w-0">
            
            {/* TABS SIDEBAR (Order 3 on Mobile, Order 1 on Desktop) */}
            <aside className="order-3 lg:order-1 w-full lg:w-[80px] h-[70px] lg:h-auto bg-slate-50 border-t lg:border-t-0 lg:border-r border-slate-200 flex flex-row lg:flex-col items-center justify-start lg:py-6 gap-1 sm:gap-2 overflow-x-auto lg:overflow-y-auto hide-scrollbar z-20 px-2 sm:px-4 lg:px-0 shrink-0">
              {[
                { id: 'transform', icon: CropIcon, label: 'Layout' },
                { id: 'ai', icon: Sparkles, label: 'AI Magic', color: 'text-indigo-600' },
                { id: 'presets', icon: Layers, label: 'LUTs' },
                { id: 'adjust', icon: Sliders, label: 'Color' },
                { id: 'retouch', icon: Eraser, label: 'Retouch' },
                { id: 'text', icon: Type, label: 'Titles' },
                { id: 'export', icon: Save, label: 'Render' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setActiveBrushTool(null); }} 
                  className={`flex flex-col items-center justify-center gap-1.5 w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0 transition-all ${activeTab === tab.id ? 'bg-white border border-slate-200 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
                >
                  <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${tab.color && activeTab !== tab.id ? tab.color : ''}`} />
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
                </button>
              ))}
            </aside>

            {/* SETTINGS CONTROLS PANEL (Order 2 on Mobile, Order 2 on Desktop) */}
            <section className="order-2 lg:order-2 w-full lg:w-[320px] h-[35vh] lg:h-auto bg-white border-t lg:border-t-0 lg:border-r border-slate-200 flex flex-col overflow-hidden z-10 shrink-0">
              <div className="h-10 lg:h-12 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-[10px] lg:text-xs text-slate-800 tracking-widest uppercase">{activeTab}</h3>
                {sourceImageUrl && (
                  <button onClick={resetAllSettings} className="text-[10px] text-slate-500 hover:text-red-500 font-medium transition-colors">Reset All</button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar p-4 lg:p-5">
                {!sourceImageUrl ? (
                  <div className="text-center mt-6 lg:mt-10">
                    <UploadCloud className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-slate-400 mb-3" />
                    <p className="text-[10px] lg:text-xs text-slate-500">Import an image to view tools.</p>
                  </div>
                ) : (
                  <div className="pb-8">
                    {/* AI MAGIC */}
                    {activeTab === 'ai' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                          <Sparkles className="w-5 h-5 text-indigo-600 mb-2"/>
                          <h4 className="text-indigo-900 text-xs lg:text-sm font-bold mb-1">Neural BG Removal</h4>
                          <p className="text-[10px] lg:text-xs text-indigo-700/80 leading-relaxed">Automatically detects background elements, isolate subjects, and exports clean transparent PNGs.</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] lg:text-[11px] font-medium">
                            <span className="text-slate-700">BG Detection Sensitivity</span>
                            <span className="text-slate-500">{bgThreshold}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="5" 
                            max="50" 
                            value={bgThreshold} 
                            onChange={(e) => setBgThreshold(Number(e.target.value))} 
                            className="w-full accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none" 
                          />
                        </div>

                        <button onClick={performBgRemoval} disabled={isAiProcessing} className="w-full h-10 lg:h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center gap-2 text-[11px] lg:text-xs font-bold text-white transition-all shadow-md">
                          <Scissors className="w-4 h-4"/> Remove Background
                        </button>

                        <button onClick={() => runAITool('Auto Color')} disabled={isAiProcessing} className="w-full h-10 lg:h-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[11px] lg:text-xs font-bold text-slate-700 transition-all">
                          <Play className="w-3.5 h-3.5 text-fuchsia-500"/> Auto Grade (LUT)
                        </button>
                      </div>
                    )}

                    {/* TEXT ENGINE */}
                    {activeTab === 'text' && (
                      <div className="space-y-4 lg:space-y-6 animate-in fade-in duration-300">
                        <button onClick={addTextLayer} className="w-full h-9 lg:h-10 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-[11px] lg:text-xs font-bold text-white flex items-center justify-center gap-2">
                          <Type className="w-3.5 h-3.5"/> Add Text Layer
                        </button>
                        
                        <div className="space-y-3 lg:space-y-4">
                          {textLayers.map((layer, idx) => (
                            <div key={layer.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Layer {idx + 1}</span>
                                <button onClick={() => removeTextLayer(layer.id)} className="text-red-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                              </div>
                              <input type="text" value={layer.text} onChange={(e) => updateTextLayer(layer.id, 'text', e.target.value)} className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500" />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[8px] lg:text-[9px] text-slate-500 uppercase block mb-1">Color</label>
                                  <input type="color" value={layer.color} onChange={(e) => updateTextLayer(layer.id, 'color', e.target.value)} className="w-full h-7 lg:h-8 rounded bg-white border border-slate-300 cursor-pointer" />
                                </div>
                                <div>
                                  <label className="text-[8px] lg:text-[9px] text-slate-500 uppercase block mb-1">Size ({layer.size})</label>
                                  <input type="range" min="10" max="200" value={layer.size} onChange={(e) => updateTextLayer(layer.id, 'size', Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-slate-200 mt-2 rounded-lg appearance-none" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                                <div>
                                  <label className="text-[8px] lg:text-[9px] text-slate-500 uppercase block mb-1">Pos X ({layer.x}%)</label>
                                  <input type="range" min="0" max="100" value={layer.x} onChange={(e) => updateTextLayer(layer.id, 'x', Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-slate-200 mt-1 rounded-lg appearance-none" />
                                </div>
                                <div>
                                  <label className="text-[8px] lg:text-[9px] text-slate-500 uppercase block mb-1">Pos Y ({layer.y}%)</label>
                                  <input type="range" min="0" max="100" value={layer.y} onChange={(e) => updateTextLayer(layer.id, 'y', Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-slate-200 mt-1 rounded-lg appearance-none" />
                                </div>
                              </div>
                            </div>
                          ))}
                          {textLayers.length === 0 && <p className="text-[10px] lg:text-xs text-slate-400 text-center py-4">No text layers active.</p>}
                        </div>
                      </div>
                    )}

                    {/* ADJUST */}
                    {activeTab === 'adjust' && (
                      <div className="space-y-5 lg:space-y-6 animate-in fade-in duration-300">
                        <div className="space-y-3 lg:space-y-4">
                          <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-500">Basic Correction</h4>
                          {[
                            { label: 'Exposure', val: brightness, set: setBrightness, max: 200, color: 'accent-indigo-500' },
                            { label: 'Contrast', val: contrast, set: setContrast, max: 200, color: 'accent-indigo-500' },
                            { label: 'Saturation', val: saturation, set: setSaturation, max: 200, color: 'accent-indigo-500' }
                          ].map(ctrl => (
                            <div key={ctrl.label} className="space-y-1.5">
                              <div className="flex justify-between text-[10px] lg:text-[11px] font-medium"><span className="text-slate-700">{ctrl.label}</span><span className="text-slate-500">{ctrl.val}</span></div>
                              <input type="range" min="0" max={ctrl.max} value={ctrl.val} onChange={(e) => ctrl.set(Number(e.target.value))} className={`w-full ${ctrl.color} h-1 bg-slate-200 rounded-lg appearance-none`} />
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-3 lg:space-y-4 pt-4 border-t border-slate-200">
                          <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-500">Color Wheels (Split Tone)</h4>
                          {[
                            { label: 'Temperature', val: temp, set: setTemp, min: -100, max: 100, color: 'accent-amber-500' },
                            { label: 'Tint', val: tint, set: setTint, min: -100, max: 100, color: 'accent-fuchsia-500' }
                          ].map(ctrl => (
                            <div key={ctrl.label} className="space-y-1.5">
                              <div className="flex justify-between text-[10px] lg:text-[11px] font-medium"><span className="text-slate-700">{ctrl.label}</span><span className="text-slate-500">{ctrl.val}</span></div>
                              <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.val} onChange={(e) => ctrl.set(Number(e.target.value))} className={`w-full ${ctrl.color} h-1 bg-slate-200 rounded-lg appearance-none`} />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-3 lg:space-y-4 pt-4 border-t border-slate-200">
                          <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-500">Cinematic Effects</h4>
                          {[
                            { label: 'Vignette', val: vignette, set: setVignette, min: 0, max: 100, color: 'accent-indigo-500' },
                            { label: 'Film Grain / Noise', val: grain, set: setGrain, min: 0, max: 100, color: 'accent-indigo-500' },
                            { label: 'Lens Blur', val: blur, set: setBlur, min: 0, max: 20, color: 'accent-indigo-500' }
                          ].map(ctrl => (
                            <div key={ctrl.label} className="space-y-1.5">
                              <div className="flex justify-between text-[10px] lg:text-[11px] font-medium"><span className="text-slate-700">{ctrl.label}</span><span className="text-slate-500">{ctrl.val}</span></div>
                              <input type="range" min={ctrl.min} max={ctrl.max} step="0.5" value={ctrl.val} onChange={(e) => ctrl.set(Number(e.target.value))} className={`w-full ${ctrl.color} h-1 bg-slate-200 rounded-lg appearance-none`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TRANSFORM */}
                    {activeTab === 'transform' && (
                      <div className="space-y-5 lg:space-y-6 animate-in fade-in">
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setRotation(r => (r + 90) % 360)} className="h-9 lg:h-10 bg-slate-50 border border-slate-200 rounded-lg text-[11px] lg:text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2"><RotateCw className="w-3.5 h-3.5"/> Rotate</button>
                          <button onClick={() => setFlipX(f => f * -1)} className="h-9 lg:h-10 bg-slate-50 border border-slate-200 rounded-lg text-[11px] lg:text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2"><FlipHorizontal className="w-3.5 h-3.5"/> Flip</button>
                        </div>
                        <div>
                          <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 lg:mb-3">Crop Ratio</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[{v: undefined, l: 'Free'}, {v: 1, l: '1:1 Square'}, {v: 16/9, l: '16:9 Cinema'}, {v: 9/16, l: '9:16 Story'}].map(ar => (
                              <button key={ar.l} onClick={() => handlePresetAspect(ar.v)} className={`h-9 lg:h-10 rounded-lg border text-[10px] lg:text-xs font-bold transition-all ${aspect === ar.v ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{ar.l}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PRESETS */}
                    {activeTab === 'presets' && (
                      <div className="grid grid-cols-2 gap-2 lg:gap-3 animate-in fade-in">
                        {(Object.keys(FILTER_PRESETS) as Array<keyof typeof FILTER_PRESETS>).map(preset => (
                          <button key={preset} onClick={() => applyPreset(preset)} className="relative group rounded-lg border border-slate-200 bg-slate-100 p-1 overflow-hidden h-20 lg:h-24 hover:border-indigo-500">
                            <img src={processedImageUrl} alt={preset} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" style={{ filter: `brightness(${FILTER_PRESETS[preset].brightness}%) contrast(${FILTER_PRESETS[preset].contrast}%) saturate(${FILTER_PRESETS[preset].saturation}%) sepia(${FILTER_PRESETS[preset].sepia}%) hue-rotate(${FILTER_PRESETS[preset].hueRotate}deg)` }} />
                            <span className="absolute bottom-1 left-2 text-[9px] lg:text-[10px] font-bold text-white drop-shadow-md">{preset} LUT</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* RETOUCH */}
                    {activeTab === 'retouch' && (
                      <div className="space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setActiveBrushTool('heal')} className={`h-9 lg:h-10 rounded-lg border text-[10px] lg:text-xs font-bold flex items-center justify-center gap-1.5 ${activeBrushTool === 'heal' ? 'bg-red-50 border-red-300 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}><Zap className="w-3.5 h-3.5"/> Spot Heal</button>
                          <button onClick={() => setActiveBrushTool('smooth')} className={`h-9 lg:h-10 rounded-lg border text-[10px] lg:text-xs font-bold flex items-center justify-center gap-1.5 ${activeBrushTool === 'smooth' ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}><CircleDashed className="w-3.5 h-3.5"/> Smooth</button>
                        </div>
                        {activeBrushTool && (
                          <div className="space-y-4 pt-4 border-t border-slate-200">
                            <input type="range" min="10" max="150" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-slate-200 rounded-lg" />
                            <p className="text-[9px] lg:text-[10px] text-slate-500 text-center">Brush Size: {brushSize}px</p>

                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={applyRetouchToImage} className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] lg:text-xs font-bold rounded-lg transition-all shadow-sm">
                                Apply Edits
                              </button>
                              <button onClick={clearDrawCanvas} className="py-2 border border-slate-300 text-slate-600 text-[10px] lg:text-xs rounded-lg hover:bg-slate-100 transition-colors font-medium">
                                Clear Brush
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* EXPORT */}
                    {activeTab === 'export' && (
                      <div className="space-y-5 lg:space-y-6 animate-in fade-in">
                        <div>
                          <h4 className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-500 mb-2">Format</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {['image/jpeg', 'image/png', 'image/webp'].map(fmt => (
                              <button key={fmt} onClick={() => setExportFormat(fmt as any)} className={`h-8 lg:h-9 rounded-lg border text-[10px] lg:text-xs font-bold ${exportFormat === fmt ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>{fmt.split('/')[1].toUpperCase()}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-500 mb-2">Scale (Upsampling)</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(scale => (
                              <button key={scale} onClick={() => setExportScale(scale)} className={`h-8 lg:h-9 rounded-lg border text-[10px] lg:text-xs font-bold ${exportScale === scale ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>{scale}x</button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] lg:text-[11px]"><span className="text-slate-500">Quality</span><span className="text-slate-700">{exportQuality}%</span></div>
                          <input type="range" min="10" max="100" step="5" value={exportQuality} onChange={(e) => setExportQuality(Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-slate-200 rounded-lg" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* CANVAS WORKSPACE (Order 1 on Mobile, Order 3 on Desktop) */}
            <section className="order-1 lg:order-3 flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center min-h-[30vh] lg:min-h-0 rounded-tr-xl border-b lg:border-b-0 border-slate-200">
              
              {!sourceImageUrl ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <label className="cursor-pointer group flex flex-col items-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 group-hover:border-indigo-500 group-hover:bg-indigo-50 flex items-center justify-center transition-all mb-3 lg:mb-4">
                      <UploadCloud className="w-6 h-6 lg:w-8 lg:h-8 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-slate-600">Click to import media</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
                  </label>
                </div>
              ) : (
                <>
                  {/* Checkered Background Pattern */}
                  <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: `linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)`, backgroundSize: '24px 24px', backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px' }} />

                  {/* Editor Floating Actions Bar (Removed Delete) */}
                  <div className="absolute top-2 lg:top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 sm:gap-2 bg-white/95 backdrop-blur border border-slate-200 p-1 sm:p-1.5 rounded-xl shadow-lg pointer-events-auto whitespace-nowrap">
                     <button 
                        onMouseDown={() => setBeforeAfter(true)} onMouseUp={() => setBeforeAfter(false)}
                        onMouseLeave={() => setBeforeAfter(false)} onTouchStart={() => setBeforeAfter(true)} onTouchEnd={() => setBeforeAfter(false)}
                        className="px-2 sm:px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded active:bg-slate-200 cursor-help"
                      >
                        Compare
                      </button>
                     <div className="w-px h-3 sm:h-4 bg-slate-300"></div>
                     <button onClick={performBgRemoval} className={`px-2 sm:px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 ${bgRemoved ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <Scissors className="w-3 h-3"/> <span className="hidden sm:inline">Cutout BG</span><span className="sm:hidden">Cutout</span>
                     </button>
                  </div>

                  {/* ABSOLUTE BOUNDING BOX FOR REACT CROP */}
                  <div className="absolute inset-0 pt-12 pb-2 px-2 lg:pt-20 lg:pb-8 lg:px-8 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                    
                    <div className={`relative flex items-center justify-center max-w-full max-h-full pointer-events-auto shadow-md ${activeBrushTool ? 'cursor-crosshair' : ''}`}>
                      
                      {/* Overlays */}
                      {isAiProcessing && (
                        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-slate-200 shadow-xl">
                          <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-600 animate-ping mb-3 lg:mb-4" />
                          <span className="text-[10px] lg:text-xs font-bold text-slate-800 tracking-widest uppercase">{aiMessage}</span>
                        </div>
                      )}

                      <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: `radial-gradient(circle, transparent 50%, rgba(0,0,0,${vignette / 100}) 100%)`, opacity: beforeAfter ? 0 : 1 }} />
                      
                      {grain > 0 && (
                        <div className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.6 + (grain/100)}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, opacity: beforeAfter ? 0 : 0.3 }} />
                      )}

                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        disabled={activeTab !== 'transform'}
                        style={{ display: 'flex', maxWidth: '100%', maxHeight: '100%' }}
                      >
                         <img
                            ref={imgRef}
                            src={processedImageUrl}
                            alt="Canvas"
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%', 
                              width: 'auto',
                              height: 'auto',
                              objectFit: 'contain',
                              display: 'block',
                              filter: dynamicFilter, 
                              transition: 'filter 0.2s',
                              mixBlendMode: bgRemoved ? 'multiply' : 'normal',
                            }}
                         />
                         
                         {/* Text Overlays */}
                         {!beforeAfter && textLayers.map(layer => (
                            <div 
                              key={layer.id} 
                              className="absolute pointer-events-none whitespace-nowrap"
                              style={{
                                left: `${layer.x}%`, top: `${layer.y}%`,
                                color: layer.color, fontSize: `${layer.size}px`,
                                fontFamily: layer.fontFamily, fontWeight: layer.bold ? 'bold' : 'normal',
                                textShadow: '0px 2px 10px rgba(255,255,255,0.5)',
                                transform: 'translate(0, 0)'
                              }}
                            >
                              {layer.text}
                            </div>
                         ))}

                         {/* Retouch Canvas Overlay */}
                         {(activeTab === 'retouch') && (
                            <canvas
                              ref={drawCanvasRef}
                              onMouseDown={(e) => handleCanvasMouse(e, 'down')}
                              onMouseMove={(e) => handleCanvasMouse(e, 'move')}
                              onMouseUp={(e) => handleCanvasMouse(e, 'up')}
                              onMouseLeave={(e) => handleCanvasMouse(e, 'up')}
                              onTouchStart={(e) => handleCanvasMouse(e as any, 'down')}
                              onTouchMove={(e) => handleCanvasMouse(e as any, 'move')}
                              onTouchEnd={(e) => handleCanvasMouse(e as any, 'up')}
                              className="absolute inset-0 z-30 w-full h-full"
                              style={{ touchAction: 'none' }}
                            />
                         )}
                      </ReactCrop>
                      
                    </div>
                  </div>

                  {beforeAfter && (
                    <div className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] lg:text-xs px-3 py-1.5 rounded-full font-bold tracking-wider animate-in fade-in border border-slate-200 shadow-sm">
                      ORIGINAL
                    </div>
                  )}
                </>
              )}
            </section>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOW IT WORKS & FAQ SECTION (LIGHT THEME) */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-[1200px] mx-auto py-16 px-6 lg:px-8">
          
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                How it Works
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Transform your images instantly directly inside your browser. No software installation required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <UploadCloud className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">1. Upload Media</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Drag and drop or select any JPG, PNG, or WEBP image. High-resolution images are fully supported without compression loss during the import phase.
                </p>
              </div>
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">2. Edit & Retouch</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Use the control panel to apply neural BG removal, local spot healing, color correction, or custom text layers.
                </p>
              </div>
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Download className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4 mb-3">3. Export Image</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Switch to the Render tab to select your output format and quality. You can even upscale your image (1x, 2x, 3x) before downloading it instantly.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">How do I delete an uploaded image?</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Click the red "Delete" button in the top right navbar to instantly clear the canvas and upload a new image.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">How does Background Removal work?</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Our engine analyzes the background pixels and isolates subjects directly inside your browser. You can tweak the BG detection sensitivity slider in the AI tab.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">How do Spot Heal and Smooth work?</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Select the Retouch tab, pick a brush tool, and paint over the areas you wish to fix. Click "Apply Edits" to bake the changes directly into the image canvas.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Are my images uploaded to external servers?</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      No. All image processing, AI color balance, background keying, and PNG generation happen 100% locally in your web browser.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}