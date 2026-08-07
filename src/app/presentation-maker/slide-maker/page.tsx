"use client";

import React, { useState, useEffect, useRef } from 'react';
import pptxgen from "pptxgenjs";
import { Rnd } from 'react-rnd';
import { 
  Plus, Download, Type, Image as ImageIcon, 
  Palette, Trash2, Layout, X, Move, Pencil,
  LayoutTemplate, Edit3, HelpCircle, CheckCircle2,
  ChevronDown, FileText
} from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'text' | 'image';
  x: number; y: number; w: number; h: number;
  content?: string;
  data?: string;
  fontSize?: number;
  color?: string;
}

interface SlideData {
  id: string;
  bgColor: string;
  elements: CanvasElement[];
}

const CANVAS_W = 960;
const CANVAS_H = 540;

export default function PresentationMakerPro() {
  const [slides, setSlides] = useState<SlideData[]>([
    { 
      id: '1', bgColor: '#ffffff',
      elements: [
        { id: 'el-1', type: 'text', x: 80, y: 80, w: 800, h: 80, content: 'Tap to Edit Title', fontSize: 48, color: '#1e293b' },
        { id: 'el-2', type: 'text', x: 80, y: 200, w: 700, h: 200, content: '• Drag elements with your finger or mouse\n• Resize using the corner handles\n• Tap the Pencil icon to edit text\n• Use Arrow Keys to nudge elements (Shift to move faster)\n• Press Delete to remove an element', fontSize: 24, color: '#475569' }
      ]
    }
  ]);
  
  const [activeSlideId, setActiveSlideId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'design' | 'text' | 'uploads' | 'none'>('none');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];
  const selectedElement = activeSlide.elements.find(e => e.id === selectedElementId);

  // --- Keyboard Shortcuts (Arrow Keys & Delete) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!selectedElementId) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        setSlides(prev => prev.map(s => s.id === activeSlideId ? {
          ...s, elements: s.elements.filter(el => el.id !== selectedElementId)
        } : s));
        setSelectedElementId(null);
        setActiveTab('none');
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); 
        const step = e.shiftKey ? 10 : 1; 
        
        setSlides(prev => prev.map(slide => {
          if (slide.id !== activeSlideId) return slide;
          return {
            ...slide,
            elements: slide.elements.map(el => {
              if (el.id !== selectedElementId) return el;
              let newX = el.x;
              let newY = el.y;
              if (e.key === 'ArrowUp') newY -= step;
              if (e.key === 'ArrowDown') newY += step;
              if (e.key === 'ArrowLeft') newX -= step;
              if (e.key === 'ArrowRight') newX += step;
              return { ...el, x: newX, y: newY };
            })
          };
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, activeSlideId]);

  // --- Responsive Canvas Scaling ---
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const padding = 32; 
        const availableW = width - padding;
        const availableH = height - padding;
        
        const scaleW = availableW / CANVAS_W;
        const scaleH = availableH / CANVAS_H;
        
        setScale(Math.max(0.15, Math.min(scaleW, scaleH, 1)));
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeTab]);

  // --- Core Handlers ---
  const addSlide = () => {
    const newId = Date.now().toString();
    setSlides(prev => [...prev, { id: newId, bgColor: '#ffffff', elements: [] }]);
    setActiveSlideId(newId);
    setSelectedElementId(null);
  };

  const deleteSlide = (id: string) => {
    if (slides.length === 1) return;
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    setActiveSlideId(newSlides[0].id);
  };

  const updateSlideBg = (color: string) => {
    setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, bgColor: color } : s));
  };

  const addTextElement = () => {
    const newEl: CanvasElement = {
      id: Date.now().toString(), type: 'text',
      x: CANVAS_W / 2 - 200, y: CANVAS_H / 2 - 40, w: 400, h: 80, 
      content: 'New Text Box', fontSize: 32, color: '#1e293b'
    };
    setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, elements: [...s.elements, newEl] } : s));
    setSelectedElementId(newEl.id);
    setActiveTab('text');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEl: CanvasElement = {
          id: Date.now().toString(), type: 'image',
          x: CANVAS_W / 2 - 150, y: CANVAS_H / 2 - 150, w: 300, h: 300, data: reader.result as string
        };
        setSlides(prev => prev.map(s => s.id === activeSlideId ? { ...s, elements: [...s.elements, newEl] } : s));
        setSelectedElementId(newEl.id);
        setActiveTab('none');
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    setSlides(prev => prev.map(s => s.id === activeSlideId ? {
      ...s, elements: s.elements.map(el => el.id === selectedElementId ? { ...el, ...updates } : el)
    } : s));
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    setSlides(prev => prev.map(s => s.id === activeSlideId ? {
      ...s, elements: s.elements.filter(el => el.id !== selectedElementId)
    } : s));
    setSelectedElementId(null);
    setActiveTab('none');
  };

  // ============================================
  // UNIVERSAL MULTI-FORMAT EXPORT ENGINE
  // ============================================
  const pxToInches = (px: number, isWidth: boolean) => (px / (isWidth ? CANVAS_W : CANVAS_H)) * (isWidth ? 10 : 5.625);

  const exportPPT = async () => {
    setIsDownloading(true);
    setShowExportMenu(false);
    try {
      const pres = new pptxgen();
      pres.layout = "LAYOUT_16x9"; 

      const getImageDimensions = (src: string): Promise<{ w: number, h: number }> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => resolve({ w: 100, h: 100 });
          img.src = src;
        });
      };

      for (const s of slides) {
        const slide = pres.addSlide();
        slide.background = { color: s.bgColor.replace('#', '') };
        
        for (const el of s.elements) {
          if (el.type === 'text' && el.content) {
            const ptSize = Math.round((el.fontSize || 32) * 0.75);
            slide.addText(el.content, { 
              x: pxToInches(el.x, true), y: pxToInches(el.y, false), 
              w: pxToInches(el.w, true), h: pxToInches(el.h, false), 
              fontSize: ptSize, color: (el.color || '#000000').replace('#', ''), 
              valign: 'top', breakLine: true, margin: 0
            });
          } else if (el.type === 'image' && el.data) {
            const dims = await getImageDimensions(el.data);
            const imgAspect = dims.w / dims.h;
            const boxAspect = el.w / el.h;
            
            let finalW, finalH, finalX, finalY;
            if (imgAspect > boxAspect) {
              finalW = el.w; finalH = el.w / imgAspect;
              finalX = el.x; finalY = el.y + (el.h - finalH) / 2;
            } else {
              finalH = el.h; finalW = el.h * imgAspect;
              finalY = el.y; finalX = el.x + (el.w - finalW) / 2; 
            }

            slide.addImage({ 
              data: el.data, 
              x: pxToInches(finalX, true), y: pxToInches(finalY, false), 
              w: pxToInches(finalW, true), h: pxToInches(finalH, false)
            });
          }
        }
      }

      await pres.writeFile({ fileName: "My_Presentation.pptx" });
    } catch (error) {
      console.error("Error creating PPT:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const exportPDF = async () => {
    setIsDownloading(true);
    setShowExportMenu(false);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);
      
      const pdf = new jsPDF("l", "px", [CANVAS_W, CANVAS_H]);
      
      for (let i = 0; i < slides.length; i++) {
        const slideNode = document.getElementById(`export-slide-${slides[i].id}`);
        if (!slideNode) continue;
        
        const canvas = await html2canvas(slideNode, { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        if (i > 0) pdf.addPage([CANVAS_W, CANVAS_H], "l");
        pdf.addImage(imgData, "JPEG", 0, 0, CANVAS_W, CANVAS_H);
      }
      
      pdf.save("My_Presentation.pdf");
    } catch (e) {
      console.error("PDF Export Error:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  const exportImage = async (format: 'png' | 'jpeg') => {
    setIsDownloading(true);
    setShowExportMenu(false);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const slideNode = document.getElementById(`export-slide-${activeSlideId}`);
      if (!slideNode) return;

      const canvas = await html2canvas(slideNode, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL(`image/${format}`, 1.0);
      
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Slide_${activeSlideId}.${format}`;
      link.click();
    } catch(e) {
       console.error("Image Export Error:", e);
    } finally {
       setIsDownloading(false);
    }
  };

  // Global click to deselect
  const handleGlobalClick = () => {
    setSelectedElementId(null);
    setActiveTab('none');
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-900 flex flex-col" onClick={handleGlobalClick}>
      
      {/* Hide scrollbars for toolbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* HIDDEN RENDER ENGINE FOR PERFECT EXPORTS */}
      <div className="fixed top-[9999px] left-[9999px] pointer-events-none z-[-50] opacity-0">
        <div className="flex flex-col gap-4">
          {slides.map(slide => (
            <div 
              key={slide.id} 
              id={`export-slide-${slide.id}`} 
              style={{ width: CANVAS_W, height: CANVAS_H, backgroundColor: slide.bgColor, position: 'relative', overflow: 'hidden' }}
            >
              {slide.elements.map(el => (
                <div key={el.id} style={{ position: 'absolute', left: el.x, top: el.y, width: el.w, height: el.h }}>
                  {el.type === 'text' ? (
                    <div style={{ fontSize: `${el.fontSize}px`, color: el.color, width: '100%', height: '100%' }}>
                      {el.content?.split('\n').map((line, i) => (
                        <div key={i} style={{ minHeight: '1.2em', whiteSpace: 'pre-wrap', lineHeight: 1.25 }}>{line}</div>
                      ))}
                    </div>
                  ) : (
                    <img src={el.data} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* APP WORKSPACE CONTAINER */}
      {/* ========================================================================= */}
      <div className="max-w-[1600px] w-full mx-auto p-2 sm:p-6 lg:p-8 pt-4 sm:pt-8 flex flex-col gap-8 flex-shrink-0">
        
        {/* EDITOR BOX */}
        <div 
          className="w-full bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col md:flex-row overflow-hidden relative z-0"
          style={{ height: '85vh', minHeight: '650px' }}
        >
          
          {/* MOBILE HEADER */}
          <div className="md:hidden bg-white h-14 border-b border-gray-200 flex items-center justify-between px-4 z-30 shadow-sm flex-shrink-0" onClick={e => e.stopPropagation()}>
            <div className="font-black text-lg text-indigo-600 flex items-center gap-2">
              <Layout size={20} /> SlideMaker
            </div>
            
            <div className="relative">
              <button onClick={() => setShowExportMenu(!showExportMenu)} disabled={isDownloading} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-md active:scale-95 transition-transform flex items-center gap-2">
                {isDownloading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Export'}
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col animate-in slide-in-from-top-2">
                  <button onClick={exportPPT} className="px-4 py-3.5 text-sm text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 border-b border-slate-100"><Layout size={18}/> PowerPoint (.pptx)</button>
                  <button onClick={exportPDF} className="px-4 py-3.5 text-sm text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 border-b border-slate-100"><FileText size={18}/> PDF Document</button>
                  <button onClick={() => exportImage('png')} className="px-4 py-3.5 text-sm text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 border-b border-slate-100"><ImageIcon size={18}/> Current Slide (PNG)</button>
                  <button onClick={() => exportImage('jpeg')} className="px-4 py-3.5 text-sm text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3"><ImageIcon size={18}/> Current Slide (JPG)</button>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR NAVIGATION (Left on Desktop, Bottom on Mobile) */}
          <div className="flex md:flex-col bg-white md:bg-[#0f172a] md:w-24 w-full h-16 md:h-full flex-row items-center justify-around md:justify-start md:py-6 border-t md:border-t-0 border-gray-200 md:border-none shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] md:shadow-none z-40 order-last md:order-first flex-shrink-0 pb-safe" onClick={e => e.stopPropagation()}>
            
            <div className="hidden md:flex p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-8 shadow-lg text-white">
              <Layout size={28} />
            </div>

            <button onClick={() => setActiveTab(activeTab === 'design' ? 'none' : 'design')} 
              className={`flex flex-col items-center space-y-1.5 w-16 md:w-20 py-2.5 md:py-3 rounded-xl transition-all ${activeTab === 'design' ? 'text-indigo-600 md:text-indigo-400 md:bg-white/10' : 'text-gray-500 md:text-gray-400 hover:text-indigo-500 md:hover:bg-white/5'}`}>
              <Palette size={24} />
              <span className="text-[10px] md:text-xs font-bold tracking-wider">Design</span>
            </button>

            <button onClick={() => setActiveTab(activeTab === 'text' ? 'none' : 'text')} 
              className={`flex flex-col items-center space-y-1.5 w-16 md:w-20 py-2.5 md:py-3 rounded-xl transition-all ${activeTab === 'text' ? 'text-indigo-600 md:text-indigo-400 md:bg-white/10' : 'text-gray-500 md:text-gray-400 hover:text-indigo-500 md:hover:bg-white/5'}`}>
              <Type size={24} />
              <span className="text-[10px] md:text-xs font-bold tracking-wider">Text</span>
            </button>

            <button onClick={() => setActiveTab(activeTab === 'uploads' ? 'none' : 'uploads')} 
              className={`flex flex-col items-center space-y-1.5 w-16 md:w-20 py-2.5 md:py-3 rounded-xl transition-all ${activeTab === 'uploads' ? 'text-indigo-600 md:text-indigo-400 md:bg-white/10' : 'text-gray-500 md:text-gray-400 hover:text-indigo-500 md:hover:bg-white/5'}`}>
              <ImageIcon size={24} />
              <span className="text-[10px] md:text-xs font-bold tracking-wider">Images</span>
            </button>
          </div>

          {/* OPTIONS PANEL CONTEXT DRAWER */}
          <div 
            className={`
              absolute md:relative bottom-16 md:bottom-auto w-full md:w-80 bg-white border-t md:border-t-0 md:border-r border-gray-200 
              shadow-[0_-10px_20px_-3px_rgb(0,0,0,0.15)] md:shadow-none z-30 transition-all duration-300 ease-in-out flex flex-col
              ${activeTab !== 'none' ? 'h-[40vh] md:h-full opacity-100' : 'h-0 md:h-full md:w-0 overflow-hidden opacity-0 md:opacity-100'}
            `}
            style={{ width: activeTab !== 'none' && typeof window !== 'undefined' && window.innerWidth >= 768 ? '320px' : undefined }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="font-bold text-gray-800 capitalize text-lg">{activeTab} Options</h2>
                <button onClick={() => setActiveTab('none')} className="bg-gray-100 p-2 rounded-full text-gray-600"><X size={18}/></button>
              </div>

              {activeTab === 'text' && (
                <div className="space-y-4">
                  <h2 className="font-bold text-xl hidden md:block text-slate-800 mb-6">Text Elements</h2>
                  <button onClick={addTextElement} className="w-full py-3.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
                    <Plus size={18} /> Add New Text Box
                  </button>
                  
                  {selectedElement?.type === 'text' ? (
                    <div className="space-y-4 p-5 border border-indigo-100 bg-indigo-50/50 rounded-xl mt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Edit Selected Text</span>
                      </div>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] text-sm"
                        value={selectedElement.content}
                        onChange={(e) => updateSelectedElement({ content: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Color</label>
                          <input type="color" value={selectedElement.color || '#000000'} onChange={(e) => updateSelectedElement({ color: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 bg-white" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Size (px)</label>
                          <input type="number" value={selectedElement.fontSize} onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value) })} className="w-full h-10 p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-indigo-500" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 text-center mt-6 border border-dashed border-gray-300">
                      <Type className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 font-medium">Select a text box on the canvas to edit its styling.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'design' && (
                 <div className="space-y-6">
                   <h2 className="font-bold text-xl hidden md:block text-slate-800">Slide Design</h2>
                   <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-4">Slide Background Color</label>
                     <div className="flex items-center space-x-4">
                       <input type="color" value={activeSlide.bgColor} onChange={(e) => updateSlideBg(e.target.value)} className="w-14 h-14 rounded-xl border-2 border-white shadow-sm cursor-pointer bg-transparent" />
                       <div>
                         <span className="text-sm font-bold text-gray-700 block">HEX Color</span>
                         <span className="text-xs font-mono text-gray-500 uppercase">{activeSlide.bgColor}</span>
                       </div>
                     </div>
                   </div>
                 </div>
              )}

              {activeTab === 'uploads' && (
                <div className="space-y-6">
                  <h2 className="font-bold text-xl hidden md:block text-slate-800">Media Assets</h2>
                  <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors bg-gray-50 group">
                    <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                      </div>
                      <span className="text-sm font-bold text-indigo-600">Upload Image File</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAIN WORKSPACE CANVAS VIEWPORT */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
            
            {/* DESKTOP HEADER BAR */}
            <div className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 z-10 shadow-sm flex-shrink-0" onClick={e => e.stopPropagation()}>
              <div className="text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">Untitled Presentation</div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isDownloading}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isDownloading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Download size={18} />}
                  <span>{isDownloading ? 'Generating...' : 'Export File'}</span>
                  <ChevronDown size={16} />
                </button>

                {showExportMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col animate-in slide-in-from-top-2">
                    <button onClick={exportPPT} className="px-4 py-3.5 text-sm text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 border-b border-slate-100"><Layout size={18}/> PowerPoint (.pptx)</button>
                    <button onClick={exportPDF} className="px-4 py-3.5 text-sm text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 border-b border-slate-100"><FileText size={18}/> PDF Document</button>
                    <button onClick={() => exportImage('png')} className="px-4 py-3.5 text-sm text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 border-b border-slate-100"><ImageIcon size={18}/> Current Slide (PNG)</button>
                    <button onClick={() => exportImage('jpeg')} className="px-4 py-3.5 text-sm text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3"><ImageIcon size={18}/> Current Slide (JPG)</button>
                  </div>
                )}
              </div>
            </div>

            {/* INTERACTIVE CANVAS AREA */}
            <div 
              className="flex-1 overflow-hidden flex justify-center items-center p-4 lg:p-8 bg-[#f1f5f9] relative" 
              ref={containerRef}
              style={{ touchAction: 'none' }} 
            >
              <div 
                style={{
                  width: `${CANVAS_W * scale}px`,
                  height: `${CANVAS_H * scale}px`,
                  position: 'relative'
                }}
              >
                <div 
                  className="shadow-2xl absolute bg-white ring-1 ring-black/5"
                  style={{ 
                    width: `${CANVAS_W}px`, 
                    height: `${CANVAS_H}px`, 
                    backgroundColor: activeSlide.bgColor,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left' 
                  }}
                >
                  {activeSlide.elements.map(el => (
                    <Rnd
                      key={el.id}
                      bounds="parent"
                      scale={scale}
                      position={{ x: el.x, y: el.y }}
                      size={{ width: el.w, height: el.h }}
                      onDragStart={() => setSelectedElementId(el.id)}
                      onDragStop={(e, d) => updateSelectedElement({ x: d.x, y: d.y })}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        updateSelectedElement({ w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...position });
                      }}
                      cancel=".no-drag" // Prevents dragging when clicking toolbar buttons
                      className={`group ${selectedElementId === el.id ? 'ring-2 ring-indigo-500 z-50 bg-indigo-50/10' : 'hover:ring-2 hover:ring-indigo-300/50 z-10'}`}
                    >
                      
                      {/* Floating Action Menu for Selected Element */}
                      {selectedElementId === el.id && (
                        <div 
                          className="absolute flex gap-1 z-50 bg-white shadow-xl rounded-xl p-1.5 border border-slate-200" 
                          style={{ 
                            top: '-55px', right: 0, 
                            transform: `scale(${1/scale})`, 
                            transformOrigin: 'bottom right' 
                          }}
                        >
                          <div className="text-slate-400 p-2 cursor-move hover:bg-slate-50 hover:text-slate-700 rounded-lg transition-colors">
                            <Move size={18} />
                          </div>
                          
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveTab(el.type === 'image' ? 'uploads' : 'text'); 
                            }} 
                            onTouchEnd={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              setActiveTab(el.type === 'image' ? 'uploads' : 'text');
                            }}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg p-2 transition-colors no-drag"
                          >
                            <Pencil size={18} />
                          </button>

                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              deleteSelectedElement(); 
                            }} 
                            onTouchEnd={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              deleteSelectedElement();
                            }}
                            className="bg-red-50 text-red-500 hover:bg-red-100 rounded-lg p-2 transition-colors no-drag"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}

                      {/* Element Content & Selection Handlers */}
                      <div 
                        className="w-full h-full p-2 cursor-move flex flex-col justify-start touch-none" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                        }}
                      >
                        {el.type === 'text' ? (
                          <div style={{ fontSize: `${el.fontSize}px`, color: el.color }} className="w-full h-full pointer-events-none">
                            {el.content?.split('\n').map((line, i) => (
                              <div key={i} className="min-h-[1.2em] whitespace-pre-wrap leading-tight">{line}</div>
                            ))}
                          </div>
                        ) : (
                          <img src={el.data} className="w-full h-full object-contain pointer-events-none" alt="Asset" />
                        )}
                      </div>
                    </Rnd>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM SLIDE FILMSTRIP BAR */}
            <div className="h-28 md:h-36 bg-white border-t border-gray-200 flex items-center px-4 md:px-8 space-x-4 overflow-x-auto shadow-sm flex-shrink-0 z-20 custom-scrollbar" onClick={e => e.stopPropagation()}>
              {slides.map((s, idx) => (
                <div key={s.id} className="relative flex-shrink-0 group py-2">
                  <div 
                    onClick={() => { setActiveSlideId(s.id); setSelectedElementId(null); setActiveTab('none'); }}
                    className={`w-32 h-20 md:w-44 md:h-28 rounded-xl border-2 cursor-pointer transition-all ${activeSlideId === s.id ? 'border-indigo-600 ring-4 ring-indigo-100 scale-[1.02]' : 'border-gray-200 hover:border-gray-400'}`}
                    style={{ backgroundColor: s.bgColor }}
                  >
                    <div className="p-2 overflow-hidden h-full">
                      {s.elements.filter(e => e.type === 'text')[0] && (
                         <div className="text-[6px] md:text-[9px] font-bold opacity-50 truncate text-slate-800">
                           {s.elements.filter(e => e.type === 'text')[0].content}
                         </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                     <button onClick={(e) => { e.stopPropagation(); deleteSlide(s.id); }} className="bg-white border border-gray-200 text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-50">
                       <Trash2 size={12} />
                     </button>
                  </div>
                  <div className="text-center text-[10px] md:text-xs mt-2 font-bold text-gray-500">Slide {idx + 1}</div>
                </div>
              ))}
              
              <button 
                onClick={addSlide}
                className="w-32 h-20 md:w-44 md:h-28 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 transition-all mb-6"
              >
                <Plus size={24} />
                <span className="text-[10px] font-bold mt-1.5">Add Slide</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOW IT WORKS & FAQ SECTION */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-[1200px] mx-auto py-16 px-6 lg:px-8">
          
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-[#111827] tracking-tight mb-4">
                How it Works
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Create stunning presentations right in your browser and export them as native PowerPoint, PDF, or Image files.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-3">1. Build Your Slides</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Use the bottom filmstrip to add new slides. Change background colors and manage your presentation flow effortlessly.
                </p>
              </div>
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-3">2. Drag & Drop Elements</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Add text boxes and images using the sidebar. Click to select, then drag, drop, and resize elements directly on the canvas.
                </p>
              </div>
              <div className="bg-[#f4f6fa] p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-5 left-8 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <Download className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-3">3. Export Native PPTX</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Click Export to generate a real, fully-editable PowerPoint file. Your images and text layouts will translate perfectly 1:1.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-black text-[#111827] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Can I edit the downloaded file in PowerPoint?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Yes! Unlike other tools that export flat PDFs, our engine generates standard .pptx files. You can open them in Microsoft PowerPoint or Google Slides and continue editing the text and images.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Does this work on mobile phones?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Absolutely. The layout automatically scales your canvas to fit your screen. You can tap, drag, and resize elements using your touchscreen just as easily as with a mouse.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">How do I edit text colors and sizes?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Tap any text box on your canvas, then open the "Text" tab in the sidebar (or bottom bar on mobile) or click the Pencil icon. The properties panel will update to show options for that specific text block.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f4f6fa] p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Are my slides saved to a server?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      No. All slide creation and file rendering happens securely within your own web browser. Your images and data are completely private and never uploaded to our servers.
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