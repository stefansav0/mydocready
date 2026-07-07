"use client";

import React, { useState, DragEvent } from 'react';
import { 
  FileSpreadsheet, FileUp, ArrowLeft, Grid, TableProperties, 
  Settings, CheckCircle2, DownloadCloud, Loader2, X, Plus
} from 'lucide-react';
import Link from 'next/link';

type ParsingMode = 'auto-tables' | 'text-columns';
type AppState = 'upload' | 'settings' | 'converting' | 'success';

export default function PdfToExcelPro() {
  const [file, setFile] = useState<File | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [parsingMode, setParsingMode] = useState<ParsingMode>('auto-tables');
  const [progress, setProgress] = useState({ current: 0, total: 100, status: '' });
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF document.");
      return;
    }
    setError(null);
    setFile(file);
    setAppState('settings');
  };

  const resetApp = () => {
    setFile(null);
    setAppState('upload');
    setProgress({ current: 0, total: 100, status: '' });
    setError(null);
  };

  // --- Core Conversion Logic ---
  const startConversion = async () => {
    if (!file) return;
    setAppState('converting');
    setError(null);

    try {
      setProgress({ current: 5, total: 100, status: 'Initializing spreadsheet engine...' });

      // Dynamically import libraries to strictly bypass Next.js SSR evaluation issues
      const pdfjsLib = await import('pdfjs-dist');
      const XLSX = await import('xlsx');

      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      setProgress({ current: 15, total: 100, status: 'Analyzing document matrix...' });

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      // Create a brand new workbook structure
      const workbook = XLSX.utils.book_new();

      setProgress({ current: 25, total: 100, status: 'Processing data grids...' });

      for (let p = 1; p <= totalPages; p++) {
        const currentProgress = 25 + Math.floor((p / totalPages) * 60);
        setProgress({ current: currentProgress, total: 100, status: `Parsing tables on page ${p} of ${totalPages}...` });

        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        const items = textContent.items as any[];

        const sheetData: string[][] = [];

        if (items.length > 0) {
          // Heuristic: Group text items sharing similar vertical coordinates (Y-axis) into rows
          // item.transform[5] represents the Y-coordinate on the page canvas
          const rowGroups: { [key: number]: any[] } = {};
          const yTolerance = 4; // Tolerance in points to capture items sitting on the same baseline

          items.forEach((item) => {
            if (!item.str.trim()) return;
            const y = item.transform[5];
            
            // Find an existing row cluster matching this Y position within tolerance bounds
            const matchY = Object.keys(rowGroups).find(
              (key) => Math.abs(parseFloat(key) - y) <= yTolerance
            );

            if (matchY) {
              rowGroups[parseFloat(matchY)].push(item);
            } else {
              rowGroups[y] = [item];
            }
          });

          // Sort rows from the top of the page downwards (descending Y coordinate values)
          const sortedYPositions = Object.keys(rowGroups)
            .map(Number)
            .sort((a, b) => b - a);

          sortedYPositions.forEach((y) => {
            // Sort column elements inside this row from left to right (ascending X coordinate values)
            // item.transform[4] represents the X-coordinate
            const lineItems = rowGroups[y].sort((a, b) => a.transform[4] - b.transform[4]);
            
            const rowCells: string[] = [];
            let currentCellText = "";
            let lastXEnd = -1;

            // Define column split threshold dynamically based on parsing mode selection
            const colGapThreshold = parsingMode === 'auto-tables' ? 18 : 8;

            lineItems.forEach((item, index) => {
              const xStart = item.transform[4];
              // Rough estimate of where this text string block ends horizontally
              const approxWidth = item.width || (item.str.length * (item.transform[0] * 0.5));
              
              if (index === 0) {
                currentCellText = item.str;
              } else {
                // If the gap between previous string end and next string start is wider than threshold, make a new column
                if (xStart - lastXEnd > colGapThreshold) {
                  rowCells.push(currentCellText.trim());
                  currentCellText = item.str;
                } else {
                  // Merge text strings continuing within the same cell boundary
                  currentCellText += (currentCellText.endsWith(" ") || item.str.startsWith(" ") ? "" : " ") + item.str;
                }
              }
              lastXEnd = xStart + approxWidth;
            });

            if (currentCellText) {
              rowCells.push(currentCellText.trim());
            }

            if (rowCells.length > 0) {
              sheetData.push(rowCells);
            }
          });
        }

        // Generate a new sheet data layout configuration block
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${p}`);
      }

      setProgress({ current: 90, total: 100, status: 'Compiling structured Excel sheets...' });

      // Write layout buffer streams
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const finalBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save output
      XLSX.writeFile(workbook, `${file.name.replace(/\.[^/.]+$/, "")}.xlsx`);

      setProgress({ current: 100, total: 100, status: 'Complete!' });
      setAppState('success');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to structure rows. The document might map flat image data or contain heavy security locks.");
      setAppState('settings');
    }
  };

  const percentComplete = progress.current;

  return (
    <div className="min-h-screen bg-[#f3f6f3] font-sans flex flex-col selection:bg-emerald-200">
      
      {/* Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-emerald-600 transition-colors font-bold text-lg">
          <FileSpreadsheet className="text-[#107c41]" size={28} />
          <span>ConvertHub<span className="text-[#107c41]">PRO</span></span>
        </Link>
        <Link href="/converter" className="text-gray-500 hover:text-gray-900 text-sm font-semibold flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        
        {/* ================= STATE 1: UPLOAD ================= */}
        {appState === 'upload' && (
          <div className="text-center w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black text-[#242e27] mb-4 tracking-tight">PDF to Excel</h1>
            <p className="text-[#556358] text-lg md:text-xl mb-10">
              Extract tables from PDF documents directly into clean, editable Excel spreadsheets.
            </p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-4 border-dashed rounded-3xl p-16 md:p-24 transition-all duration-300 flex flex-col items-center justify-center bg-white ${
                isDragging ? 'border-[#107c41] bg-emerald-50/40 scale-[1.02] shadow-2xl' : 'border-gray-200 hover:border-emerald-300 hover:shadow-xl'
              }`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".pdf" 
                onChange={handleFileSelect} 
                title="Upload PDF Document"
              />
              
              <div className={`p-6 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-[#107c41] text-white' : 'bg-emerald-50 text-[#107c41]'}`}>
                <FileUp size={48} />
              </div>
              
              <button className="bg-[#107c41] hover:bg-[#0b592e] text-white text-2xl font-bold py-5 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1 z-20 pointer-events-none">
                Select PDF file
              </button>
              <p className="text-gray-400 font-medium mt-6">or drop PDFs here</p>

              {error && (
                <div className="absolute bottom-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm z-20">
                  {error}
                </div>
              )}
            </div>
            
            <p className="mt-8 text-sm text-gray-400 max-w-xl mx-auto">
              * Local grid reconstruction: Optimized for tabular data. Multi-column values will translate directly into matching cells.
            </p>
          </div>
        )}

        {/* ================= STATE 2: SETTINGS / PREVIEW ================= */}
        {appState === 'settings' && file && (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
            
            {/* Left: File Preview */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative group">
              <button onClick={resetApp} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors z-10">
                <X size={20} />
              </button>
              
              <div className="w-40 h-52 bg-white shadow-md border border-gray-200 flex flex-col relative group-hover:-translate-y-2 transition-transform duration-300">
                <div className="flex-1 flex items-center justify-center bg-emerald-50/40 border-b border-gray-100 text-[#107c41] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-emerald-50 opacity-40"></div>
                  <FileSpreadsheet size={48} strokeWidth={1.5} className="z-10 text-[#107c41]" />
                </div>
                <div className="h-12 bg-white p-2 text-center overflow-hidden">
                  <p className="text-[10px] font-bold text-gray-800 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              <button className="mt-8 flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold text-sm transition-colors relative z-10">
                <Plus size={16} /> Add more files (Coming soon)
              </button>
            </div>

            {/* Right: Settings Sidebar */}
            <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center gap-3">
                <Settings className="text-gray-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">PDF to Excel options</h2>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Grid size={16} /> Table Structure Mode
                  </h3>
                  <div className="space-y-3">
                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${parsingMode === 'auto-tables' ? 'border-[#107c41] bg-emerald-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4">
                        <input type="radio" name="parsing" className="mt-1 w-5 h-5 accent-[#107c41]" checked={parsingMode === 'auto-tables'} onChange={() => setParsingMode('auto-tables')} />
                        <div>
                          <h4 className="font-bold text-gray-900 flex items-center gap-1">Detect Tables</h4>
                          <p className="text-sm text-gray-500 mt-1">Smarter scanning. Looks for physical structural spacing to form structured rows and data columns.</p>
                        </div>
                      </div>
                    </label>

                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${parsingMode === 'text-columns' ? 'border-[#107c41] bg-emerald-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start gap-4">
                        <input type="radio" name="parsing" className="mt-1 w-5 h-5 accent-[#107c41]" checked={parsingMode === 'text-columns'} onChange={() => setParsingMode('text-columns')} />
                        <div>
                          <h4 className="font-bold text-gray-900 flex items-center gap-1">Raw Text Segments</h4>
                          <p className="text-sm text-gray-500 mt-1">Stricter tracking. Breaks cells on tighter horizontal thresholds. Ideal for complex text ledger columns.</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-2 text-sm mb-1">
                    <TableProperties size={16} /> Workbook Assembly
                  </h4>
                  <p className="text-sm text-emerald-800/80 leading-relaxed">
                    Each single page parsed from your source document is structured cleanly into its own individual standalone Excel worksheet tab.
                  </p>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 font-semibold rounded-lg text-sm border border-red-100">{error}</div>}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button 
                  onClick={startConversion}
                  className="w-full bg-[#107c41] hover:bg-[#0b592e] text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  Convert to Excel <ArrowLeft className="rotate-180" size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STATE 3: CONVERTING ================= */}
        {appState === 'converting' && (
          <div className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-300">
            <Loader2 className="w-16 h-16 text-[#107c41] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Converting Document</h2>
            <p className="text-gray-500 font-medium mb-8">{progress.status}</p>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#107c41] h-3 rounded-full transition-all duration-300 ease-out relative" 
                style={{ width: `${percentComplete}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-right text-sm font-bold text-gray-400 mt-2">{percentComplete}%</p>
          </div>
        )}

        {/* ================= STATE 4: SUCCESS ================= */}
        {appState === 'success' && (
          <div className="w-full max-w-2xl text-center animate-in slide-in-from-bottom-8 duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-500 rounded-full mb-6">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-[#242e27] mb-4">Task Complete!</h2>
            <p className="text-[#556358] text-xl mb-10">Your PDF tables have been compiled into an Excel spreadsheet.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={resetApp}
                className="w-full sm:w-auto px-8 py-4 bg-[#242e27] hover:bg-black text-white rounded-xl font-bold text-lg transition-all"
              >
                Convert another file
              </button>
              
              <button 
                onClick={() => alert("Your download should have started automatically. Check your downloads folder!")}
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                <DownloadCloud size={20} /> Download again
              </button>
            </div>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}