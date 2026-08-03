import IdCardScanClient from './id-card-scan-client';

export const metadata = {
  title: 'ID Card Scanner - MyDocReady',
  description: 'Scan and crop ID cards, export as PDF or image.',
};

export default function Page() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold">ID Card Scanner</h1>
          <p className="text-slate-600">Scan ID cards or small documents using your camera or uploaded images. The tool auto-crops whitespace and produces a printable PDF or single image.</p>
        </header>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-2">How it works</h2>
          <p className="text-slate-600 mb-3">Use your device camera to capture an ID or upload photos from your device. The app trims surrounding whitespace, aligns the image, and lets you export a clean PDF suitable for printing or storage.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <li className="text-sm"><strong>Quick capture:</strong> Open camera and snap a photo.</li>
            <li className="text-sm"><strong>Auto-crop:</strong> Background whitespace is trimmed automatically.</li>
            <li className="text-sm"><strong>Export:</strong> Save as multi-page PDF or individual JPEG.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <IdCardScanClient />
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-2">FAQ</h3>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div>
              <strong>Q: Is the image uploaded to a server?</strong>
              <p>A: No — all trimming and export operations run in your browser. Nothing is uploaded unless you choose to share it.</p>
            </div>
            <div>
              <strong>Q: Which file types are supported?</strong>
              <p>A: JPEG and PNG images are supported. Use the camera for direct capture on mobile devices.</p>
            </div>
            <div>
              <strong>Q: How do I improve scan quality?</strong>
              <p>A: Ensure the ID is on a plain background, use good lighting, and hold your camera steady for a sharp capture.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
