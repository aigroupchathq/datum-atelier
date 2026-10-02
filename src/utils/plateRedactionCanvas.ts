/**
 * DATUM Atelier — Physical License Plate Canvas Redaction Engine
 * 
 * Irreversibly strips and overwrites license plate pixels in an HTML5 Canvas buffer
 * before an image is saved to state, uploaded to storage, or rendered to the community feed.
 * 
 * Unlike decorative CSS overlays (which leave the raw plate exposed in devtools and downloads),
 * this engine performs in-memory pixel destruction directly on the Uint8ClampedArray RGBA buffer.
 */

export interface PlateBoundingBox {
  top: number;   // 0 - 100 percentage
  left: number;  // 0 - 100 percentage
  width: number; // 0 - 100 percentage
  height: number;// 0 - 100 percentage
}

export type RedactionStyle = 'pixelate' | 'boxBlur' | 'blackout' | 'monogram';

export interface PlateRedactionOptions {
  style?: RedactionStyle;
  blockSize?: number; // Mosaic block size in pixels (default: 12)
  watermarkText?: string; // Embedded stamp (default: "DATUM // CLOAKED")
  quality?: number; // Export quality (0.92)
  outputFormat?: 'image/jpeg' | 'image/png';
}

export interface RedactionResult {
  dataUrl: string;
  width: number;
  height: number;
  redactedPixelCount: number;
  style: RedactionStyle;
  sanitizedAt: string;
}

/**
 * Pure byte-level pixel destruction on a raw RGBA Uint8ClampedArray buffer.
 * Can be executed in both Node tests and browser canvas contexts.
 */
export function destroyPixelsInBuffer(
  pixels: Uint8ClampedArray,
  imageWidth: number,
  imageHeight: number,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
  blockSize = 12
): number {
  const startX = Math.max(0, Math.min(imageWidth - 1, Math.floor(boxX)));
  const startY = Math.max(0, Math.min(imageHeight - 1, Math.floor(boxY)));
  const endX = Math.min(imageWidth, Math.ceil(boxX + boxW));
  const endY = Math.min(imageHeight, Math.ceil(boxY + boxH));

  let alteredPixels = 0;

  // Process region in discrete mosaic blocks to irreversibly destroy letter glyph definitions
  for (let by = startY; by < endY; by += blockSize) {
    for (let bx = startX; bx < endX; bx += blockSize) {
      const currentBlockW = Math.min(blockSize, endX - bx);
      const currentBlockH = Math.min(blockSize, endY - by);

      // Pass 1: Accumulate mean color across the block
      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let totalA = 0;
      let count = 0;

      for (let y = by; y < by + currentBlockH; y++) {
        for (let x = bx; x < bx + currentBlockW; x++) {
          const idx = (y * imageWidth + x) * 4;
          totalR += pixels[idx];
          totalG += pixels[idx + 1];
          totalB += pixels[idx + 2];
          totalA += pixels[idx + 3];
          count++;
        }
      }

      if (count === 0) continue;

      const avgR = Math.round(totalR / count);
      const avgG = Math.round(totalG / count);
      const avgB = Math.round(totalB / count);
      const avgA = Math.round(totalA / count);

      // Pass 2: Overwrite all pixels in the block with the averaged, homogenized tint
      for (let y = by; y < by + currentBlockH; y++) {
        for (let x = bx; x < bx + currentBlockW; x++) {
          const idx = (y * imageWidth + x) * 4;
          pixels[idx] = avgR;
          pixels[idx + 1] = avgG;
          pixels[idx + 2] = avgB;
          pixels[idx + 3] = avgA;
          alteredPixels++;
        }
      }
    }
  }

  return alteredPixels;
}

/**
 * Helper to load an image source safely into an HTMLImageElement
 */
