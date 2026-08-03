import ImageToTextClient from './image-to-text-client';

export const metadata = {
  title: 'Image to Text - MyDocReady',
  description: 'Extract text from images using client-side OCR.',
};

export default function Page() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold">Image → Text</h1>
          <p className="text-slate-600">Quickly extract selectable text from photos, screenshots, and scanned documents right in your browser. No uploads required — OCR runs locally for privacy.</p>
        </header>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-2">How it works</h2>
          <p className="text-slate-600 mb-3">Choose one or more images (photos of receipts, IDs, documents or screenshots). The page uses a browser-based OCR engine to recognize text in each image and returns editable plain text. You can then copy it, edit it inline, or download a .txt file.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <li className="text-sm"><strong>Privacy:</strong> OCR runs in your browser; images do not leave your device by default.</li>
            <li className="text-sm"><strong>Multi-file:</strong> Process several images in sequence and combine results.</li>
            <li className="text-sm"><strong>Download:</strong> Export results as plain text.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <ImageToTextClient />
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-2">FAQ</h3>
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div>
              <strong>Q: Does my image leave my device?</strong>
              <p>A: No — OCR is performed in the browser using a local engine (tesseract.js). If you prefer server-side OCR, contact us for an API option.</p>
            </div>
            <div>
              <strong>Q: What languages are supported?</strong>
              <p>A: The current page initializes English (eng). Additional languages can be added by loading their language data — this may increase download size.</p>
            </div>
            <div>
              <strong>Q: Why is OCR slower on some images?</strong>
              <p>A: Complex layouts, low-contrast images, or very high-resolution photos increase processing time. Pre-cropping and ensuring good lighting improves results.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
