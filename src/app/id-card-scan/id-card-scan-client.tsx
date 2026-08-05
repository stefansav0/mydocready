"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  Camera,
  X,
  CreditCard
} from "lucide-react";

const pageSizes = [
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
];

type ScanFilter = "original" | "magic" | "grayscale" | "bw";
type Point = { x: number; y: number };
type CardSlot = "front" | "back";

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
        <h2 className="font-medium">Scan ID Card</h2>
        <Button variant="ghost" onClick={onClose} className="hover:bg-white/10 text-white rounded-full h-10 w-10 p-0">
          <X className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-red-400 p-6 text-center">{error}</div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[80%] max-w-md aspect-[1.586/1] border-2 border-white/50 rounded-xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    <p className="absolute -top-8 left-0 right-0 text-center text-white/80 font-medium">Position ID inside frame</p>
                </div>
            </div>
          </>
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
  slotLabel,
  onComplete, 
  onCancel 
}: { 
  item: ScanItem; 
  slotLabel: string;
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
        <h2 className="text-white font-medium">Crop {slotLabel}</h2>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={onCancel}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => onComplete(item.id, corners)}>
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
                fill="rgba(37, 99, 235, 0.15)"
                stroke="#3b82f6" 
                strokeWidth="2.5"
              />
            </svg>
          )}

          {imgSize.w > 0 && corners.map((corner, idx) => (
            <div
              key={idx}
              onPointerDown={(e) => handlePointerDown(idx, e)}
              className="absolute w-12 h-12 -ml-6 -mt-6 bg-white/20 border-2 border-blue-500/50 rounded-full cursor-grab active:cursor-grabbing active:scale-110 transition-transform shadow-lg z-10 flex items-center justify-center"
              style={{
                left: `${corner.x * 100}%`,
                top: `${corner.y * 100}%`,
                touchAction: 'none'
              }}
            >
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-20 flex items-center justify-center text-slate-400 text-sm">
        Drag the corners to match the edges of the ID Card
      </div>
    </div>
  );
};


export default function IdCardScanClient() {
  const [frontCard, setFrontCard] = useState<ScanItem | null>(null);
  const [backCard, setBackCard] = useState<ScanItem | null>(null);
  
  const [isBusy, setIsBusy] = useState(false);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [filter, setFilter] = useState<ScanFilter>("magic");
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  const [croppingItem, setCroppingItem] = useState<{ item: ScanItem, slot: CardSlot } | null>(null);
  const [showCameraFor, setShowCameraFor] = useState<CardSlot | null>(null);

  // FIXED BUG: Safe memory cleanup ONLY on component unmount
  const frontRef = useRef<string | null>(null);
  const backRef = useRef<string | null>(null);
  
  useEffect(() => { frontRef.current = frontCard?.originalUrl || null; }, [frontCard]);
  useEffect(() => { backRef.current = backCard?.originalUrl || null; }, [backCard]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (frontRef.current) URL.revokeObjectURL(frontRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (backRef.current) URL.revokeObjectURL(backRef.current);
    };
  }, []);

  const handleFileSelect = (slot: CardSlot, fileList: FileList | File[] | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = Array.isArray(fileList) ? fileList[0] : fileList[0];
    
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    // Safely revoke the OLD image if user replaces the slot
    if (slot === "front" && frontCard) URL.revokeObjectURL(frontCard.originalUrl);
    if (slot === "back" && backCard) URL.revokeObjectURL(backCard.originalUrl);

    const newItem: ScanItem = {
      id: crypto.randomUUID(),
      file,
      originalUrl: URL.createObjectURL(file),
      rotation: 0,
      corners: [
        { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 },
        { x: 0.9, y: 0.9 }, { x: 0.1, y: 0.9 }
      ],
    };

    if (slot === "front") setFrontCard(newItem);
    else setBackCard(newItem);
    
    setCroppingItem({ item: newItem, slot });
    setShowCameraFor(null);
  };

  const removeCard = (slot: CardSlot) => {
    if (slot === "front") {
      if (frontCard) URL.revokeObjectURL(frontCard.originalUrl);
      setFrontCard(null);
    } else {
      if (backCard) URL.revokeObjectURL(backCard.originalUrl);
      setBackCard(null);
    }
  };

  const rotateCard = (slot: CardSlot) => {
    if (slot === "front" && frontCard) {
      setFrontCard({ ...frontCard, rotation: (frontCard.rotation + 90) % 360 });
    } else if (slot === "back" && backCard) {
      setBackCard({ ...backCard, rotation: (backCard.rotation + 90) % 360 });
    }
  };

  const handleCropComplete = (id: string, corners: Point[]) => {
    if (croppingItem?.slot === "front" && frontCard) {
      setFrontCard({ ...frontCard, corners });
    } else if (croppingItem?.slot === "back" && backCard) {
      setBackCard({ ...backCard, corners });
    }
    setCroppingItem(null);
  };

  const clearAll = () => {
    if (frontCard) URL.revokeObjectURL(frontCard.originalUrl);
    if (backCard) URL.revokeObjectURL(backCard.originalUrl);
    setFrontCard(null);
    setBackCard(null);
    setSuccessMessage("");
  };

  // --- COMPONENT FOR FRONT & BACK SLOTS ---
  const IDSlotCard = ({ slot, item }: { slot: CardSlot, item: ScanItem | null }) => {
    const [previewSrc, setPreviewSrc] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
      let isMounted = true;
      if (!item) {
        setPreviewSrc("");
        return;
      }

      setIsProcessing(true);
      const generatePreview = async () => {
        try {
          if (!item.corners) return; 
          const canvas = await warpPerspective(item.file, item.corners, filter, item.rotation, 600);
          if (isMounted && canvas) {
            setPreviewSrc(canvas.toDataURL("image/jpeg", 0.8)); 
          }
        } catch (error) {
          console.error("Preview generation failed", error);
        } finally {
          if (isMounted) setIsProcessing(false);
        }
      };

      const timeout = setTimeout(generatePreview, 50);
      return () => { isMounted = false; clearTimeout(timeout); };
    }, [item, filter]);

    const title = slot === "front" ? "Front Side" : "Back Side";

    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h3>
        
        {item ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            
            {/* Image Preview Area */}
            <div className="relative aspect-[1.586/1] bg-slate-100 flex items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin mb-2" />
                  <span className="text-xs font-medium">Processing...</span>
                </div>
              ) : (
                <img src={previewSrc} alt={title} className="w-full h-full object-contain" />
              )}
            </div>

            {/* FIXED BUG: Mobile-Friendly Action Toolbar Below Image */}
            <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50 divide-x divide-slate-200">
              <button
                type="button"
                onClick={() => setCroppingItem({ item, slot })}
                className="flex flex-col items-center justify-center py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Crop className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wide">Crop</span>
              </button>
              <button
                type="button"
                onClick={() => rotateCard(slot)}
                className="flex flex-col items-center justify-center py-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <RotateCw className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wide">Rotate</span>
              </button>
              <button
                type="button"
                onClick={() => removeCard(slot)}
                className="flex flex-col items-center justify-center py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wide">Delete</span>
              </button>
            </div>
            
          </div>
        ) : (
          <div className="aspect-[1.586/1] bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:bg-slate-100 transition-colors">
            <CreditCard className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600 mb-4">Upload {title}</p>
            <div className="flex gap-2">
              <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Select File
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(slot, e.target.files)} />
              </label>
              <button 
                onClick={() => setShowCameraFor(slot)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-500 shadow-sm flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                Camera
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const exportPdf = useCallback(async () => {
    if (!frontCard && !backCard) return;
    setIsBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: pageSize });
      const pageWidth = doc.internal.pageSize.getWidth();
      
      const idMaxWidth = 85.6; 
      const idMaxHeight = 54; 

      let currentY = 40; 

      const drawCardToPdf = async (card: ScanItem) => {
        if (!card.corners) return;
        const canvas = await warpPerspective(card.file, card.corners, filter, card.rotation);
        if (!canvas) return;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        
        const aspect = canvas.width / canvas.height;
        let renderWidth = idMaxWidth;
        let renderHeight = idMaxWidth / aspect;

        if (renderHeight > idMaxHeight) {
           renderHeight = idMaxHeight;
           renderWidth = idMaxHeight * aspect;
        }

        const renderX = (pageWidth - renderWidth) / 2; 
        doc.addImage(dataUrl, "JPEG", renderX, currentY, renderWidth, renderHeight, undefined, "FAST");
        
        currentY += renderHeight + 20; 
      };

      if (frontCard) await drawCardToPdf(frontCard);
      if (backCard) await drawCardToPdf(backCard);

      doc.save(`ID_Scan_${new Date().toISOString().split('T')[0]}.pdf`);
      setSuccessMessage("Print-ready PDF generated successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not generate PDF.");
    } finally {
      setIsBusy(false);
    }
  }, [frontCard, backCard, pageSize, filter]);

  const printDocument = useCallback(async () => {
    if (!frontCard && !backCard) return;
    setIsBusy(true);
    try {
      const images: string[] = [];
      if (frontCard?.corners) {
        const c = await warpPerspective(frontCard.file, frontCard.corners, filter, frontCard.rotation);
        if (c) images.push(c.toDataURL("image/jpeg", 0.95));
      }
      if (backCard?.corners) {
        const c = await warpPerspective(backCard.file, backCard.corners, filter, backCard.rotation);
        if (c) images.push(c.toDataURL("image/jpeg", 0.95));
      }

      const printWindow = window.open("", "_blank");
      if (!printWindow) throw new Error("Unable to open print window");

      printWindow.document.write(`
        <html>
          <head>
            <title>Print ID Document</title>
            <style>
              body { margin: 0; padding: 0; background: #525659; display: flex; justify-content: center; align-items: flex-start; padding-top: 2rem;}
              .page { background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); width: 210mm; min-height: 297mm; display: flex; flex-direction: column; align-items: center; padding-top: 40mm; gap: 20mm;}
              img { max-width: 85.6mm; max-height: 85.6mm; object-fit: contain; border: 1px solid #e2e8f0;}
              @page { margin: 0; size: ${pageSize === 'a4' ? 'A4' : 'Letter'} portrait; }
              @media print { 
                body { background: white; padding: 0; } 
                .page { box-shadow: none; border: none; padding-top: 40mm; } 
                img { border: none; }
              }
            </style>
          </head>
          <body>
            <div class="page">
              ${images.map((src) => `<img src="${src}" alt="ID Card Scan" />`).join("")}
            </div>
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
  }, [frontCard, backCard, filter, pageSize]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* CAMERA MODAL */}
      {showCameraFor && (
        <CameraModal 
          onCapture={(file) => handleFileSelect(showCameraFor, [file])}
          onClose={() => setShowCameraFor(null)}
        />
      )}

      {/* FULLSCREEN CROP MODAL */}
      {croppingItem && (
        <InteractiveCropper 
          key={croppingItem.item.id}
          item={croppingItem.item} 
          slotLabel={croppingItem.slot === 'front' ? 'Front Side' : 'Back Side'}
          onComplete={handleCropComplete} 
          onCancel={() => setCroppingItem(null)} 
        />
      )}

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                <ScanLine className="h-4 w-4" /> ID Card Scanner Pro
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                Digitize your Identity Cards
            </h1>
            <p className="text-slate-600 max-w-2xl">
                Scan both the front and back of your ID card, driver's license, or passport. We'll automatically combine them onto a single printable page.
            </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          
          {/* LEFT: ID CARD SLOTS */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-white p-6 grid gap-8 sm:grid-cols-2">
                    <IDSlotCard slot="front" item={frontCard} />
                    <IDSlotCard slot="back" item={backCard} />
                </div>
            </Card>
          </div>

          {/* RIGHT: CONTROLS & EXPORT */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Settings</h3>
                        
                        <label className="block">
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Enhancement Filter</span>
                            <select
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as ScanFilter)}
                            >
                                <option value="magic">Magic Color (Best for IDs)</option>
                                <option value="bw">B&W (Photocopy Style)</option>
                                <option value="grayscale">Grayscale</option>
                                <option value="original">Original Photo</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Paper Size</span>
                            <select
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                                value={pageSize}
                                onChange={(e) => setPageSize(e.target.value as "a4" | "letter")}
                            >
                                {pageSizes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </label>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Button
                            onClick={exportPdf}
                            disabled={(!frontCard && !backCard) || isBusy}
                            className="w-full justify-center bg-blue-600 text-white hover:bg-blue-700 h-12 rounded-xl text-sm font-semibold shadow-sm"
                        >
                            {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                            Export Print-Ready PDF
                        </Button>
                        <Button
                            onClick={printDocument}
                            disabled={(!frontCard && !backCard) || isBusy}
                            variant="outline"
                            className="w-full justify-center border-slate-200 bg-white text-slate-900 hover:bg-slate-50 h-12 rounded-xl text-sm font-semibold shadow-sm"
                        >
                            {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                            Print Document
                        </Button>
                    </div>

                    {(frontCard || backCard) && (
                        <Button
                            variant="ghost"
                            onClick={clearAll}
                            disabled={isBusy}
                            className="w-full justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 h-10 rounded-lg text-sm"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Start Over
                        </Button>
                    )}

                    {successMessage && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-800 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 flex-shrink-0" /> {successMessage}
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
