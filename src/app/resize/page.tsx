"use client";

import { useCallback, useState, useRef, ChangeEvent } from "react";
import {
  compressToTargetKB,
  fileToImageBitmap,
  downloadBlob,
} from "@/utils/image";
import { UploadCloud, Lock, Unlock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

type ResultState = {
  url: string;
  blob: Blob;
  kb: number;
  quality: number;
};

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  const [targetKB, setTargetKB] = useState<number>(50);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [result, setResult] = useState<ResultState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const aspectRatio = useRef<number>(1);

  const handleFileSelect = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;

    setFile(selectedFile);
    setResult(null);
    const bmp = await fileToImageBitmap(selectedFile);
    setBitmap(bmp);

    setDimensions({ width: bmp.width, height: bmp.height });
    aspectRatio.current = bmp.width / bmp.height;
  }, []);

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    if (keepAspectRatio && aspectRatio.current) {
      const newHeight = Math.round(newWidth / aspectRatio.current);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions((prev) => ({ ...prev, width: newWidth }));
    }
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    if (keepAspectRatio && aspectRatio.current) {
      const newWidth = Math.round(newHeight * aspectRatio.current);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions((prev) => ({ ...prev, height: newHeight }));
    }
  };

  const doResizeAndCompress = useCallback(async () => {
    if (!bitmap || !dimensions.width || !dimensions.height) return;

    setIsBusy(true);
    setResult(null);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(bitmap, 0, 0, dimensions.width, dimensions.height);

      const { blob, objectURL, finalKB, quality } = await compressToTargetKB(
        canvas,
        Math.max(5, targetKB)
      );

      setResult({ url: objectURL, blob, kb: finalKB, quality });
    } finally {
      setIsBusy(false);
    }
  }, [bitmap, dimensions, targetKB]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Image Resizer & Compressor</h1>
        <p className="mt-2 text-muted-foreground">
          Upload an image, set your desired dimensions and file size, and get a perfectly optimized result.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <Card>
            <CardHeader><CardTitle>Controls</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${ isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50" }`} >
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-muted-foreground">Drag & drop or click to upload</p>
                <Input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
              </div>
              {bitmap && (
                <div className="space-y-2">
                  <Label>Dimensions (px)</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={dimensions.width} onChange={handleWidthChange} placeholder="Width"/>
                    <Toggle pressed={keepAspectRatio} onPressedChange={setKeepAspectRatio} aria-label="Toggle aspect ratio lock">
                      {keepAspectRatio ? <Lock size={16}/> : <Unlock size={16}/>}
                    </Toggle>
                    <Input type="number" value={dimensions.height} onChange={handleHeightChange} placeholder="Height"/>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Target Size (KB)</Label>
                <Input type="number" min={5} step={5} value={targetKB} onChange={(e) => setTargetKB(Number(e.target.value))}/>
                <div className="flex gap-2 pt-1">
                  {[20, 50, 100, 500].map(kb => (<Button key={kb} variant="outline" size="sm" onClick={() => setTargetKB(kb)}>{kb}KB</Button>))}
                </div>
              </div>
              <Button onClick={doResizeAndCompress} disabled={!file || isBusy} className="w-full">
                {isBusy ? "Processing..." : "Resize & Compress"}
              </Button>
              {result && (
                <div className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
                  <p>Final Size: <b>{result.kb.toFixed(2)} KB</b></p>
                  <p>JPEG Quality: <b>{result.quality.toFixed(2)}</b></p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-8">
          <Card>
            <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PreviewBox title="Original" file={file} />
                <PreviewBox title="Resized" result={result} />
              </div>
              {result && (
                <Button onClick={() => downloadBlob(result.blob, `resized_${result.kb.toFixed(0)}KB.jpg`)} className="w-full mt-6">
                  <Download className="mr-2 h-4 w-4"/>
                  Download Resized Image
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const PreviewBox = ({ title, file, result }: { title: string; file?: File | null; result?: ResultState | null }) => {
  const url = file ? URL.createObjectURL(file) : result?.url;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-center">{title}</h3>
      <div className="aspect-square w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`${title} preview`} className="max-w-full max-h-full object-contain" />
        ) : (
          <p className="text-xs text-muted-foreground">{title === 'Original' ? 'No image selected' : 'Awaiting output'}</p>
        )}
      </div>
    </div>
  );
};
