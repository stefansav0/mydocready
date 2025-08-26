/**
 * Converts a File object into an ImageBitmap for efficient rendering.
 * @param file The image file to convert.
 * @returns A promise that resolves with the ImageBitmap.
 */
export async function fileToImageBitmap(file: File): Promise<ImageBitmap> {
  if (typeof createImageBitmap !== "function") {
    throw new Error("createImageBitmap is not supported in this environment.");
  }
  return await createImageBitmap(file);
}

/**
 * Converts a base64 Data URL string into a Blob object.
 * @param dataURL The Data URL to convert.
 * @returns A Blob object.
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const [meta, base64] = dataURL.split(",");
  const mime = meta.match(/data:(.*);base64/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const length = binary.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Draws an ImageBitmap onto a canvas context using background-size: cover behavior.
 * @param ctx The canvas rendering context.
 * @param img The ImageBitmap to draw.
 * @param x The x-coordinate of the container.
 * @param y The y-coordinate of the container.
 * @param w The width of the container.
 * @param h The height of the container.
 * @param scale Optional zoom level.
 * @param offsetX Optional horizontal offset.
 * @param offsetY Optional vertical offset.
 */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: ImageBitmap,
  x: number,
  y: number,
  w: number,
  h: number,
  scale: number = 1,
  offsetX: number = 0,
  offsetY: number = 0
): void {
  const imgRatio = img.width / img.height;
  const containerRatio = w / h;

  let drawWidth: number;
  let drawHeight: number;

  if (imgRatio > containerRatio) {
    drawHeight = h * scale;
    drawWidth = drawHeight * imgRatio;
  } else {
    drawWidth = w * scale;
    drawHeight = drawWidth / imgRatio;
  }

  const dx = x + (w - drawWidth) / 2 + offsetX;
  const dy = y + (h - drawHeight) / 2 + offsetY;

  ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
}

/**
 * Compresses an image on a canvas to a target file size in kilobytes (KB).
 * @param canvas The HTMLCanvasElement containing the image to compress.
 * @param targetKB The desired file size in KB.
 * @returns A promise resolving with the compressed blob, its object URL, final size, and quality.
 */
export async function compressToTargetKB(
  canvas: HTMLCanvasElement,
  targetKB: number
): Promise<{ blob: Blob; objectURL: string; finalKB: number; quality: number }> {
  const targetBytes = targetKB * 1024;
  let quality = 0.92;
  let minQuality = 0.1;
  let maxQuality = 1.0;
  let attempts = 10;

  const getBlob = (q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed."));
      }, "image/jpeg", q);
    });
  };

  let blob = await getBlob(quality);

  while (attempts-- > 0 && Math.abs(blob.size - targetBytes) > 1024) {
    if (blob.size > targetBytes) {
      maxQuality = quality;
    } else {
      minQuality = quality;
    }

    if (maxQuality - minQuality < 0.01) break;
    quality = (minQuality + maxQuality) / 2;
    blob = await getBlob(quality);
  }

  const objectURL = URL.createObjectURL(blob);
  const finalKB = blob.size / 1024;

  return { blob, objectURL, finalKB, quality };
}

/**
 * Triggers a browser download for a given Blob object.
 * @param blob The Blob to download.
 * @param filename The desired name for the downloaded file.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Trims white or near-white pixels (or transparent areas) from the edges of a canvas.
 * @param canvas The canvas to trim.
 * @returns A new trimmed canvas.
 */
export function trimWhitespace(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available.");

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let top = height, bottom = -1, left = width, right = -1;

  const isWhitespace = (index: number): boolean => {
    const alpha = data[index + 3];
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    return alpha < 30 || (r > 240 && g > 240 && b > 240);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (!isWhitespace(i)) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  if (bottom < top || right < left) {
    const blankCanvas = document.createElement("canvas");
    blankCanvas.width = 1;
    blankCanvas.height = 1;
    return blankCanvas;
  }

  const trimmedWidth = right - left + 1;
  const trimmedHeight = bottom - top + 1;
  const trimmedCanvas = document.createElement("canvas");
  trimmedCanvas.width = trimmedWidth;
  trimmedCanvas.height = trimmedHeight;

  const trimmedCtx = trimmedCanvas.getContext("2d");
  if (!trimmedCtx) throw new Error("Failed to get 2D context for trimmed canvas.");

  trimmedCtx.drawImage(canvas, left, top, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);
  return trimmedCanvas;
}
