"use client";

import { useEffect, useRef, useState } from "react";
import { fileToImageBitmap, drawCover, downloadBlob } from "@/utils/image";
import * as removeBg from "@imgly/background-removal";

const OUT_W = 413;
const OUT_H = 531;

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<ImageBitmap | null>(null);
  const [bg, setBg] = useState<"white" | "blue">("white");
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [loadingBg, setLoadingBg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for name and date
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Draw background color
    ctx.fillStyle = bg === "white" ? "#ffffff" : "#1E40AF";
    ctx.fillRect(0, 0, OUT_W, OUT_H);

    // Draw the image with zoom and pan
    if (img) {
      drawCover(ctx, img, 0, 0, OUT_W, OUT_H, zoom, offsetX, offsetY);
    }

    // Draw name and date on the bottom of the photo
    ctx.fillStyle = bg === "white" ? "#000" : "#fff";
    ctx.font = "16px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    ctx.textAlign = "center";

    if (name) {
      ctx.fillText(name, OUT_W / 2, OUT_H - 40);
    }
    if (date) {
      ctx.fillText(date, OUT_W / 2, OUT_H - 20);
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
    canvasRef.current.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, `passport_${bg}.jpg`);
      },
      "image/jpeg",
      0.95
    );
  };

  const handleRemoveBg = async () => {
    if (!file) return;
    setLoadingBg(true);
    setError(null);
    try {
      const resultBlob = await removeBg.removeBackground(file);
      const resultFile = new File([resultBlob], file.name, { type: resultBlob.type });
      const bmp = await fileToImageBitmap(resultFile);
      setImg(bmp);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    } catch (err) {
      console.error("Background removal error:", err);
      setError("Background removal failed. Try again or use a simpler background.");
    } finally {
      setLoadingBg(false);
    }
  };

  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffsetX((o) => o + dx);
    setOffsetY((o) => o + dy);
  }

  function onMouseUpOrLeave() {
    dragging.current = false;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Passport Photo (35×45 mm)</h1>
      <p className="text-sm text-gray-500 mb-6">
        Upload your image, adjust zoom & position, choose background or remove it, add your name & date, then download.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6 relative">
          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full cursor-pointer border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInput}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Background</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setBg("white")}
                className={`px-4 py-2 border rounded transition ${bg === "white" ? "bg-gray-100 border-gray-400" : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => setBg("blue")}
                className={`px-4 py-2 border rounded transition ${bg === "blue" ? "bg-blue-700 text-white border-blue-700" : "border-gray-300 hover:bg-blue-100"
                  }`}
              >
                Blue
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleRemoveBg}
              disabled={!file || loadingBg}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loadingBg ? "Removing Background..." : "Remove Background"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Zoom & Pan</label>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* New inputs for Name and Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Name (to display on photo)</label>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date (to display on photo)</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!img}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Download JPG
            </button>
          </div>

          {/* Loading overlay */}
          {loadingBg && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600"></div>
            </div>
          )}
        </div>

        {/* Canvas Preview */}
        <div className="bg-white p-4 rounded-lg shadow flex justify-center items-center">
          <div
            className="cursor-grab"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrLeave}
            onMouseLeave={onMouseUpOrLeave}
          >
            <canvas ref={canvasRef} width={OUT_W} height={OUT_H} className="border" />
          </div>
        </div>
      </div>
    </div>
  );
}
