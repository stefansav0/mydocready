"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { downloadBlob, fileToImageBitmap } from "@/utils/image";
import {
  Download,
  Image as ImageIcon,
  Printer,
  ScanLine,
  Sparkles,
  Trash2,
  FileText,
  RotateCw,
  Loader2,
  Check,
  Crop,
  CheckCircle2,
  Camera,
  X,
  ShieldCheck,
  UploadCloud,
  Move,
  Zap,
  HelpCircle
} from "lucide-react";

const pageSizes = [
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
];

type ScanFilter = "original" | "magic" | "grayscale" | "bw";
type Point = { x: number; y: number };
type ScanItem = {
  id: string;
  file: File;
  originalUrl: string;
  rotation: number;
  corners: Point[] | null;
};

// --- MANUAL PERSPECTIVE WARP ---
const warpPerspective = async (
  file: File,
  corners: Point[],
  filter: ScanFilter,
  rotation: number,
  maxSize?: number
): Promise<HTMLCanvasElement | null> => {
  const bitmap = await fileToImageBitmap(file);
  
  let scale = 1;
  if (maxSize) {
    scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  }

  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = w;
  srcCanvas.height = h;
  const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
  if (!srcCtx) return null;
  srcCtx.drawImage(bitmap, 0, 0, w, h);
  
  const srcImgData = srcCtx.getImageData(0, 0, w, h);
  const pts = corners.map(c => ({ x: c.x * w, y: c.y * h }));

  const topW = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  const botW = Math.hypot(pts[2].x - pts[3].x, pts[2].y - pts[3].y);
  const destW = Math.max(topW, botW);

  const leftH = Math.hypot(pts[3].x - pts[0].x, pts[3].y - pts[0].y);
  const rightH = Math.hypot(pts[2].x - pts[1].x, pts[2].y - pts[1].y);
  const destH = Math.max(leftH, rightH);

  if (destW <= 0 || destH <= 0) return srcCanvas;

  const destCanvas = document.createElement("canvas");
  destCanvas.width = destW;
  destCanvas.height = destH;
  const destCtx = destCanvas.getContext("2d");
  if (!destCtx) return null;

  const destImgData = destCtx.createImageData(destW, destH);

  for (let y = 0; y < destH; y++) {
    const ty = y / destH;
    for (let x = 0; x < destW; x++) {
      const tx = x / destW;

      const sx = (1 - tx) * (1 - ty) * pts[0].x + tx * (1 - ty) * pts[1].x + tx * ty * pts[2].x + (1 - tx) * ty * pts[3].x;
      const sy = (1 - tx) * (1 - ty) * pts[0].y + tx * (1 - ty) * pts[1].y + tx * ty * pts[2].y + (1 - tx) * ty * pts[3].y;

      const srcX = Math.floor(sx);
      const srcY = Math.floor(sy);

      if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
        const srcIdx = (srcY * w + srcX) * 4;
        const destIdx = (y * Math.floor(destW) + x) * 4;
        
        destImgData.data[destIdx] = srcImgData.data[srcIdx];
        destImgData.data[destIdx + 1] = srcImgData.data[srcIdx + 1];
        destImgData.data[destIdx + 2] = srcImgData.data[srcIdx + 2];
        destImgData.data[destIdx + 3] = 255;
      }
    }
  }

  destCtx.putImageData(destImgData, 0, 0);

  const finalCanvas = document.createElement("canvas");
  const isRotated = rotation === 90 || rotation === 270;
  finalCanvas.width = isRotated ? destH : destW;
  finalCanvas.height = isRotated ? destW : destH;
  const finalCtx = finalCanvas.getContext("2d");
  if (!finalCtx) return destCanvas;

  finalCtx.fillStyle = "#ffffff";
  finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  if (filter === "magic") {
    finalCtx.filter = "contrast(140%) saturate(150%) brightness(110%)";
  } else if (filter === "grayscale") {
    finalCtx.filter = "grayscale(100%) contrast(150%) brightness(110%)";
  } else if (filter === "bw") {
    finalCtx.filter = "grayscale(100%) contrast(300%) brightness(130%)";
  }

  finalCtx.translate(finalCanvas.width / 2, finalCanvas.height / 2);
  finalCtx.rotate((rotation * Math.PI) / 180);
  finalCtx.drawImage(destCanvas, -destW / 2, -destH / 2);

  return finalCanvas;
};


