"use client";

import { useEffect, useRef, useState } from "react";
import { fileToImageBitmap, drawCover, downloadBlob } from "@/utils/image";
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Eraser, 
  Download, 
  Move, 
  ZoomIn, 
  Type, 
  PaintBucket,
  ShieldCheck,
  Lightbulb,
  Camera,
  CheckCircle2
} from "lucide-react";
import * as removeBg from "@imgly/background-removal";

const OUT_W = 413;
const OUT_H = 531;

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<ImageBitmap | null>(null);
  const [bg, setBg] = useState<"white" | "blue" | "transparent">("white");
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [loadingBg, setLoadingBg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, bg, zoom, offsetX, offsetY, name, date]);

  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = OUT_W;
    canvas.height = OUT_H;

    // Clear canvas first
    ctx.clearRect(0, 0, OUT_W, OUT_H);

    // Draw background color (if not transparent)
    if (bg !== "transparent") {
      ctx.fillStyle = bg === "white" ? "#ffffff" : "#1E40AF";
      ctx.fillRect(0, 0, OUT_W, OUT_H);
    }

    // Draw the image with zoom and pan
    if (img) {
      drawCover(ctx, img, 0, 0, OUT_W, OUT_H, zoom, offsetX, offsetY);
    }

    // Draw name and date on the bottom of the photo
    if (name || date) {
      ctx.fillStyle = bg === "white" ? "#000000" : "#ffffff";
      ctx.font = "bold 16px 'Inter', sans-serif";
      ctx.textAlign = "center";
      
      // Add a subtle text shadow for better readability
      ctx.shadowColor = bg === "white" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 4;

      if (name) ctx.fillText(name, OUT_W / 2, OUT_H - 40);
      if (date) ctx.fillText(date, OUT_W / 2, OUT_H - 20);

      ctx.shadowBlur = 0; // Reset shadow
    }
  }

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/")) {
      setError(null);
      try {
        const bmp = await fileToImageBitmap(f);
        setFile(f);
        setImg(bmp);
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
      } catch (err) {
        console.error("Failed to read image:", err);
        setError("Could not load image. Please try a different file.");
      }
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    // Fill transparent background with white before downloading
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = OUT_W;
    downloadCanvas.height = OUT_H;
    const dCtx = downloadCanvas.getContext('2d');
    if (dCtx) {
      if (bg === "transparent") {
         dCtx.fillStyle = "#ffffff";
         dCtx.fillRect(0, 0, OUT_W, OUT_H);
      }
      dCtx.drawImage(canvasRef.current, 0, 0);
      
      downloadCanvas.toBlob(
        (blob) => {
          if (blob) downloadBlob(blob, `passport_${name || "photo"}.jpg`);
        },
        "image/jpeg",
        0.98
      );
    }
  };

  const handleRemoveBg = async () => {
    if (!file) return;
    setLoadingBg(true);
    setError(null);
    try {
      // Optimized for speed
      const config: removeBg.Config = {
        model: "isnet",
        output: { format: "image/png", quality: 1 }
      };

      const resultBlob = await removeBg.removeBackground(file, config);
      const resultFile = new File([resultBlob], file.name, { type: resultBlob.type });
      const bmp = await fileToImageBitmap(resultFile);

      setImg(bmp);
      setBg("white"); 
    } catch (err) {
      console.error("Background removal error:", err);
      setError("AI Background removal failed. Please try a photo with a clearer background.");
    } finally {
      setLoadingBg(false);
    }
  };

  function startDrag(clientX: number, clientY: number) {
    dragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  }
  function moveDrag(clientX: number, clientY: number) {
    if (!dragging.current) return;
    const dx = (clientX - lastPos.current.x) / zoom;
    const dy = (clientY - lastPos.current.y) / zoom;
    lastPos.current = { x: clientX, y: clientY };
    setOffsetX((o) => o + dx);
    setOffsetY((o) => o + dy);
  }
  function endDrag() { dragging.current = false; }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 font-sans pb-20">
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Create Professional <span className="text-blue-600">Passport Photos</span> Instantly
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Stop paying for photo booths. Upload a selfie, let our AI remove the background, and download a print-ready 35×45mm photo for free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-1.5"><ShieldCheck size={18} className="text-green-500"/> 100% Private (Runs Locally)</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-blue-500"/> AI Auto-Erase</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-purple-500"/> Free Forever</span>
          </div>
        </div>
      </div>

      {/* Main App Interface */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-200">
          
          {/* LEFT: Canvas Preview */}
          <div className="lg:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-gray-200 relative min-h-[500px]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {!img ? (
              <label className="flex flex-col items-center justify-center w-full max-w-sm h-80 border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer bg-white hover:bg-gray-50 hover:border-blue-400 transition-all shadow-sm group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="mb-2 text-lg font-semibold text-gray-800">Upload Image</p>
                  <p className="text-sm text-gray-500">Tap or drag & drop a photo</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleInput} />
              </label>
            ) : (
              <div className="relative group flex flex-col items-center w-full">
                <div 
                  className="relative cursor-move shadow-2xl rounded-sm overflow-hidden ring-4 ring-white transition-transform active:scale-[0.98] w-full max-w-[300px] sm:max-w-[350px] aspect-[413/531]"
                  onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                  onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
                  onMouseUp={endDrag}
                  onMouseLeave={endDrag}
                  onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchEnd={endDrag}
                >
                  <canvas 
                    ref={canvasRef} 
                    className={`w-full h-full object-contain ${bg === 'transparent' ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] bg-gray-100' : ''}`}
                  />
                  
                  {loadingBg && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                      <p className="font-semibold text-blue-800 animate-pulse">Removing Background...</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 bg-white py-2 px-4 rounded-full shadow-sm">
                  <Move size={16} /> Drag photo to reposition
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Tools Panel */}
          <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col gap-8 bg-white">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-start gap-3">
                <span>⚠️</span> {error}
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Eraser size={14} /> 1. Magic Erase
              </h3>
              <button
                type="button"
                onClick={handleRemoveBg}
                disabled={!img || loadingBg}
                className="w-full relative px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 text-lg"
              >
                <ImageIcon size={22} />
                {loadingBg ? "Processing..." : "Remove Background"}
              </button>
            </div>

            <div className={`transition-opacity ${!img ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <PaintBucket size={14} /> 2. Background Color
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setBg("white")} className={`py-3 rounded-xl border-2 font-medium transition-all ${bg === 'white' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>White</button>
                <button onClick={() => setBg("blue")} className={`py-3 rounded-xl border-2 font-medium transition-all ${bg === 'blue' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>Blue</button>
                <button onClick={() => setBg("transparent")} className={`py-3 rounded-xl border-2 font-medium text-sm transition-all ${bg === 'transparent' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>Transparent</button>
              </div>
            </div>

            <div className={`transition-opacity ${!img ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ZoomIn size={14} /> 3. Adjust Fit
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                  type="range" min={0.5} max={3} step={0.01} value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 font-medium mt-2">
                  <span>Zoom Out</span>
                  <span>Zoom In</span>
                </div>
              </div>
            </div>

            <div className={`transition-opacity ${!img ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Type size={14} /> 4. Add Details (If Required)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Print Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 p-3 outline-none" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 p-3 outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-auto">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!img}
                className="w-full px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-lg shadow-md"
              >
                <Download size={20} />
                Download Standard JPG
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* --- NEW VALUE CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Guidelines */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl"><Camera size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">How to Take a Perfect Photo</h2>
            </div>
            <p className="text-gray-600 mb-6">
              To ensure your passport or visa application isn't rejected, follow these government-standard guidelines before uploading your photo.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <strong className="block text-gray-900">Face the Light</strong>
                  <span className="text-gray-500 text-sm">Stand facing a window during the day. Avoid harsh shadows across your face or harsh flash lighting.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <strong className="block text-gray-900">Neutral Expression</strong>
                  <span className="text-gray-500 text-sm">Keep your mouth closed and eyes open. Look directly into the camera lens, not at the screen.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <strong className="block text-gray-900">Remove Accessories</strong>
                  <span className="text-gray-500 text-sm">Take off glasses, hats, and large jewelry. Both ears and your hairline should be clearly visible.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column: How it works & Privacy */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Lightbulb size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-900">How Our Technology Works</h2>
            </div>
            
            <div className="prose prose-blue text-gray-600">
              <p>
                We use an advanced <strong>WebAssembly (WASM) AI model</strong> to process your image. Traditionally, tools like this force you to upload your photo to a remote server, process it there, and download it back.
              </p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">Your Privacy is Guaranteed</h3>
              <p>
                Because our AI runs entirely inside your web browser, <strong>your photo never leaves your device</strong>. We have no databases, no servers holding your face, and no tracking. Once you close the tab, your photo is gone forever.
              </p>

              <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="font-semibold text-gray-800">What size is the downloaded photo?</dt>
                    <dd className="text-sm text-gray-500 mt-1">The photo downloads exactly at 413x531 pixels, which perfectly matches the standard 35x45mm passport size when printed at 300 DPI.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Why did the background removal fail?</dt>
                    <dd className="text-sm text-gray-500 mt-1">Our AI needs to distinguish you from the background. Try taking a photo against a plain wall (not heavily textured) with good lighting.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}