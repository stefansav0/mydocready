"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import dynamic from 'next/dynamic';
import { 
  Download, Plus, Type, Layout, X, Image as ImageIcon, 
  Palette, LayoutTemplate, Trash2 
} from 'lucide-react';

// A4 Dimensions at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

// Unified interface for both Text and Images
interface ResumeElement {
  id: string;
  type: 'text' | 'image';
  content?: string;
  data?: string; // base64 for images
  x: number; y: number; w: number; h: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
}

// --- Pre-built Templates ---
const TEMPLATES: Record<string, { bgColor: string, elements: ResumeElement[] }> = {
  blank: { bgColor: '#ffffff', elements: [] },
  
  formal: { // Great for standard/government/administrative applications
    bgColor: '#ffffff',
    elements: [
      { id: 't1-1', type: 'text', content: 'YOUR NAME', x: 50, y: 50, w: 694, h: 50, fontSize: 32, fontWeight: 'bold', color: '#000000' },
      { id: 't1-2', type: 'text', content: '123 Main St, City, State | (555) 123-4567 | email@example.com', x: 50, y: 90, w: 694, h: 30, fontSize: 12, fontWeight: 'normal', color: '#4B5563' },
      { id: 't1-3', type: 'text', content: 'OBJECTIVE', x: 50, y: 140, w: 694, h: 30, fontSize: 16, fontWeight: 'bold', color: '#000000' },
      { id: 't1-4', type: 'text', content: '____________________________________________________________________________________', x: 50, y: 155, w: 694, h: 20, fontSize: 14, fontWeight: 'normal', color: '#000000' },
      { id: 't1-5', type: 'text', content: 'Highly motivated professional seeking a role to utilize my extensive skills in administration and public service.', x: 50, y: 180, w: 694, h: 40, fontSize: 12, fontWeight: 'normal', color: '#374151' },
      { id: 't1-6', type: 'text', content: 'EDUCATION', x: 50, y: 240, w: 694, h: 30, fontSize: 16, fontWeight: 'bold', color: '#000000' },
      { id: 't1-7', type: 'text', content: '____________________________________________________________________________________', x: 50, y: 255, w: 694, h: 20, fontSize: 14, fontWeight: 'normal', color: '#000000' },
      { id: 't1-8', type: 'text', content: 'Bachelor of Arts - State University (2020-2024)\n• Passed with First Class Honors\n• Board Result: 92%', x: 50, y: 280, w: 694, h: 80, fontSize: 12, fontWeight: 'normal', color: '#374151' },
    ]
  },

  modern: { // Great for tech/private sector
    bgColor: '#f8fafc',
    elements: [
      { id: 't2-1', type: 'text', content: 'ALEX SMITH', x: 50, y: 60, w: 400, h: 60, fontSize: 48, fontWeight: 'bold', color: '#1e40af' },
      { id: 't2-2', type: 'text', content: 'Full Stack Developer', x: 50, y: 120, w: 300, h: 30, fontSize: 18, fontWeight: 'bold', color: '#3b82f6' },
      { id: 't2-3', type: 'text', content: 'EXPERIENCE', x: 50, y: 190, w: 200, h: 30, fontSize: 16, fontWeight: 'bold', color: '#1e40af' },
      { id: 't2-4', type: 'text', content: 'Tech Corp | 2022 - Present\n• Built highly scalable web applications\n• Improved load times by 40%', x: 50, y: 230, w: 450, h: 100, fontSize: 14, fontWeight: 'normal', color: '#475569' },
      { id: 't2-5', type: 'text', content: 'SKILLS', x: 550, y: 190, w: 200, h: 30, fontSize: 16, fontWeight: 'bold', color: '#1e40af' },
      { id: 't2-6', type: 'text', content: '• Next.js\n• TypeScript\n• Tailwind CSS\n• Node.js', x: 550, y: 230, w: 200, h: 120, fontSize: 14, fontWeight: 'normal', color: '#475569' },
    ]
  }
};

