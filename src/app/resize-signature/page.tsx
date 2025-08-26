"use client";

import { useState, useCallback, ChangeEvent } from "react";
import {
  compressToTargetKB,
  downloadBlob,
  trimWhitespace,
} from "@/utils/image";
import { UploadCloud, Download, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ResultState = {
  url: string;
  blob: Blob;
  kb: number;
};

export default function ResizeSignaturePage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [targetKB, setTargetKB] = useState<number>(20);
  const [result, setResult] = useState<ResultState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setResult(null);
  }, []);

  const doProcessSignature = useCallback(async () => {
    if (!file) return;

    setIsBusy(true);
    setResult(null);
    try {
      const originalImage = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      canvas.getContext("2d")?.drawImage(originalImage, 0, 0);

      const trimmedCanvas = trimWhitespace(canvas);

      const { blob, objectURL, finalKB } = await compressToTargetKB(
        trimmedCanvas,
        targetKB
      );
      setResult({ url: objectURL, blob, kb: finalKB });

    } catch (error) {
      console.error("Failed to process signature:", error);
    } finally {
      setIsBusy(false);
    }
  }, [file, targetKB]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Signature Resizer & Cleaner</h1>
        <p className="mt-2 text-muted-foreground">
          Upload your signature to automatically trim whitespace and compress it to a specific file size.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Controls</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${ isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50" }`}>
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-muted-foreground">Drag & drop or click to upload</p>
              <Input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetKB">Target Size (KB)</Label>
              <Input id="targetKB" type="number" min={5} step={5} value={targetKB} onChange={(e) => setTargetKB(Number(e.target.value))} />
            </div>
            <Button onClick={doProcessSignature} disabled={!file || isBusy} className="w-full">
              {isBusy ? "Processing..." : <><Scissors className="mr-2 h-4 w-4"/> Trim & Compress</>}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <PreviewBox title="Original" url={originalUrl} />
              <PreviewBox title="Processed" url={result?.url} />
            </div>
            {result && (<div className="mt-4 text-sm text-center text-muted-foreground p-3 bg-muted rounded-md">Final Size: <b>{result.kb.toFixed(2)} KB</b></div>)}
            {result && (<Button onClick={() => downloadBlob(result.blob, `signature_${result.kb.toFixed(0)}KB.jpg`)} className="w-full mt-4"><Download className="mr-2 h-4 w-4"/>Download Signature</Button>)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const PreviewBox = ({ title, url }: { title: string; url?: string | null }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-center">{title}</h3>
    <div className="aspect-video w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={`${title} preview`} className="max-w-full max-h-full object-contain" />
      ) : (
        <p className="text-xs text-muted-foreground">{title === 'Original' ? 'No signature selected' : 'Awaiting output'}</p>
      )}
    </div>
  </div>
);
