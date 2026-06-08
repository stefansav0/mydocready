"use client";

import React, { useState, useEffect, useRef } from 'react';
import pptxgen from "pptxgenjs";
import { Rnd } from 'react-rnd';
import { 
  Plus, Download, Type, Image as ImageIcon, 
  Palette, Trash2, Layout, X, Move, Presentation, 
  MousePointer2, Smartphone, FileUp, ArrowRight, Pencil
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
  const [isStarted, setIsStarted] = useState(false);

  const [slides, setSlides] = useState<SlideData[]>([
    { 
      id: '1', bgColor: '#ffffff',
      elements: [
        { id: 'el-1', type: 'text', x: 80, y: 80, w: 800, h: 80, content: 'Double Click & Edit Title', fontSize: 48, color: '#1e293b' },
        { id: 'el-2', type: 'text', x: 80, y: 200, w: 600, h: 200, content: '• Drag elements with your finger or mouse\n• Resize using the corner handles\n• Export directly to PPTX', fontSize: 24, color: '#475569' }
      ]
    }
  ]);
  
  const [activeSlideId, setActiveSlideId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'design' | 'text' | 'uploads' | 'none'>('none');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];
  const selectedElement = activeSlide.elements.find(e => e.id === selectedElementId);

  useEffect(() => {
    if (!containerRef.current || !isStarted) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const padding = 24; 
        const availableW = width - padding;
        const availableH = height - padding;
        
        const scaleW = availableW / CANVAS_W;
        const scaleH = availableH / CANVAS_H;
        
        setScale(Math.min(scaleW, scaleH, 1));
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isStarted]); 

  const addSlide = () => {
    const newId = Date.now().toString();
    setSlides([...slides, { id: newId, bgColor: '#ffffff', elements: [] }]);
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
    setSlides(slides.map(s => s.id === activeSlideId ? { ...s, bgColor: color } : s));
  };

  const addTextElement = () => {
    const newEl: CanvasElement = {
      id: Date.now().toString(), type: 'text',
      x: CANVAS_W / 2 - 200, y: CANVAS_H / 2 - 40, w: 400, h: 80, 
      content: 'New Text Box', fontSize: 32, color: '#1e293b'
    };
    setSlides(slides.map(s => s.id === activeSlideId ? { ...s, elements: [...s.elements, newEl] } : s));
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
        setSlides(slides.map(s => s.id === activeSlideId ? { ...s, elements: [...s.elements, newEl] } : s));
        setSelectedElementId(newEl.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    setSlides(slides.map(s => s.id === activeSlideId ? {
      ...s, elements: s.elements.map(el => el.id === selectedElementId ? { ...el, ...updates } : el)
    } : s));
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    setSlides(slides.map(s => s.id === activeSlideId ? {
      ...s, elements: s.elements.filter(el => el.id !== selectedElementId)
    } : s));
    setSelectedElementId(null);
    setActiveTab('none');
  };

  const pxToInches = (px: number, isWidth: boolean) => (px / (isWidth ? CANVAS_W : CANVAS_H)) * (isWidth ? 10 : 5.625);

  const exportPPT = () => {
    let pres = new pptxgen();
    pres.layout = "LAYOUT_16x9";

    slides.forEach(s => {
      let slide = pres.addSlide();
      slide.background = { color: s.bgColor.replace('#', '') };
      
      s.elements.forEach(el => {
        if (el.type === 'text' && el.content) {
          slide.addText(el.content, { 
            x: pxToInches(el.x, true), y: pxToInches(el.y, false), 
            w: pxToInches(el.w, true), h: pxToInches(el.h, false), 
            fontSize: el.fontSize, color: (el.color || '#000000').replace('#', ''), 
            valign: 'top', breakLine: true
          });
        } else if (el.type === 'image' && el.data) {
          slide.addImage({ 
            data: el.data, 
            x: pxToInches(el.x, true), y: pxToInches(el.y, false), 
            w: pxToInches(el.w, true), h: pxToInches(el.h, false),
            sizing: { type: "contain", w: pxToInches(el.w, true), h: pxToInches(el.h, false) }
          });
        }
      });
    });

    pres.writeFile({ fileName: "My_Presentation.pptx" });
  };

  // --- BLOG STYLE INTRO SCREEN ---
  if (!isStarted) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex flex-col items-center py-12 px-6 font-sans text-slate-800 overflow-y-auto">
        <div className="max-w-3xl w-full">
          {/* Header Area */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl text-white mb-6 shadow-lg">
              <Presentation size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
              Welcome to SlideMaker Pro
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              The ultimate in-browser presentation builder designed for speed, simplicity, and perfect mobile responsiveness.
            </p>
          </div>
          
          {/* Blog Content Area */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
            <div className="p-8 md:p-12 prose prose-slate max-w-none">
              
              <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">What is this app?</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Creating presentations on a mobile phone or directly in a web browser is traditionally a clunky experience. 
                SlideMaker Pro changes that. It is a lightweight, responsive tool that allows you to draft slides, position text, 
                and arrange images using a simple drag-and-drop interface that works just as well on a touch screen as it does with a mouse.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 mt-8">How does it work?</h2>
              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600 shrink-0 mt-1"><MousePointer2 size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">1. Tap, Move, and Edit</h4>
                    <p className="text-slate-600">Tap any text or image on the canvas. Use the small floating menu to drag it around, or tap the **Pencil icon** to open the drawer and edit the content, color, or size.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600 shrink-0 mt-1"><Smartphone size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">2. Perfect for Mobile</h4>
                    <p className="text-slate-600">Unlike bulky desktop software, the interface stays out of your way. The sidebars hide automatically on small screens, and text boxes won't lock up your screen while you are trying to position them.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-600 shrink-0 mt-1"><FileUp size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">3. Real PPTX Exports</h4>
                    <p className="text-slate-600">When you are finished, just hit Export. The app packages your design into a genuine `.pptx` file that you can open in Microsoft PowerPoint, Google Slides, or Apple Keynote.</p>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Call to Action Bar */}
            <div className="bg-slate-50 p-8 border-t border-slate-200 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to start designing?</h3>
              <p className="text-slate-500 mb-6 text-sm">Jump straight into the canvas. No sign-up required.</p>
              
              <button 
                onClick={() => setIsStarted(true)}
                className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-black shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center space-x-3 active:scale-95"
              >
                <span>Launch Workspace</span>
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  // --- MAIN APP RENDERING ---
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-[#f8fafc] font-sans text-slate-900 overflow-hidden" onClick={() => { setSelectedElementId(null); setActiveTab('none'); }}>
      
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white h-14 border-b border-gray-200 flex items-center justify-between px-4 z-30 shadow-sm flex-shrink-0">
        <div className="font-black text-lg text-indigo-600 flex items-center gap-2">
          <Layout size={20} /> SlideMaker
        </div>
        <button onClick={exportPPT} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-md active:scale-95 transition-transform">
          Export
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <div className="flex md:flex-col bg-white md:bg-[#0f172a] md:w-20 w-full h-16 md:h-full flex-row items-center justify-around md:justify-start md:py-6 border-t md:border-t-0 border-gray-200 md:border-none shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] md:shadow-none z-40 order-last md:order-first flex-shrink-0 pb-safe">
        <div className="hidden md:flex p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-6 shadow-lg text-white">
          <Layout size={24} />
        </div>

        <button onClick={(e) => { e.stopPropagation(); setActiveTab(activeTab === 'design' ? 'none' : 'design'); }} 
          className={`flex flex-col items-center space-y-1 w-16 py-2 rounded-xl transition-all ${activeTab === 'design' ? 'text-indigo-600 md:text-indigo-400 md:bg-white/10' : 'text-gray-500 md:text-gray-400 hover:text-indigo-500 md:hover:bg-white/5'}`}>
          <Palette size={22} />
          <span className="text-[10px] font-bold tracking-wider">Design</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setActiveTab(activeTab === 'text' ? 'none' : 'text'); }} 
          className={`flex flex-col items-center space-y-1 w-16 py-2 rounded-xl transition-all ${activeTab === 'text' ? 'text-indigo-600 md:text-indigo-400 md:bg-white/10' : 'text-gray-500 md:text-gray-400 hover:text-indigo-500 md:hover:bg-white/5'}`}>
          <Type size={22} />
          <span className="text-[10px] font-bold tracking-wider">Text</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setActiveTab(activeTab === 'uploads' ? 'none' : 'uploads'); }} 
          className={`flex flex-col items-center space-y-1 w-16 py-2 rounded-xl transition-all ${activeTab === 'uploads' ? 'text-indigo-600 md:text-indigo-400 md:bg-white/10' : 'text-gray-500 md:text-gray-400 hover:text-indigo-500 md:hover:bg-white/5'}`}>
          <ImageIcon size={22} />
          <span className="text-[10px] font-bold tracking-wider">Images</span>
        </button>
      </div>

      {/* OPTIONS PANEL CONTEXT DRAWER */}
      <div 
        className={`
          absolute md:relative bottom-16 md:bottom-auto w-full md:w-80 bg-white border-t md:border-t-0 md:border-r border-gray-200 
          shadow-[0_-10px_15px_-3px_rgb(0,0,0,0.1)] md:shadow-none z-30 transition-all duration-300 ease-in-out
          ${activeTab !== 'none' ? 'max-h-[40vh] md:max-h-full overflow-y-auto opacity-100' : 'max-h-0 md:max-h-full overflow-hidden opacity-0 md:opacity-100'}
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 md:p-6 pb-8">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="font-bold text-gray-800 capitalize">{activeTab} Options</h2>
            <button onClick={() => setActiveTab('none')} className="bg-gray-100 p-1.5 rounded-full text-gray-600"><X size={16}/></button>
          </div>

          {activeTab === 'text' && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg hidden md:block text-slate-800">Text Elements</h2>
              <button onClick={addTextElement} className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
                <Plus size={18} /> Add New Text Box
              </button>
              
              {selectedElement?.type === 'text' ? (
                <div className="space-y-4 p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Edit Selected Text</span>
                  </div>
                  <textarea 
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px] text-base"
                    value={selectedElement.content}
                    onChange={(e) => updateSelectedElement({ content: e.target.value })}
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Color</label>
                      <input type="color" value={selectedElement.color || '#000000'} onChange={(e) => updateSelectedElement({ color: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Size (px)</label>
                      <input type="number" value={selectedElement.fontSize} onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value) })} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-center mt-4 border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500">Tap a text box on the canvas and click 'Edit' to configure styling here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'design' && (
             <div className="space-y-4">
               <h2 className="font-bold text-lg hidden md:block text-slate-800">Slide Design</h2>
               <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Slide Background</label>
                 <div className="flex items-center space-x-4">
                   <input type="color" value={activeSlide.bgColor} onChange={(e) => updateSlideBg(e.target.value)} className="w-12 h-12 rounded-xl border-2 border-white shadow-sm cursor-pointer bg-transparent" />
                   <div>
                     <span className="text-sm font-bold text-gray-700 block">HEX Color</span>
                     <span className="text-xs font-mono text-gray-500 uppercase">{activeSlide.bgColor}</span>
                   </div>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'uploads' && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg hidden md:block text-slate-800">Media Assets</h2>
              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors bg-gray-50 group">
                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="bg-indigo-100 p-2.5 rounded-full text-indigo-600 mb-2">
                    <Plus size={20} />
                  </div>
                  <span className="text-xs font-bold text-indigo-600">Upload Image File</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN WORKSPACE CANVAS VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* DESKTOP HEADER BAR */}
        <div className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 z-10 shadow-sm flex-shrink-0" onClick={e => e.stopPropagation()}>
          <div className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Untitled Presentation</div>
          <button 
            onClick={exportPPT}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Download size={18} />
            <span>Export PPTX</span>
          </button>
        </div>

        {/* WORKSPACE AREA */}
        <div 
          className="flex-1 overflow-hidden flex justify-center items-center p-4 bg-slate-100/50 relative" 
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
              className="shadow-2xl absolute bg-white overflow-hidden ring-1 ring-black/5"
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
                  onDragStop={(e, d) => updateSelectedElement({ x: d.x, y: d.y })}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    updateSelectedElement({ w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...position });
                  }}
                  onClick={(e: any) => { 
                    e.stopPropagation(); 
                    setSelectedElementId(el.id); 
                    // FIX: Do NOT automatically open the editing tab here. Just select the element.
                  }}
                  className={`group ${selectedElementId === el.id ? 'ring-2 ring-indigo-500 z-50 bg-blue-50/10' : 'hover:ring-2 hover:ring-indigo-200 z-10'}`}
                >
                  
                  {/* Floating Action Menu (Appears above selected element) */}
                  {selectedElementId === el.id && (
                    <div className="absolute -top-14 right-0 flex gap-2 z-50 bg-white shadow-lg rounded-xl p-1.5 border border-slate-200" style={{ transform: `scale(${1/scale})`, transformOrigin: 'bottom right' }}>
                      <div className="text-slate-500 p-2 cursor-move hover:bg-slate-100 rounded-lg"><Move size={18} /></div>
                      
                      {/* NEW: Edit button to explicitly open the drawer */}
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setActiveTab(el.type === 'image' ? 'uploads' : 'text'); 
                        }} 
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg p-2 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>

                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          deleteSelectedElement(); 
                        }} 
                        className="bg-red-50 text-red-500 hover:bg-red-100 rounded-lg p-2 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}

                  {el.type === 'text' ? (
                    <div 
                      className="w-full h-full p-2 cursor-move flex flex-col justify-start touch-none" 
                      style={{ fontSize: `${el.fontSize}px`, color: el.color }}
                    >
                      {el.content?.split('\n').map((line, i) => (
                        <div key={i} className="min-h-[1.2em] whitespace-pre-wrap leading-tight pointer-events-none">{line}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full cursor-move touch-none">
                      <img src={el.data} className="w-full h-full object-contain pointer-events-none" alt="Asset" />
                    </div>
                  )}
                </Rnd>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SLIDE FILMSTRIP BAR */}
        <div className="h-24 md:h-32 bg-white border-t border-gray-200 flex items-center px-4 md:px-6 space-x-4 overflow-x-auto shadow-inner flex-shrink-0 z-20 overflow-y-hidden custom-scrollbar" onClick={e => e.stopPropagation()}>
          {slides.map((s, idx) => (
            <div key={s.id} className="relative flex-shrink-0 group py-1">
              <div 
                onClick={() => { setActiveSlideId(s.id); setSelectedElementId(null); setActiveTab('none'); }}
                className={`w-28 h-16 md:w-40 md:h-24 rounded-xl border-2 cursor-pointer transition-all ${activeSlideId === s.id ? 'border-indigo-600 ring-4 ring-indigo-100 scale-[1.01]' : 'border-gray-200 hover:border-gray-400'}`}
                style={{ backgroundColor: s.bgColor }}
              >
                <div className="p-1.5 overflow-hidden h-full">
                  {s.elements.filter(e => e.type === 'text')[0] && (
                     <div className="text-[5px] md:text-[8px] font-bold opacity-40 truncate text-slate-800">
                        {s.elements.filter(e => e.type === 'text')[0].content}
                     </div>
                  )}
                </div>
              </div>
              
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <button onClick={(e) => { e.stopPropagation(); deleteSlide(s.id); }} className="bg-white border border-gray-200 text-red-500 p-1 rounded-full shadow-sm">
                   <Trash2 size={10} />
                 </button>
              </div>
              <div className="text-center text-[9px] md:text-xs mt-1 font-bold text-gray-400">Slide {idx + 1}</div>
            </div>
          ))}
          
          <button 
            onClick={addSlide}
            className="w-28 h-16 md:w-40 md:h-24 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
          >
            <Plus size={20} />
            <span className="text-[9px] font-bold mt-1">Add Slide</span>
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}