function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image for canvas redaction: ${err}`));
    img.src = src;
  });
}

/**
 * Main Browser Canvas Redaction function.
 * Creates an in-memory HTML5 Canvas, renders the image, destroys plate pixels,
 * burns in the cryptographic banner, and exports a sanitized Data URL.
 */
export async function redactPlateOnCanvas(
  imageSource: string | HTMLImageElement,
  plateBox: PlateBoundingBox,
  options: PlateRedactionOptions = {}
): Promise<RedactionResult> {
  const {
    style = 'monogram',
    blockSize = 12,
    watermarkText = 'DATUM // CLOAKED',
    quality = 0.92,
    outputFormat = 'image/jpeg'
  } = options;

  let img: HTMLImageElement;
  if (typeof imageSource === 'string') {
    img = await loadImageElement(imageSource);
  } else {
    img = imageSource;
  }

  const width = img.naturalWidth || img.width || 1200;
  const height = img.naturalHeight || img.height || 800;

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not available for pixel redaction');
  }

  // Draw full-resolution base image
  ctx.drawImage(img, 0, 0, width, height);

  // Compute exact pixel bounding box
  const boxX = Math.max(0, Math.floor((plateBox.left / 100) * width));
  const boxY = Math.max(0, Math.floor((plateBox.top / 100) * height));
  const boxW = Math.min(width - boxX, Math.ceil((plateBox.width / 100) * width));
  const boxH = Math.min(height - boxY, Math.ceil((plateBox.height / 100) * height));

  let redactedCount = 0;

  if (style === 'blackout') {
    // Solid matte carbon fill
    ctx.fillStyle = '#0B0C0E';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    redactedCount = boxW * boxH;
  } else {
    // 1. Physically destroy pixels via mosaic downsampling in raw byte buffer
    const imageData = ctx.getImageData(boxX, boxY, boxW, boxH);
    redactedCount = destroyPixelsInBuffer(
      imageData.data,
      boxW,
      boxH,
      0,
      0,
      boxW,
      boxH,
      blockSize
    );
    ctx.putImageData(imageData, boxX, boxY);

    // 2. If 'monogram' or 'boxBlur', draw the aesthetic gamer-minimalist titanium censor capsule
    if (style === 'monogram' || style === 'pixelate') {
      ctx.save();
      
      // Semi-translucent dark carbon backing over the already destroyed pixels
      ctx.fillStyle = 'rgba(11, 12, 14, 0.88)';
      const cornerRadius = Math.max(4, Math.min(8, boxH * 0.15));
      
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, cornerRadius);
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)'; // Amber hairline
        ctx.lineWidth = Math.max(1.5, Math.floor(width * 0.0015));
        ctx.stroke();
      } else {
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX, boxY, boxW, boxH);
      }

      // Burned-in Monospace Typographic Cloak
      const fontSize = Math.max(10, Math.floor(boxH * 0.38));
      ctx.font = `700 ${fontSize}px "SF Mono", "JetBrains Mono", Consolas, monospace`;
      ctx.fillStyle = '#F59E0B'; // Amber HUD yellow
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(watermarkText, boxX + boxW / 2, boxY + boxH / 2);

      ctx.restore();
    }
  }

  // Export permanently scrubbed data URL
  const dataUrl = canvas.toDataURL(outputFormat, quality);

  return {
    dataUrl,
    width,
    height,
    redactedPixelCount: redactedCount,
    style,
    sanitizedAt: new Date().toISOString()
  };
}

/**
 * Verifies that a buffer was physically altered inside the bounding box.
 * Used in unit tests and automated verification.
 */
export function verifyPlateAltered(
  originalPixels: Uint8ClampedArray,
  redactedPixels: Uint8ClampedArray,
  width: number,
  height: number,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number
): { isAltered: boolean; deltaSum: number; pixelsChecked: number } {
  let deltaSum = 0;
  let pixelsChecked = 0;

  const startX = Math.max(0, Math.floor(boxX));
  const startY = Math.max(0, Math.floor(boxY));
  const endX = Math.min(width, Math.ceil(boxX + boxW));
  const endY = Math.min(height, Math.ceil(boxY + boxH));

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const idx = (y * width + x) * 4;
      const dr = Math.abs(originalPixels[idx] - redactedPixels[idx]);
      const dg = Math.abs(originalPixels[idx + 1] - redactedPixels[idx + 1]);
      const db = Math.abs(originalPixels[idx + 2] - redactedPixels[idx + 2]);
      deltaSum += dr + dg + db;
      pixelsChecked++;
    }
  }

  return {
    isAltered: deltaSum > 0,
    deltaSum,
    pixelsChecked
  };
}