export default function CanvaResumeMaker() {
  const [elements, setElements] = useState<ResumeElement[]>(TEMPLATES.modern.elements);
  const [bgColor, setBgColor] = useState<string>(TEMPLATES.modern.bgColor);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'elements'>('templates');
  const [scale, setScale] = useState(1);
  
  const workspaceRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const selectedElement = elements.find(e => e.id === selectedId);

  // Responsive Scaling
  useEffect(() => {
    const calculateScale = () => {
      if (workspaceRef.current) {
        const { clientWidth, clientHeight } = workspaceRef.current;
        const scaleW = (clientWidth - 40) / A4_WIDTH;
        const scaleH = (clientHeight - 40) / A4_HEIGHT;
        setScale(Math.min(scaleW, scaleH));
      }
    };
    const observer = new ResizeObserver(calculateScale);
    if (workspaceRef.current) observer.observe(workspaceRef.current);
    window.addEventListener('resize', calculateScale);
    return () => { observer.disconnect(); window.removeEventListener('resize', calculateScale); };
  }, []);

  // --- Actions ---
  const loadTemplate = (templateKey: string) => {
    // Alert user if they have existing data so they don't lose it accidentally
    if (elements.length > 0 && !window.confirm("Changing templates will clear your current canvas. Continue?")) return;
    setElements(TEMPLATES[templateKey].elements);
    setBgColor(TEMPLATES[templateKey].bgColor);
    setSelectedId(null);
  };

  const addText = () => {
    const newEl: ResumeElement = {
      id: Date.now().toString(), type: 'text', content: 'Add your text here',
      x: 100, y: 100, w: 300, h: 40, fontSize: 16, fontWeight: 'normal', color: '#000000'
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEl: ResumeElement = {
          id: Date.now().toString(), type: 'image', data: reader.result as string,
          x: 100, y: 100, w: 150, h: 150
        };
        setElements([...elements, newEl]);
        setSelectedId(newEl.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateElement = (updates: Partial<ResumeElement>) => {
    if (!selectedId) return;
    setElements(elements.map(el => el.id === selectedId ? { ...el, ...updates } : el));
  };

  const deleteSelected = () => {
    setElements(elements.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  // --- Export to PDF (With strict TS fixes) ---
  const downloadPDF = async () => {
    setSelectedId(null); // Hide UI borders
    const element = resumeRef.current;
    if (!element) return; 

    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: 0,
      filename: 'My_Pro_Resume.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, 
      jsPDF: { 
        unit: 'px', 
        format: [A4_WIDTH, A4_HEIGHT] as [number, number], 
        orientation: 'portrait' as const 
      }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden" onClick={() => setSelectedId(null)}>
      
      {/* LEFT NAVIGATION ICONS */}
      <div className="bg-[#18191c] w-full md:w-20 md:h-full h-16 flex md:flex-col items-center py-4 md:py-6 justify-around md:justify-start md:space-y-8 z-30 shrink-0">
        <button onClick={(e) => { e.stopPropagation(); setActiveTab('templates'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'templates' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}><LayoutTemplate size={22} /><span className="text-[10px] font-medium">Templates</span></button>
        <button onClick={(e) => { e.stopPropagation(); setActiveTab('text'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'text' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}><Type size={22} /><span className="text-[10px] font-medium">Text</span></button>
        <button onClick={(e) => { e.stopPropagation(); setActiveTab('elements'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'elements' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}><ImageIcon size={22} /><span className="text-[10px] font-medium">Elements</span></button>
      </div>

      {/* SETTINGS PANEL */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col z-20 shadow-lg overflow-y-auto" onClick={e => e.stopPropagation()}>
        
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <h2 className="font-extrabold text-xl">Templates</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => loadTemplate('formal')} className="border-2 hover:border-indigo-500 rounded-lg overflow-hidden group">
                <div className="bg-white h-32 w-full p-2 text-left">
                  <div className="h-2 w-full bg-gray-800 mb-2"></div>
                  <div className="h-1 w-3/4 bg-gray-300 mb-1"></div>
                  <div className="h-1 w-1/2 bg-gray-300"></div>
                </div>
                <div className="bg-gray-100 p-2 text-xs font-bold text-center group-hover:bg-indigo-50 group-hover:text-indigo-700">Standard / Formal</div>
              </button>
              
              <button onClick={() => loadTemplate('modern')} className="border-2 hover:border-indigo-500 rounded-lg overflow-hidden group">
                <div className="bg-slate-50 h-32 w-full p-2 text-left flex flex-col">
                  <div className="h-3 w-3/4 bg-blue-600 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-10 w-1/2 bg-gray-200"></div>
                    <div className="h-10 w-1/2 bg-gray-200"></div>
                  </div>
                </div>
                <div className="bg-gray-100 p-2 text-xs font-bold text-center group-hover:bg-indigo-50 group-hover:text-indigo-700">Modern Tech</div>
              </button>

              <button onClick={() => loadTemplate('blank')} className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-lg overflow-hidden group col-span-2">
                <div className="bg-white h-20 w-full flex items-center justify-center">
                  <Plus className="text-gray-400 group-hover:text-indigo-500" />
                </div>
                <div className="bg-gray-50 p-2 text-xs font-bold text-center group-hover:text-indigo-700">Start Blank Canvas</div>
              </button>
            </div>

            <div className="pt-6 border-t mt-6">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Paper Color</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-12 rounded-lg cursor-pointer border-none shadow-sm" />
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-6">
            <h2 className="font-extrabold text-xl">Text</h2>
            <button onClick={addText} className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 flex items-center justify-center gap-2 transition-colors">
              <Type size={18} /> Add Text Block
            </button>
            
            {selectedElement?.type === 'text' && (
              <div className="space-y-4 animate-in fade-in p-4 border rounded-xl bg-gray-50">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Edit Content</label>
                <textarea 
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                  value={selectedElement.content}
                  onChange={(e) => updateElement({ content: e.target.value })}
                />
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Size ({selectedElement.fontSize})</label>
                    <input type="number" value={selectedElement.fontSize} onChange={(e) => updateElement({ fontSize: parseInt(e.target.value) })} className="w-full p-2 border rounded-lg bg-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Weight</label>
                    <select value={selectedElement.fontWeight} onChange={(e) => updateElement({ fontWeight: e.target.value })} className="w-full p-2 border rounded-lg bg-white">
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Color</label>
                  <input type="color" value={selectedElement.color || '#000000'} onChange={(e) => updateElement({ color: e.target.value })} className="w-full h-8 rounded cursor-pointer border-none" />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-6">
             <h2 className="font-extrabold text-xl">Uploads</h2>
             <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors bg-indigo-50/50 relative overflow-hidden group">
               <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onChange={handleImageUpload} />
               <ImageIcon className="text-indigo-400 mb-3 mx-auto group-hover:scale-110 transition-transform" size={36} />
               <span className="font-bold text-indigo-900 block">Upload Image</span>
               <span className="text-xs text-indigo-500 mt-1 block">Add headshots or logos</span>
             </div>
          </div>
        )}

        {/* Global Delete Button if anything is selected */}
        {selectedId && (
          <button onClick={deleteSelected} className="w-full py-3 mt-4 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2">
            <Trash2 size={16} /> Delete Selected
          </button>
        )}

        <div className="mt-auto pt-6 border-t border-gray-100">
           <button onClick={downloadPDF} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
             <Download size={18} /> Download PDF
           </button>
        </div>
      </div>

      {/* WORKSPACE & CANVAS */}
      <div className="flex-1 flex justify-center items-center overflow-hidden relative p-4 md:p-8 bg-[#f3f4f6] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" ref={workspaceRef}>
        
        {/* The Actual A4 Canvas */}
        <div 
          className="shadow-2xl relative transition-shadow"
          style={{ 
            width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px`, 
            backgroundColor: bgColor,
            transform: `scale(${scale})`, transformOrigin: 'center center'
          }}
        >
          {/* Capture Box for html2pdf */}
          <div ref={resumeRef} className="w-full h-full relative overflow-hidden" style={{ backgroundColor: bgColor }}>
            {elements.map(el => (
              <Rnd
                key={el.id} bounds="parent" scale={scale}
                position={{ x: el.x, y: el.y }} size={{ width: el.w, height: el.h }}
                onDragStop={(e, d) => updateElement({ x: d.x, y: d.y })}
                onResizeStop={(e, dir, ref, delta, pos) => updateElement({ w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...pos })}
                onClick={(e: any) => { 
                  e.stopPropagation(); 
                  setSelectedId(el.id); 
                  setActiveTab(el.type === 'text' ? 'text' : 'elements');
                }}
                className={`group absolute ${selectedId === el.id ? 'ring-2 ring-indigo-500 z-50' : 'hover:ring-1 hover:ring-indigo-300/50 z-10'}`}
              >
                {el.type === 'text' ? (
                  <div className="w-full h-full leading-tight" style={{ fontSize: `${el.fontSize}px`, fontWeight: el.fontWeight, color: el.color }}>
                    {el.content?.split('\n').map((line, i) => <div key={i} className="min-h-[1em] whitespace-pre-wrap">{line}</div>)}
                  </div>
                ) : (
                  <div className="w-full h-full pointer-events-none">
                    <img src={el.data} className="w-full h-full object-contain" alt="Resume Asset" draggable="false" />
                  </div>
                )}
              </Rnd>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}