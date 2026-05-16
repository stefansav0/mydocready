"use client";

import React, { useState, useEffect, useRef } from 'react';
import pptxgen from "pptxgenjs";
import { Rnd } from 'react-rnd';
import { 
  Plus, Download, Type, Image as ImageIcon, 
  Palette, Trash2, Layout, X
} from 'lucide-react';

// Unified element interface for both Text and Images
interface CanvasElement {
  id: string;
  type: 'text' | 'image';
  x: number; y: number; w: number; h: number;
  content?: string;   // For text
  data?: string;      // For image base64
  fontSize?: number;
  color?: string;
}

interface SlideData {
  id: string;
  bgColor: string;
  elements: CanvasElement[];
}

const CANVAS_W = 800;
const CANVAS_H = 450;

export default function MobileFriendlyPresentationMaker() {
  const [slides, setSlides] = useState<SlideData[]>([
    { 
      id: '1', bgColor: '#ffffff',
      elements: [
        { id: 'el-1', type: 'text', x: 40, y: 40, w: 600, h: 60, content: 'Double Click to Edit Title', fontSize: 36, color: '#000000' },
        { id: 'el-2', type: 'text', x: 40, y: 120, w: 400, h: 150, content: '• Drag me around!\n• Resize me.\n• Add more text boxes!', fontSize: 20, color: '#333333' }
      ]
    }
  ]);
  
  const [activeSlideId, setActiveSlideId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'design' | 'text' | 'uploads'>('text');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Responsive Scaling state
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];
  const selectedElement = activeSlide.elements.find(e => e.id === selectedElementId);

  // Handle responsive canvas scaling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Padding buffer of 40px
        const availableWidth = containerWidth - 40; 
        if (availableWidth < CANVAS_W) {
          setScale(availableWidth / CANVAS_W);
        } else {
          setScale(1);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]); // Recalculate if tabs open/close on mobile

  // Slide Management
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

  // Element Management
  const addTextElement = () => {
    const newEl: CanvasElement = {
      id: Date.now().toString(), type: 'text',
      x: 50, y: 50, w: 300, h: 50, content: 'New Text Box', fontSize: 24, color: '#000000'
    };
    setSlides(slides.map(s => s.id === activeSlideId ? { ...s, elements: [...s.elements, newEl] } : s));
    setSelectedElementId(newEl.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEl: CanvasElement = {
          id: Date.now().toString(), type: 'image',
          x: 100, y: 100, w: 200, h: 200, data: reader.result as string
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
  };

  // Export Logic
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
            valign: 'top'
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

    pres.writeFile({ fileName: "Presentation.pptx" });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f0f2f5] font-sans text-slate-900 overflow-hidden" onClick={() => setSelectedElementId(null)}>
      
      {/* MOBILE HEADER (Visible only on small screens) */}
      <div className="md:hidden bg-white h-14 border-b border-gray-200 flex items-center justify-between px-4 z-20">
        <div className="font-bold text-lg text-purple-600">MydocReady</div>
        <button onClick={exportPPT} className="bg-purple-600 text-white px-4 py-1.5 rounded text-sm font-bold shadow">
          Export
        </button>
      </div>

      {/* LEFT SIDEBAR - TOOLS */}
      <div className="flex md:flex-col bg-[#18191c] md:w-20 w-full md:h-full h-16 flex-row items-center md:py-6 justify-around md:justify-start md:space-y-8 text-white z-20 order-last md:order-none pb-safe">
        <div className="hidden md:flex p-3 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg mb-4 shadow-lg shadow-purple-900/50">
          <Layout size={24} />
        </div>
        <button onClick={(e) => { e.stopPropagation(); setActiveTab('design'); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'design' ? 'text-purple-400' : 'text-gray-400'}`}>
          <Palette size={22} />
          <span className="text-[10px] font-medium tracking-wider">Design</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setActiveTab('text'); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'text' ? 'text-purple-400' : 'text-gray-400'}`}>
          <Type size={22} />
          <span className="text-[10px] font-medium tracking-wider">Text</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setActiveTab('uploads'); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'uploads' ? 'text-purple-400' : 'text-gray-400'}`}>
          <ImageIcon size={22} />
          <span className="text-[10px] font-medium tracking-wider">Uploads</span>
        </button>
      </div>

      {/* TOOL SETTINGS PANEL */}
      <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6 overflow-y-auto shadow-sm z-10 max-h-[30vh] md:max-h-full" onClick={e => e.stopPropagation()}>
        
        {/* TEXT PANEL */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg hidden md:block">Text Elements</h2>
            <button onClick={addTextElement} className="w-full py-2 bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200 hover:bg-purple-200 transition flex items-center justify-center gap-2">
              <Plus size={18} /> Add New Text Box
            </button>
            
            {selectedElement?.type === 'text' ? (
              <div className="mt-4 space-y-4 p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Edit Selected Text</span>
                  <button onClick={deleteSelectedElement} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                </div>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
                  value={selectedElement.content}
                  onChange={(e) => updateSelectedElement({ content: e.target.value })}
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Color</label>
                    <input type="color" value={selectedElement.color || '#000000'} onChange={(e) => updateSelectedElement({ color: e.target.value })} className="w-full h-8 rounded cursor-pointer border-none" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Size ({selectedElement.fontSize})</label>
                    <input type="number" value={selectedElement.fontSize} onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value) })} className="w-full p-1 border rounded text-sm" />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center mt-6">Select a text box on the canvas to edit it.</p>
            )}
          </div>
        )}

        {/* DESIGN PANEL */}
        {activeTab === 'design' && (
           <div className="space-y-4">
             <h2 className="font-bold text-lg hidden md:block">Slide Design</h2>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Slide Background</label>
               <div className="flex items-center space-x-3">
                 <input type="color" value={activeSlide.bgColor} onChange={(e) => updateSlideBg(e.target.value)} className="w-12 h-12 rounded-lg border-none cursor-pointer shadow-sm" />
                 <span className="text-sm font-mono text-gray-600">{activeSlide.bgColor}</span>
               </div>
             </div>
           </div>
        )}

        {/* UPLOADS PANEL */}
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg hidden md:block">Images</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors bg-purple-50">
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Download className="text-purple-600 mb-2" size={24} />
                <span className="text-sm font-medium">Click to upload image</span>
              </label>
            </div>
            {selectedElement?.type === 'image' && (
              <div className="mt-4 p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex justify-between items-center">
                 <span className="text-sm font-medium text-gray-700">Image Selected</span>
                 <button onClick={deleteSelectedElement} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium bg-red-50 px-2 py-1 rounded">
                   <Trash2 size={14}/> Delete Image
                 </button>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2 text-center">Uploads are added directly to your slide.</p>
          </div>
        )}
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col relative bg-[#f3f4f6]">
        
        {/* DESKTOP HEADER */}
        <div className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 z-10 shadow-sm" onClick={e => e.stopPropagation()}>
          <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-md">Untitled Presentation</div>
          <button 
            onClick={exportPPT}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Download size={18} />
            <span>Download PPTX</span>
          </button>
        </div>

        {/* INTERACTIVE RESPONSIVE CANVAS AREA */}
        <div className="flex-1 overflow-hidden flex justify-center items-center p-4" ref={containerRef}>
          <div 
            className="shadow-2xl relative bg-white ring-1 ring-gray-200 overflow-hidden"
            style={{ 
              width: `${CANVAS_W}px`, 
              height: `${CANVAS_H}px`, 
              backgroundColor: activeSlide.bgColor,
              transform: `scale(${scale})`, // CSS Magic for mobile responsiveness
              transformOrigin: 'center center'
            }}
          >
            {activeSlide.elements.map(el => (
              <Rnd
                key={el.id}
                bounds="parent"
                scale={scale} // Tell react-rnd about the CSS scale so dragging stays accurate
                position={{ x: el.x, y: el.y }}
                size={{ width: el.w, height: el.h }}
                onDragStop={(e, d) => updateSelectedElement({ x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateSelectedElement({ w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...position });
                }}
                onClick={(e: any) => { e.stopPropagation(); setSelectedElementId(el.id); setActiveTab(el.type === 'image' ? 'uploads' : 'text'); }}
                className={`group ${selectedElementId === el.id ? 'ring-2 ring-purple-500 z-50' : 'hover:ring-1 hover:ring-purple-300 z-10'}`}
              >
                {/* Delete button floats above selected element */}
                {selectedElementId === el.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteSelectedElement(); }} 
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-50 md:hidden"
                  >
                    <X size={12} />
                  </button>
                )}

                {el.type === 'text' ? (
                  <div className="w-full h-full p-1" style={{ fontSize: `${el.fontSize}px`, color: el.color }}>
                    {el.content?.split('\n').map((line, i) => (
                      <div key={i} className="min-h-[1em] whitespace-pre-wrap">{line}</div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full">
                    <img src={el.data} className="w-full h-full object-contain pointer-events-none" alt="asset" />
                  </div>
                )}
              </Rnd>
            ))}
          </div>
        </div>

        {/* BOTTOM FILMSTRIP */}
        <div className="h-24 md:h-32 bg-white border-t border-gray-200 flex items-center px-4 md:px-8 space-x-4 md:space-x-6 overflow-x-auto shadow-inner" onClick={e => e.stopPropagation()}>
          {slides.map((s, idx) => (
            <div key={s.id} className="relative flex-shrink-0 group">
              <div 
                onClick={() => { setActiveSlideId(s.id); setSelectedElementId(null); }}
                className={`w-28 h-16 md:w-40 md:h-24 rounded-lg border-2 cursor-pointer transition-all ${activeSlideId === s.id ? 'border-purple-600 ring-2 md:ring-4 ring-purple-100 scale-105' : 'border-gray-200 hover:border-gray-400'}`}
                style={{ backgroundColor: s.bgColor }}
              >
                <div className="p-2 overflow-hidden h-full">
                  {s.elements.filter(e => e.type === 'text')[0] && (
                     <div className="text-[6px] md:text-[8px] font-bold opacity-50 truncate">
                        {s.elements.filter(e => e.type === 'text')[0].content}
                     </div>
                  )}
                </div>
              </div>
              <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={(e) => { e.stopPropagation(); deleteSlide(s.id); }} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"><Trash2 size={12} /></button>
              </div>
              <div className="text-center text-[10px] md:text-xs mt-1 md:mt-2 font-semibold text-gray-500">{idx + 1}</div>
            </div>
          ))}
          <button 
            onClick={addSlide}
            className="w-28 h-16 md:w-40 md:h-24 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-600 transition-all"
          >
            <Plus size={20} className="md:w-7 md:h-7" />
            <span className="text-[10px] md:text-xs font-bold mt-1">Add Slide</span>
          </button>
        </div>
      </div>
    </div>
  );
}