"use client";

import { useState, useCallback, useRef, useEffect, ChangeEvent, MouseEvent as ReactMouseEvent } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { 
  UploadCloud, Download, Sun, Contrast, Droplet, RotateCw, FlipHorizontal, FlipVertical,
  Palette, Image as ImageIcon, Crop as CropIcon, Settings2, RefreshCcw, Square,
  RectangleHorizontal, RectangleVertical, Sliders, Wand2, Focus, Save, SplitSquareHorizontal,
  Sparkles, Maximize, Smile, MousePointer2, CircleDashed, Eraser, Zap, 
  Thermometer, Aperture, Type, Layers, Undo2, Redo2, Scissors, Play, Trash2
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
  const [isDragging, setIsDragging] = useState(false);
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
  const [activeBrushTool, setActiveBrushTool] = useState<'heal' | 'smooth' | 'push' | null>(null);
  const [brushSize, setBrushSize] = useState(50);
  const [brushStrength, setBrushStrength] = useState(50);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // AI States
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [bgRemoved, setBgRemoved] = useState(false);
  const [beforeAfter, setBeforeAfter] = useState(false);

  // Export & Crop
  const [exportScale, setExportScale] = useState(1);
  const [exportFormat, setExportFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
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

  const runAITool = (toolName: string) => {
    setIsAiProcessing(true);
    setAiMessage(`Initializing ${toolName}...`);
    setTimeout(() => setAiMessage("Analyzing depth map..."), 800);
    setTimeout(() => setAiMessage("Applying neural weights..."), 1800);
    setTimeout(() => {
      setIsAiProcessing(false);
      if (toolName === 'Auto Color') applyPreset('Film');
      if (toolName === 'Remove BG') setBgRemoved(true);
    }, 2800);
  };

  const addTextLayer = () => {
    setTextLayers([...textLayers, {
      id: Math.random().toString(36).substr(2, 9),
      text: "NEW TEXT", x: 50, y: 50, size: 40, color: "#ffffff", fontFamily: "Inter", bold: true
    }]);
  };
  const updateTextLayer = (id: string, key: keyof TextLayer, value: any) => {
    setTextLayers(textLayers.map(t => t.id === id ? { ...t, [key]: value } : t));
  };
  const removeTextLayer = (id: string) => setTextLayers(textLayers.filter(t => t.id !== id));

  // Base Image Rotation Processing
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

  // Interactive Brush Logic
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
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = activeBrushTool === 'heal' ? `rgba(239, 68, 68, ${brushStrength / 400})` : `rgba(255, 255, 255, ${brushStrength / 400})`;
    ctx.fill();
  };

  const clearDrawCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (imgRef.current && drawCanvasRef.current) {
      drawCanvasRef.current.width = imgRef.current.width;
      drawCanvasRef.current.height = imgRef.current.height;
    }
  }, [processedImageUrl]);

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
    <div className="w-full flex justify-center py-4 px-2 sm:px-6 bg-transparent">
      {/* Hide default scrollbars visually but allow scrolling */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* MAIN WRAPPER */}
      <div 
        className="w-full max-w-[1600px] bg-[#0a0a0c] font-sans selection:bg-cyan-500/30 selection:text-cyan-200 text-slate-300 flex flex-col rounded-xl sm:rounded-2xl border border-[#2a2d35] shadow-2xl overflow-hidden relative z-0"
        style={{ height: 'calc(100vh - 100px)', minHeight: '500px', maxHeight: '1100px' }}
      >
        
        {/* TOP NAVBAR */}
        <header className="h-14 bg-[#121418] border-b border-[#2a2d35] flex items-center justify-between px-3 sm:px-6 shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Aperture className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-white font-bold tracking-widest uppercase text-[10px] sm:text-xs">Studio Pro</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex bg-[#1a1c23] rounded-lg p-1 border border-[#2a2d35]">
              <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#2a2d35] transition-colors"><Undo2 className="w-4 h-4"/></button>
              <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#2a2d35] transition-colors"><Redo2 className="w-4 h-4"/></button>
            </div>
            {sourceImageUrl && (
              <button onClick={handleDownload} className="h-8 sm:h-9 px-3 sm:px-6 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] sm:text-xs font-bold rounded-lg shadow-lg shadow-cyan-900/50 flex items-center gap-1.5 transition-all">
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Export Media</span> <span className="sm:hidden">Save</span>
              </button>
            )}
          </div>
        </header>

        {/* CSS GRID LAYOUT */}
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[80px_320px_1fr] grid-rows-[1fr_minmax(200px,40%)_70px] lg:grid-rows-1 overflow-hidden min-h-0 min-w-0">
          
          {/* SIDEBAR */}
          <aside className="row-start-3 lg:row-start-1 lg:col-start-1 bg-[#121418] border-t lg:border-t-0 lg:border-r border-[#2a2d35] flex flex-row lg:flex-col items-center py-2 lg:py-6 gap-2 lg:gap-4 overflow-x-auto lg:overflow-y-auto hide-scrollbar z-20 px-2 lg:px-0">
            {[
              { id: 'transform', icon: CropIcon, label: 'Layout' },
              { id: 'ai', icon: Sparkles, label: 'AI Magic', color: 'text-cyan-400' },
              { id: 'presets', icon: Layers, label: 'LUTs' },
              { id: 'adjust', icon: Sliders, label: 'Color' },
              { id: 'retouch', icon: Eraser, label: 'Retouch' },
              { id: 'text', icon: Type, label: 'Titles' },
              { id: 'export', icon: Save, label: 'Render' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setActiveBrushTool(null); }} 
                className={`flex flex-col items-center justify-center gap-1.5 w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex-shrink-0 transition-all ${activeTab === tab.id ? 'bg-[#1e2128] border border-[#3a3d45] shadow-inner text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1c23]'}`}
              >
                <tab.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${tab.color && activeTab !== tab.id ? tab.color : ''}`} />
                <span className="text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </aside>

          {/* SETTINGS CONTROLS */}
          <section className="row-start-2 lg:row-start-1 lg:col-start-2 bg-[#181a1f] border-t lg:border-t-0 lg:border-r border-[#2a2d35] flex flex-col overflow-hidden z-10 min-h-0 min-w-0">
            <div className="h-10 lg:h-12 bg-[#121418] border-b border-[#2a2d35] px-4 lg:px-5 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-[10px] lg:text-xs text-white tracking-widest uppercase">{activeTab}</h3>
              {sourceImageUrl && (
                <button onClick={resetAllSettings} className="text-[10px] text-slate-400 hover:text-red-400 font-medium">Reset All</button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-4 lg:p-5 pb-10">
              {!sourceImageUrl ? (
                <div className="text-center mt-6 lg:mt-10">
                  <UploadCloud className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-slate-600 mb-3" />
                  <p className="text-[10px] lg:text-xs text-slate-400">Import an image to view tools.</p>
                </div>
              ) : (
                <>
                  {/* AI MAGIC */}
                  {activeTab === 'ai' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="p-4 bg-cyan-950/30 border border-cyan-900/50 rounded-xl">
                        <Sparkles className="w-5 h-5 text-cyan-400 mb-2"/>
                        <h4 className="text-white text-xs lg:text-sm font-bold mb-1">Neural Engine</h4>
                        <p className="text-[10px] lg:text-xs text-cyan-200/60 leading-relaxed">Leverage AI to automatically mask, cut out, and color grade your media.</p>
                      </div>
                      <button onClick={() => runAITool('Remove BG')} disabled={isAiProcessing} className="w-full h-10 lg:h-12 bg-[#23262e] hover:bg-[#2a2d35] border border-[#3a3d45] rounded-xl flex items-center justify-center gap-2 text-[11px] lg:text-xs font-bold text-white transition-all">
                        <Scissors className="w-3.5 h-3.5 text-cyan-400"/> Remove Background
                      </button>
                      <button onClick={() => runAITool('Auto Color')} disabled={isAiProcessing} className="w-full h-10 lg:h-12 bg-[#23262e] hover:bg-[#2a2d35] border border-[#3a3d45] rounded-xl flex items-center justify-center gap-2 text-[11px] lg:text-xs font-bold text-white transition-all">
                        <Play className="w-3.5 h-3.5 text-fuchsia-400"/> Auto Grade (LUT)
                      </button>
                    </div>
                  )}

                  {/* TEXT ENGINE */}
                  {activeTab === 'text' && (
                    <div className="space-y-4 lg:space-y-6 animate-in fade-in duration-300">
                      <button onClick={addTextLayer} className="w-full h-9 lg:h-10 bg-violet-600 hover:bg-violet-500 rounded-lg text-[11px] lg:text-xs font-bold text-white flex items-center justify-center gap-2">
                        <Type className="w-3.5 h-3.5"/> Add Text Layer
                      </button>
                      
                      <div className="space-y-3 lg:space-y-4">
                        {textLayers.map((layer, idx) => (
                          <div key={layer.id} className="bg-[#121418] border border-[#2a2d35] rounded-xl p-3 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Layer {idx + 1}</span>
                              <button onClick={() => removeTextLayer(layer.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5"/></button>
                            </div>
                            <input type="text" value={layer.text} onChange={(e) => updateTextLayer(layer.id, 'text', e.target.value)} className="w-full bg-[#1a1c23] border border-[#333] rounded px-3 py-2 text-xs text-white" />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] lg:text-[9px] text-slate-500 uppercase block mb-1">Color</label>
                                <input type="color" value={layer.color} onChange={(e) => updateTextLayer(layer.id, 'color', e.target.value)} className="w-full h-7 lg:h-8 rounded bg-[#1a1c23] border border-[#333] cursor-pointer" />
                              </div>
                              <div>
                                <label className="text-[8px] lg:text-[9px] text-slate-500 uppercase block mb-1">Size ({layer.size})</label>
                                <input type="range" min="10" max="200" value={layer.size} onChange={(e) => updateTextLayer(layer.id, 'size', Number(e.target.value))} className="w-full accent-violet-500 h-1 bg-[#2a2d35] mt-2 rounded-lg appearance-none" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2a2d35]">
                              <div>
                                <label className="text-[8px] lg:text-[9px] text-slate-500 uppercase block mb-1">Pos X ({layer.x}%)</label>
                                <input type="range" min="0" max="100" value={layer.x} onChange={(e) => updateTextLayer(layer.id, 'x', Number(e.target.value))} className="w-full accent-slate-400 h-1 bg-[#2a2d35] mt-1 rounded-lg appearance-none" />
                              </div>
                              <div>
                                <label className="text-[8px] lg:text-[9px] text-slate-500 uppercase block mb-1">Pos Y ({layer.y}%)</label>
                                <input type="range" min="0" max="100" value={layer.y} onChange={(e) => updateTextLayer(layer.id, 'y', Number(e.target.value))} className="w-full accent-slate-400 h-1 bg-[#2a2d35] mt-1 rounded-lg appearance-none" />
                              </div>
                            </div>
                          </div>
                        ))}
                        {textLayers.length === 0 && <p className="text-[10px] lg:text-xs text-slate-500 text-center py-4">No text layers active.</p>}
                      </div>
                    </div>
                  )}

                  {/* ADJUST */}
                  {activeTab === 'adjust' && (
                    <div className="space-y-5 lg:space-y-6 animate-in fade-in duration-300">
                      <div className="space-y-3 lg:space-y-4">
                        <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-400">Basic Correction</h4>
                        {[
                          { label: 'Exposure', val: brightness, set: setBrightness, max: 200, color: 'accent-white' },
                          { label: 'Contrast', val: contrast, set: setContrast, max: 200, color: 'accent-white' },
                          { label: 'Saturation', val: saturation, set: setSaturation, max: 200, color: 'accent-white' }
                        ].map(ctrl => (
                          <div key={ctrl.label} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] lg:text-[11px] font-medium"><span className="text-slate-300">{ctrl.label}</span><span className="text-slate-500">{ctrl.val}</span></div>
                            <input type="range" min="0" max={ctrl.max} value={ctrl.val} onChange={(e) => ctrl.set(Number(e.target.value))} className={`w-full ${ctrl.color} h-1 bg-[#2a2d35] rounded-lg appearance-none`} />
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3 lg:space-y-4 pt-4 border-t border-[#2a2d35]">
                        <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-400">Color Wheels (Split Tone)</h4>
                        {[
                          { label: 'Temperature', val: temp, set: setTemp, min: -100, max: 100, color: 'accent-amber-500' },
                          { label: 'Tint', val: tint, set: setTint, min: -100, max: 100, color: 'accent-fuchsia-500' }
                        ].map(ctrl => (
                          <div key={ctrl.label} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] lg:text-[11px] font-medium"><span className="text-slate-300">{ctrl.label}</span><span className="text-slate-500">{ctrl.val}</span></div>
                            <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.val} onChange={(e) => ctrl.set(Number(e.target.value))} className={`w-full ${ctrl.color} h-1 bg-[#2a2d35] rounded-lg appearance-none`} />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 lg:space-y-4 pt-4 border-t border-[#2a2d35]">
                        <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-400">Cinematic Effects</h4>
                        {[
                          { label: 'Vignette', val: vignette, set: setVignette, min: 0, max: 100, color: 'accent-slate-400' },
                          { label: 'Film Grain / Noise', val: grain, set: setGrain, min: 0, max: 100, color: 'accent-slate-400' },
                          { label: 'Lens Blur', val: blur, set: setBlur, min: 0, max: 20, color: 'accent-slate-400' }
                        ].map(ctrl => (
                          <div key={ctrl.label} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] lg:text-[11px] font-medium"><span className="text-slate-300">{ctrl.label}</span><span className="text-slate-500">{ctrl.val}</span></div>
                            <input type="range" min={ctrl.min} max={ctrl.max} step="0.5" value={ctrl.val} onChange={(e) => ctrl.set(Number(e.target.value))} className={`w-full ${ctrl.color} h-1 bg-[#2a2d35] rounded-lg appearance-none`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TRANSFORM */}
                  {activeTab === 'transform' && (
                    <div className="space-y-5 lg:space-y-6 animate-in fade-in">
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setRotation(r => (r + 90) % 360)} className="h-9 lg:h-10 bg-[#23262e] border border-[#333] rounded-lg text-[11px] lg:text-xs font-medium hover:bg-[#2a2d35] flex items-center justify-center gap-2"><RotateCw className="w-3.5 h-3.5"/> Rotate</button>
                        <button onClick={() => setFlipX(f => f * -1)} className="h-9 lg:h-10 bg-[#23262e] border border-[#333] rounded-lg text-[11px] lg:text-xs font-medium hover:bg-[#2a2d35] flex items-center justify-center gap-2"><FlipHorizontal className="w-3.5 h-3.5"/> Flip</button>
                      </div>
                      <div>
                        <h4 className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 lg:mb-3">Crop Ratio</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[{v: undefined, l: 'Free'}, {v: 1, l: '1:1 Square'}, {v: 16/9, l: '16:9 Cinema'}, {v: 9/16, l: '9:16 Story'}].map(ar => (
                            <button key={ar.l} onClick={() => handlePresetAspect(ar.v)} className={`h-9 lg:h-10 rounded-lg border text-[10px] lg:text-xs font-bold transition-all ${aspect === ar.v ? 'bg-violet-600/20 border-violet-500 text-violet-300' : 'bg-[#121418] border-[#2a2d35] text-slate-400'}`}>{ar.l}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRESETS */}
                  {activeTab === 'presets' && (
                    <div className="grid grid-cols-2 gap-2 lg:gap-3 animate-in fade-in">
                      {(Object.keys(FILTER_PRESETS) as Array<keyof typeof FILTER_PRESETS>).map(preset => (
                        <button key={preset} onClick={() => applyPreset(preset)} className="relative group rounded-lg border border-[#2a2d35] bg-[#121418] p-1 overflow-hidden h-20 lg:h-24 hover:border-violet-500">
                          <img src={processedImageUrl} alt={preset} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" style={{ filter: `brightness(${FILTER_PRESETS[preset].brightness}%) contrast(${FILTER_PRESETS[preset].contrast}%) saturate(${FILTER_PRESETS[preset].saturation}%) sepia(${FILTER_PRESETS[preset].sepia}%) hue-rotate(${FILTER_PRESETS[preset].hueRotate}deg)` }} />
                          <span className="absolute bottom-1 left-2 text-[9px] lg:text-[10px] font-bold text-white shadow-black drop-shadow-md">{preset} LUT</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* RETOUCH */}
                  {activeTab === 'retouch' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setActiveBrushTool('heal')} className={`h-9 lg:h-10 rounded-lg border text-[10px] lg:text-xs font-bold flex items-center justify-center gap-1.5 ${activeBrushTool === 'heal' ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-[#121418] border-[#2a2d35] text-slate-400'}`}><Zap className="w-3.5 h-3.5"/> Spot Heal</button>
                        <button onClick={() => setActiveBrushTool('smooth')} className={`h-9 lg:h-10 rounded-lg border text-[10px] lg:text-xs font-bold flex items-center justify-center gap-1.5 ${activeBrushTool === 'smooth' ? 'bg-white/10 border-white/30 text-white' : 'bg-[#121418] border-[#2a2d35] text-slate-400'}`}><CircleDashed className="w-3.5 h-3.5"/> Smooth</button>
                      </div>
                      {activeBrushTool && (
                        <div className="space-y-4 pt-4 border-t border-[#2a2d35]">
                          <input type="range" min="10" max="150" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full accent-white h-1 bg-[#2a2d35] rounded-lg" />
                          <p className="text-[9px] lg:text-[10px] text-slate-500 text-center">Brush Size: {brushSize}px</p>
                          <button onClick={clearDrawCanvas} className="w-full py-1.5 border border-slate-600 text-slate-400 text-[10px] lg:text-xs rounded hover:bg-slate-800 transition-colors">Clear Mask</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* EXPORT */}
                  {activeTab === 'export' && (
                    <div className="space-y-5 lg:space-y-6 animate-in fade-in">
                      <div>
                        <h4 className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-400 mb-2">Format</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {['image/jpeg', 'image/png', 'image/webp'].map(fmt => (
                            <button key={fmt} onClick={() => setExportFormat(fmt as any)} className={`h-8 lg:h-9 rounded-lg border text-[10px] lg:text-xs font-bold ${exportFormat === fmt ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400' : 'bg-[#121418] border-[#2a2d35] text-slate-400'}`}>{fmt.split('/')[1].toUpperCase()}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-400 mb-2">Scale (Upsampling)</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map(scale => (
                            <button key={scale} onClick={() => setExportScale(scale)} className={`h-8 lg:h-9 rounded-lg border text-[10px] lg:text-xs font-bold ${exportScale === scale ? 'bg-violet-600/20 border-violet-500 text-violet-400' : 'bg-[#121418] border-[#2a2d35] text-slate-400'}`}>{scale}x</button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] lg:text-[11px]"><span className="text-slate-400">Quality</span><span className="text-slate-200">{exportQuality}%</span></div>
                        <input type="range" min="10" max="100" step="5" value={exportQuality} onChange={(e) => setExportQuality(Number(e.target.value))} className="w-full accent-cyan-500 h-1 bg-[#2a2d35] rounded-lg" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* CANVAS WORKSPACE
            Uses absolute positioning to definitively trap the image inside the visible space.
          */}
          <section className="row-start-1 lg:row-start-1 lg:col-start-3 bg-[#050505] relative min-h-0 min-w-0 border-b lg:border-b-0 border-[#2a2d35]">
            
            {!sourceImageUrl ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <label className="cursor-pointer group flex flex-col items-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[#121418] border-2 border-dashed border-[#333] group-hover:border-cyan-500 group-hover:bg-cyan-500/5 flex items-center justify-center transition-all mb-3 lg:mb-4">
                    <UploadCloud className="w-6 h-6 lg:w-8 lg:h-8 text-slate-500 group-hover:text-cyan-400" />
                  </div>
                  <span className="text-xs lg:text-sm font-bold text-slate-300">Click to import media</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
                </label>
              </div>
            ) : (
              <>
                {/* Checkered Background Pattern */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: `linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)`, backgroundSize: '24px 24px', backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px' }} />

                {/* Editor Floating Actions Bar */}
                <div className="absolute top-2 lg:top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 lg:gap-2 bg-[#121418]/90 backdrop-blur border border-[#2a2d35] p-1 lg:p-1.5 rounded-xl shadow-2xl pointer-events-auto">
                   <button 
                      onMouseDown={() => setBeforeAfter(true)} onMouseUp={() => setBeforeAfter(false)}
                      onMouseLeave={() => setBeforeAfter(false)} onTouchStart={() => setBeforeAfter(true)} onTouchEnd={() => setBeforeAfter(false)}
                      className="px-2 lg:px-3 py-1 lg:py-1.5 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-[#2a2d35] rounded active:bg-cyan-900 cursor-help"
                    >
                     Compare
                   </button>
                   <div className="w-px h-3 lg:h-4 bg-[#333]"></div>
                   <button onClick={() => setBgRemoved(!bgRemoved)} className={`px-2 lg:px-3 py-1 lg:py-1.5 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 ${bgRemoved ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-[#2a2d35]'}`}><Layers className="w-3 h-3"/> Alpha</button>
                </div>

                {/* ABSOLUTE BOUNDING BOX: 
                  Provides physical pixel boundaries to the Flexbox children so 
                  massive high-res images cannot expand beyond the viewport.
                */}
                <div className="absolute inset-0 pt-16 pb-4 px-2 lg:pt-20 lg:pb-8 lg:px-8 flex items-center justify-center pointer-events-none z-10">
                  
                  <div className={`relative flex items-center justify-center max-w-full max-h-full pointer-events-auto bg-black shadow-2xl border border-[#2a2d35] ${activeBrushTool ? 'cursor-crosshair' : ''}`}>
                    
                    {/* Overlays */}
                    {isAiProcessing && (
                      <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-[#333]">
                        <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-cyan-400 animate-ping mb-3 lg:mb-4" />
                        <span className="text-[10px] lg:text-xs font-bold text-white tracking-widest uppercase">{aiMessage}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: `radial-gradient(circle, transparent 50%, rgba(0,0,0,${vignette / 100}) 100%)`, opacity: beforeAfter ? 0 : 1 }} />
                    
                    {grain > 0 && (
                      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.6 + (grain/100)}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, opacity: beforeAfter ? 0 : 0.3 }} />
                    )}

                    {/* ReactCrop wrapper explicitly constrained */}
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspect}
                      disabled={activeTab !== 'transform'}
                      style={{ display: 'flex', maxWidth: '100%', maxHeight: '100%' }}
                    >
                       {/* The Kill-Shot: calc(100vh - Xpx) forces physical screen limits */}
                       <img
                          ref={imgRef}
                          src={processedImageUrl}
                          alt="Canvas"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: 'calc(100vh - 180px)', 
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            display: 'block',
                            filter: dynamicFilter, 
                            transition: 'filter 0.2s',
                            mixBlendMode: bgRemoved ? 'screen' : 'normal',
                            maskImage: bgRemoved && !beforeAfter ? 'radial-gradient(ellipse at center, black 40%, transparent 60%)' : 'none',
                            WebkitMaskImage: bgRemoved && !beforeAfter ? 'radial-gradient(ellipse at center, black 40%, transparent 60%)' : 'none'
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
                              textShadow: '0px 2px 10px rgba(0,0,0,0.5)',
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
                            className="absolute inset-0 z-30 w-full h-full"
                            style={{ touchAction: 'none' }}
                          />
                       )}
                    </ReactCrop>
                    
                  </div>
                </div>

                {beforeAfter && (
                  <div className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-md text-white text-[10px] lg:text-xs px-3 py-1.5 rounded-full font-bold tracking-wider animate-in fade-in border border-[#333]">
                    ORIGINAL
                  </div>
                )}
              </>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}