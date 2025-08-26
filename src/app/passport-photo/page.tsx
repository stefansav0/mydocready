"use client";

import { useEffect, useRef, useState } from "react";
import { fileToImageBitmap, drawCover, downloadBlob } from "@/utils/image";
import * as removeBg from "@imgly/background-removal"; // Background removal library (client-side)

const OUT_W = 413; // ≈ 35 mm @ 300dpi
const OUT_H = 531; // ≈ 45 mm @ 300dpi

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<ImageBitmap | null>(null);
  const [bg, setBg] = useState<"white" | "blue">("white");
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = OUT_W;
    canvas.height = OUT_H;
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bg, img, zoom, offsetX, offsetY]);

  const onPick = async (file: File) => {
    setFile(file);
    const bmp = await fileToImageBitmap(file);
    setImg(bmp);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) onPick(file);
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = bg === "white" ? "#ffffff" : "#1E40AF"; // Tailwind blue-800
    ctx.fillRect(0, 0, OUT_W, OUT_H);

    // Draw image
    if (img) {
      drawCover(ctx, img, 0, 0, OUT_W, OUT_H, zoom, offsetX, offsetY);
    }
  };

  const download = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, `passport_${bg}.jpg`);
      },
      "image/jpeg",
      0.95
    );
  };

  // Remove Background Function
  const removeBackground = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const resultBlob = await removeBg.removeBackground(file);
      const resultFile = new File([resultBlob], file.name, { type: resultBlob.type });
      const bmp = await fileToImageBitmap(resultFile);
      setImg(bmp);
    } catch (error) {
      console.error("Background removal failed:", error);
      alert("Failed to remove background. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dragging logic for panning the image
  const dragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    setOffsetX((prev) => prev + dx);
    setOffsetY((prev) => prev + dy);
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const onMouseLeave = () => {
    dragging.current = false;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">Passport Photo (35×45 mm)</h1>
      <p className="mt-2 text-sm text-gray-500">
        Upload, zoom & pan to fit your face. Choose background color or remove it, then download.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Left Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <label className="block text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="mt-2 w-full cursor-pointer rounded border p-2"
            onChange={handleInput}
          />

          <div className="mt-4 grid gap-4">
            <div>
              <label className="block text-sm font-medium">Background</label>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setBg("white")}
                  className={`rounded px-3 py-1 text-sm border ${
                    bg === "white" ? "bg-gray-100" : ""
                  }`}
                >
                  White
                </button>
                <button
                  onClick={() => setBg("blue")}
                  className={`rounded px-3 py-1 text-sm border ${
                    bg === "blue" ? "bg-gray-100" : ""
                  }`}
                >
                  Blue
                </button>
              </div>
            </div>

            {/* Remove Background Button */}
            <div>
              <button
                disabled={!file || loading}
                onClick={removeBackground}
                className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-60"
              >
                {loading ? "Removing..." : "Remove Background"}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium">Zoom</label>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>

            <div className="flex gap-3">
              <button
                disabled={!img}
                onClick={download}
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
              >
                Download JPG
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-sm font-medium">Canvas Preview (drag to pan)</div>
          <div className="mt-3 flex items-center justify-center">
            <div
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              className="rounded border p-3"
              style={{ cursor: img ? "grab" : "default" }}
            >
              <canvas ref={canvasRef} width={OUT_W} height={OUT_H} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