// --- DESKTOP/MOBILE CAMERA MODAL ---
const CameraModal = ({ onCapture, onClose }: { onCapture: (file: File) => void, onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(err => {
        console.error("Camera error:", err);
        setError("Could not access camera. Please check your browser permissions.");
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `Camera_Scan_${Date.now()}.jpg`, { type: "image/jpeg" });
            onCapture(file);
          }
        }, "image/jpeg", 0.95);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="flex h-16 items-center justify-between px-6 bg-black text-white">
        <h2 className="font-medium">Scan Document</h2>
        <Button variant="ghost" onClick={onClose} className="hover:bg-white/10 text-white rounded-full h-10 w-10 p-0">
          <X className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-red-400 p-6 text-center">{error}</div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      <div className="h-32 bg-black flex items-center justify-center pb-8">
        <button 
          onClick={takePhoto}
          disabled={!stream}
          className="w-16 h-16 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-white rounded-full" />
        </button>
      </div>
    </div>
  );
};


// --- INTERACTIVE CROPPER COMPONENT ---
const InteractiveCropper = ({ 
  item, 
  onComplete, 
  onCancel 
}: { 
  item: ScanItem; 
  onComplete: (id: string, corners: Point[]) => void; 
  onCancel: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState<number | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  
  const defaultCorners = [
    { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 },
    { x: 0.9, y: 0.9 }, { x: 0.1, y: 0.9 }
  ];
  
  const [corners, setCorners] = useState<Point[]>(item.corners || defaultCorners);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const updateSize = useCallback(() => {
    if (containerRef.current) {
      setImgSize({ 
        w: containerRef.current.clientWidth, 
        h: containerRef.current.clientHeight 
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const natW = e.currentTarget.naturalWidth;
    const natH = e.currentTarget.naturalHeight;
    setAspect(natW / natH);
    setTimeout(updateSize, 10); 
  };

  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingIdx(idx);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (draggingIdx === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;

    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    setCorners(prev => {
      const next = [...prev];
      next[draggingIdx] = { x, y };
      return next;
    });
  }, [draggingIdx]);

  const handlePointerUp = useCallback(() => {
    setDraggingIdx(null);
  }, []);

  useEffect(() => {
    if (draggingIdx !== null) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingIdx, handlePointerMove, handlePointerUp]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6 bg-black border-b border-white/10">
        <h2 className="text-white font-medium">Adjust Bounds</h2>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={onCancel}>Cancel</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => onComplete(item.id, corners)}>
            <Check className="w-4 h-4 mr-2" /> Done
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden p-6 flex items-center justify-center relative touch-none select-none">
        <div 
          ref={containerRef} 
          className="relative inline-block max-h-full max-w-full" 
          style={{ aspectRatio: aspect ? aspect : 'auto', height: aspect ? '100%' : 'auto' }}
        >
          <img
            src={item.originalUrl}
            alt="Crop original"
            onLoad={handleImageLoad}
            className="w-full h-full object-fill pointer-events-none opacity-80"
          />
          
          {imgSize.w > 0 && (
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md"
              viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
            >
              <polygon
                points={corners.map(c => `${c.x * imgSize.w},${c.y * imgSize.h}`).join(" ")}
                fill="rgba(16, 185, 129, 0.15)"
                stroke="#10b981" 
                strokeWidth="2.5"
              />
            </svg>
          )}

          {imgSize.w > 0 && corners.map((corner, idx) => (
            <div
              key={idx}
              onPointerDown={(e) => handlePointerDown(idx, e)}
              className="absolute w-10 h-10 -ml-5 -mt-5 bg-white border-[3px] border-emerald-500 rounded-full cursor-grab active:cursor-grabbing active:scale-110 transition-transform shadow-lg z-10 flex items-center justify-center"
              style={{
                left: `${corner.x * 100}%`,
                top: `${corner.y * 100}%`,
                touchAction: 'none'
              }}
            >
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-20 flex items-center justify-center text-slate-400 text-sm">
        Drag the handles to match the document edges perfectly
      </div>
    </div>
  );
};


// --- LIVE PREVIEW COMPONENT ---
const LivePreviewCard = ({ 
  item, index, filter, onRotate, onRemove, onEditCrop 
}: { 
  item: ScanItem; index: number; filter: ScanFilter;
  onRotate: (id: string) => void; onRemove: (id: string) => void; onEditCrop: (item: ScanItem) => void;
}) => {
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsProcessing(true);

    const generatePreview = async () => {
      try {
        if (!item.corners) return; 
        const canvas = await warpPerspective(item.file, item.corners, filter, item.rotation, 800);
        if (isMounted && canvas) {
          setPreviewSrc(canvas.toDataURL("image/jpeg", 0.7)); 
        }
      } catch (error) {
        console.error("Preview generation failed", error);
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    const timeout = setTimeout(generatePreview, 50);
    return () => { 
      isMounted = false; 
      clearTimeout(timeout);
    };
  }, [item, filter]);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative p-2 aspect-[3/4] flex items-center justify-center bg-slate-100/50">
        
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <span className="text-xs font-medium">Applying Crop & Filter...</span>
          </div>
        ) : (
          <img
            src={previewSrc}
            alt={`Page ${index + 1}`}
            className="max-h-full max-w-full object-contain shadow-sm"
          />
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={() => onEditCrop(item)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white text-slate-700 shadow-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            title="Adjust Crop"
          >
            <Crop className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-bold">Crop</span>
          </button>
          <button
            type="button"
            onClick={() => onRotate(item.id)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white text-slate-700 shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="Rotate"
          >
            <RotateCw className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-bold">Rotate</span>
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="absolute top-4 right-4 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-600"
            title="Remove page"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-white px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 truncate pr-2 uppercase tracking-wider">
          Page {index + 1}
        </span>
      </div>
    </div>
  );
};


// --- EXPLANATION & FAQ COMPONENT ---
const DocumentScannerGuide = () => {
  return (
    <div className="mt-28 space-y-24 border-t border-slate-200 pt-20">
      
      {/* How It Works Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          How the Scanner Works
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Turn your messy, angled photos into professional, flat documents in three simple steps—all directly inside your browser.
        </p>

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm mb-6">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">1. Upload or Snap</h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Drag and drop an existing photo or use the <strong>Open Camera</strong> button to snap a picture of your document on the fly.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm mb-6">
              <Move className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">2. Adjust the Bounds</h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Drag the four corner handles to perfectly outline your paper. The app will use <strong>Perspective Warp</strong> to flatten it out.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm mb-6">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">3. Filter & Export</h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Apply the <strong>Magic Color</strong> filter to make text pop, then instantly download a print-ready PDF or individual JPGs.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="rounded-3xl bg-slate-900 p-10 sm:p-16 text-slate-100 shadow-xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-emerald-400" /> 
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Are my documents uploaded to a server?
            </h4>
            <p className="mt-3 text-slate-400 leading-relaxed">
              <strong>Absolutely not.</strong> All cropping, filtering, and PDF generation happens directly inside your web browser. Your sensitive documents never leave your device, ensuring 100% privacy and security.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">
              What does the "Magic Color" filter do?
            </h4>
            <p className="mt-3 text-slate-400 leading-relaxed">
              It acts like a premium scanner app. It intelligently boosts the contrast to make the background paper pure white and the text crisp, while preserving vibrant ink colors like blue signatures or red stamps.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">
              Can I scan multiple pages at once?
            </h4>
            <p className="mt-3 text-slate-400 leading-relaxed">
              Yes! You can upload as many pages as you need. Adjust the crop for each one, and when you click "Export PDF," the app will automatically combine them into a single, multi-page document.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white">
              How does the corner cropper work?
            </h4>
            <p className="mt-3 text-slate-400 leading-relaxed">
              It uses a mathematical technique called a <em>Perspective Warp Matrix</em>. Even if you took the photo at a sharp angle, pinning the 4 corners tells the app how to stretch and un-skew the image back into a perfect, flat rectangle.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};


export default function ScanDocumentClient() {
  const [items, setItems] = useState<ScanItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [filter, setFilter] = useState<ScanFilter>("magic");
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  const [croppingItem, setCroppingItem] = useState<ScanItem | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.originalUrl));
    };
  }, []);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | File[] | null) => {
      if (!selectedFiles) return;

      const fileArray = Array.isArray(selectedFiles) ? selectedFiles : Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"));
      
      if (!imageFiles.length) {
        alert("Please upload one or more valid image files.");
        return;
      }

      const newItems = imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        originalUrl: URL.createObjectURL(file),
        rotation: 0,
        corners: null,
      }));

      setCroppingItem(newItems[0]); 
      
      const itemsWithDefaults = newItems.map(item => ({
        ...item,
        corners: item.corners || [
          { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 },
          { x: 0.9, y: 0.9 }, { x: 0.1, y: 0.9 }
        ]
      }));

      setItems((prev) => [...prev, ...itemsWithDefaults]);
      setSuccessMessage("");
      setIsDragging(false);
      setShowCamera(false);
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }, [handleFileSelect]);

  const removeItem = useCallback((idToRemove: string) => {
    setItems((prev) => {
      const item = prev.find(i => i.id === idToRemove);
      if (item) URL.revokeObjectURL(item.originalUrl); 
      return prev.filter((i) => i.id !== idToRemove);
    });
  }, []);

  const rotateItem = useCallback((idToRotate: string) => {
    setItems((prev) => prev.map((item) =>
      item.id === idToRotate ? { ...item, rotation: (item.rotation + 90) % 360 } : item
    ));
  }, []);

  const handleCropComplete = (id: string, newCorners: Point[]) => {
    setItems((prev) => prev.map(item => item.id === id ? { ...item, corners: newCorners } : item));
    setCroppingItem(null);
  };

  const clearAll = useCallback(() => {
    items.forEach((item) => URL.revokeObjectURL(item.originalUrl)); 
    setItems([]);
    setSuccessMessage("");
  }, [items]);

  const downloadImages = useCallback(async () => {
    if (!items.length) return;
    setIsBusy(true);
    try {
      if (items.length === 1) {
        const corners = items[0].corners;
        if (!corners) return;
        const canvas = await warpPerspective(items[0].file, corners, filter, items[0].rotation);
        if (!canvas) return;
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
        if (!blob) throw new Error("Image creation failed");
        downloadBlob(blob, `${items[0].file.name.replace(/\.[^/.]+$/, "")}_scan.jpg`);
      } else {
        try {
          const JSZip = (await import("jszip")).default;
          const zip = new JSZip();

          await Promise.all(
            items.map(async (item, index) => {
              const corners = item.corners;
              if (!corners) return;
              const canvas = await warpPerspective(item.file, corners, filter, item.rotation);
              if (!canvas) return;
              const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
              if (!blob) throw new Error("Image creation failed");
              zip.file(`Page_${index + 1}_${item.file.name.replace(/\.[^/.]+$/, "")}.jpg`, blob);
            })
          );

          const zipBlob = await zip.generateAsync({ type: "blob" });
          downloadBlob(zipBlob, "Scanned_Documents.zip");
        } catch (e) {
          console.warn("JSZip missing. Falling back to single downloads.", e);
          for (let i = 0; i < items.length; i++) {
            const corners = items[i].corners;
            if (!corners) continue;
            const canvas = await warpPerspective(items[i].file, corners, filter, items[i].rotation);
            if (!canvas) continue;
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
            if (!blob) continue;
            downloadBlob(blob, `Page_${i + 1}_${items[i].file.name.replace(/\.[^/.]+$/, "")}.jpg`);
            await new Promise(r => setTimeout(r, 400));
          }
        }
      }
      setSuccessMessage("Scanned image(s) downloaded successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not download scanned image(s). Please try again.");
    } finally {
      setIsBusy(false);
    }
  }, [items, filter]);

  const exportPdf = useCallback(async () => {
    if (!items.length) return;
    setIsBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation, unit: "mm", format: pageSize });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 5; 
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      for (let index = 0; index < items.length; index++) {
        const corners = items[index].corners;
        if (!corners) continue;
        const canvas = await warpPerspective(items[index].file, corners, filter, items[index].rotation);
        if (!canvas) continue;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        if (index > 0) doc.addPage();

        const aspect = canvas.width / canvas.height;
        let renderWidth = maxWidth;
        let renderHeight = maxWidth / aspect;
        
        if (renderHeight > maxHeight) {
          renderHeight = maxHeight;
          renderWidth = maxHeight * aspect;
        }

        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;
        doc.addImage(dataUrl, "JPEG", x, y, renderWidth, renderHeight, undefined, "FAST");
      }

      doc.save(`Scan_${new Date().toISOString().split('T')[0]}.pdf`);
      setSuccessMessage("Print-ready PDF generated successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not generate PDF.");
    } finally {
      setIsBusy(false);
    }
  }, [items, orientation, pageSize, filter]);

  const printDocument = useCallback(async () => {
    if (!items.length) return;
    setIsBusy(true);
    try {
      const pageImages = await Promise.all(
        items.map(async (item) => {
          if(!item.corners) return null;
          const canvas = await warpPerspective(item.file, item.corners, filter, item.rotation);
          if (!canvas) return null;
          return canvas.toDataURL("image/jpeg", 0.95);
        })
      );

      const validImages = pageImages.filter(Boolean) as string[];
      if (!validImages.length) return;

      const printWindow = window.open("", "_blank");
      if (!printWindow) throw new Error("Unable to open print window");

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
              body { margin: 0; padding: 24px; background: #525659; display: flex; flex-direction: column; align-items: center; }
              .page { background: white; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); max-width: 1000px; width: 100%; page-break-after: always; }
              img { width: 100%; height: auto; display: block; }
              @page { margin: 0; size: ${pageSize === 'a4' ? 'A4' : 'Letter'} ${orientation}; }
              @media print { body { background: white; padding: 0; } .page { box-shadow: none; margin: 0; height: 100vh; display: flex; align-items: center; justify-content: center; } img { max-width: 100%; max-height: 100vh; object-fit: contain; } }
            </style>
          </head>
          <body>
            ${validImages.map((src) => `<div class="page"><img src="${src}" alt="Scanned document" /></div>`).join("")}
            <script>window.onload = () => { setTimeout(() => window.print(), 500); };</script>
          </body>
        </html>
      `);
      printWindow.document.close();
      setSuccessMessage("Print preview opened.");
    } catch (error) {
      console.error(error);
      alert("Could not open print view.");
    } finally {
      setIsBusy(false);
    }
  }, [items, pageSize, orientation, filter]);

  const selectedFileName = useMemo(() => {
    if (!items.length) return "No documents selected yet";
    if (items.length === 1) return items[0].file.name;
    return `${items.length} documents selected`;
  }, [items]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* CAMERA MODAL */}
      {showCamera && (
        <CameraModal 
          onCapture={(file) => handleFileSelect([file])}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* FULLSCREEN CROP MODAL */}
      {croppingItem && (
        <InteractiveCropper 
          key={croppingItem.id}
          item={croppingItem} 
          onComplete={handleCropComplete} 
          onCancel={() => setCroppingItem(null)} 
        />
      )}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.95fr]">
          <div className="space-y-7">
            
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  
                  <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Scan, Crop, Export.
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Hover over your images to manually adjust the perspective bounds, apply scanner filters, and export perfectly sized print-ready PDFs.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900 px-5 py-4 text-slate-100 shadow-lg shadow-slate-900/10 min-w-[140px] text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">Pages</p>
                  <p className="mt-2 text-4xl font-bold">{items.length}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_0.85fr]">
              <Card className="overflow-hidden border-slate-200 shadow-sm">
                <div className="bg-slate-900 px-6 py-4">
                  <CardTitle className="text-white text-lg">1. Setup Document</CardTitle>
                </div>
                <CardContent className="space-y-6 p-6 bg-white">
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                      isDragging 
                        ? "border-emerald-500 bg-emerald-50" 
                        : "border-slate-300 bg-slate-50"
                    }`}
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm shadow-slate-200 mb-4">
                      <ImageIcon className={`h-8 w-8 ${isDragging ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">Drop document photos here</p>
                    <p className="mt-1 text-sm text-slate-500 mb-6">Supports JPEG, PNG, WEBP</p>
                    
                    {/* CAMERA & UPLOAD BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-20">
                      <label className="cursor-pointer bg-slate-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ImageIcon className="w-4 h-4" />
                        Select Files
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileSelect(e.target.files)}
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowCamera(true)}
                        className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Camera className="w-4 h-4" />
                        Open Camera
                      </button>
                    </div>

                    {items.length > 0 && (
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm z-20 relative">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {selectedFileName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-sm font-medium text-slate-700 mb-2">Scanner Enhancement Filter</span>
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={filter}
                        onChange={(event) => setFilter(event.target.value as ScanFilter)}
                      >
                        <option value="magic">Magic Color (Best for Documents)</option>
                        <option value="bw">B&W (High Contrast text)</option>
                        <option value="grayscale">Grayscale (Smooth monochrome)</option>
                        <option value="original">Original Photo (No filter)</option>
                      </select>
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <span className="block text-sm font-medium text-slate-700 mb-2">PDF Target Size</span>
                        <select
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
                          value={pageSize}
                          onChange={(event) => setPageSize(event.target.value as "a4" | "letter")}
                        >
                          {pageSizes.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>

                      <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <span className="block text-sm font-medium text-slate-700 mb-2">Orientation</span>
                        <select
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
                          value={orientation}
                          onChange={(event) => setOrientation(event.target.value as "portrait" | "landscape")}
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-slate-200 shadow-sm flex flex-col">
                <div className="bg-slate-900 px-6 py-4">
                  <CardTitle className="text-white text-lg">2. Finalize & Export</CardTitle>
                </div>
                <CardContent className="space-y-4 p-6 bg-white flex-1 flex flex-col justify-between">
                  <div className="grid gap-3">
                    <Button
                      onClick={exportPdf}
                      disabled={!items.length || isBusy}
                      className="w-full justify-center bg-emerald-600 text-white hover:bg-emerald-700 h-12 rounded-xl text-base font-medium shadow-sm"
                    >
                      {isBusy ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileText className="mr-2 h-5 w-5" />}
                      Export Print-Ready PDF
                    </Button>
                    <Button
                      onClick={printDocument}
                      disabled={!items.length || isBusy}
                      variant="outline"
                      className="w-full justify-center border-slate-200 bg-white text-slate-900 hover:bg-slate-50 h-12 rounded-xl text-base shadow-sm"
                    >
                      {isBusy ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Printer className="mr-2 h-5 w-5" />}
                      Open Quick Print
                    </Button>
                    <Button
                      onClick={downloadImages}
                      disabled={!items.length || isBusy}
                      className="w-full justify-center bg-slate-100 text-slate-900 hover:bg-slate-200 h-12 rounded-xl text-base shadow-sm"
                    >
                      {isBusy ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                      Download JPG{items.length > 1 ? "s (ZIP)" : ""}
                    </Button>
                  </div>

                  <div className="space-y-4 mt-6">
                    {successMessage && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 flex-shrink-0" /> {successMessage}
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      onClick={clearAll}
                      disabled={isBusy || !items.length}
                      className="w-full justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 h-12 rounded-xl"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Clear all pages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden border-slate-200 shadow-sm h-full flex flex-col">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <CardTitle className="text-white text-lg">Document Pages</CardTitle>
                <span className="text-emerald-400 text-sm font-medium">
                  {items.length > 0 ? "Hover to Crop" : ""}
                </span>
              </div>
              
              <CardContent className="p-6 bg-slate-50 flex-1">
                {items.length ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    {items.map((item, index) => (
                      <LivePreviewCard 
                        key={item.id} 
                        item={item} 
                        index={index}
                        filter={filter}
                        onRotate={rotateItem}
                        onRemove={removeItem}
                        onEditCrop={setCroppingItem}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white py-12 text-center">
                    <ScanLine className="mb-4 h-12 w-12 text-slate-300" />
                    <p className="text-lg font-medium text-slate-900">Awaiting documents</p>
                    <p className="mt-2 text-sm text-slate-500 max-w-[250px]">
                      Upload files or open your camera to begin scanning.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- GUIDE & FAQ SECTION --- */}
        <DocumentScannerGuide />

      </section>
    </main>
  );
}