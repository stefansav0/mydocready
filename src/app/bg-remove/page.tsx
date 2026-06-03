"use client";

import { useState, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";
import {
  UploadCloud,
  Image as ImageIcon,
  Download,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

export default function BackgroundRemover() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image");
      return;
    }

    const preview = URL.createObjectURL(file);

    setImagePreview(preview);
    setResultImage(null);
  };

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const resetState = () => {
    setImagePreview(null);
    setResultImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveBackground = async () => {
    if (!imagePreview) return;

    try {
      setIsProcessing(true);

      const blob = await removeBackground(imagePreview);

      const url = URL.createObjectURL(blob);

      setResultImage(url);
    } catch (error) {
      console.error(error);

      alert("Background removal failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            AI Background Remover
          </h1>

          <p className="text-slate-600 mt-4">
            Remove image backgrounds instantly with AI
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

          {!imagePreview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="p-14 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleUpload}
              />

              <UploadCloud className="w-16 h-16 text-slate-400 mb-6" />

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg">
                Upload Image
              </button>

              <p className="mt-4 text-slate-500">
                or drag and drop image here
              </p>
            </div>
          ) : (
            <div className="p-6 md:p-8">

              {/* Top */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Image Workspace
                </h2>

                <button
                  onClick={resetState}
                  className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Grid */}
              <div className="grid md:grid-cols-2 gap-8">

                {/* Original */}
                <div className="space-y-4">

                  <div className="h-96 rounded-2xl bg-slate-100 border overflow-hidden flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Original"
                      className="max-h-full object-contain"
                    />
                  </div>

                  {!resultImage && (
                    <button
                      onClick={handleRemoveBackground}
                      disabled={isProcessing}
                      className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 ${
                        isProcessing
                          ? "bg-slate-400"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}

                      {isProcessing
                        ? "Processing..."
                        : "Remove Background"}
                    </button>
                  )}
                </div>

                {/* Result */}
                <div className="space-y-4">

                  <div className="h-96 rounded-2xl border bg-slate-100 overflow-hidden flex items-center justify-center">

                    {resultImage ? (
                      <img
                        src={resultImage}
                        alt="Result"
                        className="max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />

                        <p>
                          Background removed image
                          will appear here
                        </p>
                      </div>
                    )}
                  </div>

                  {resultImage && (
                    <a
                      href={resultImage}
                      download="removed-background.png"
                      className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Image
                    </a>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}