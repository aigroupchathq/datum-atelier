import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  destroyPixelsInBuffer, 
  verifyPlateAltered 
} from '../src/utils/plateRedactionCanvas.ts';

test('1. destroyPixelsInBuffer permanently alters pixel byte values within the target box', () => {
  const width = 100;
  const height = 50;
  const original = new Uint8ClampedArray(width * height * 4);
  const target = new Uint8ClampedArray(width * height * 4);

  // Seed pattern simulating license plate text (high-contrast black text on yellow plate)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // Yellow plate background with black letters at odd positions
      const isLetter = (x % 4 === 0) && (y % 4 === 0);
      const r = isLetter ? 10 : 240;
      const g = isLetter ? 10 : 190;
      const b = isLetter ? 10 : 10;
      const a = 255;

      original[idx] = r;
      original[idx + 1] = g;
      original[idx + 2] = b;
      original[idx + 3] = a;

      target[idx] = r;
      target[idx + 1] = g;
      target[idx + 2] = b;
      target[idx + 3] = a;
    }
  }

  // Redact a box located at (20, 10, width: 60, height: 30)
  const boxX = 20;
  const boxY = 10;
  const boxW = 60;
  const boxH = 30;

  const alteredCount = destroyPixelsInBuffer(target, width, height, boxX, boxY, boxW, boxH, 8);
  assert.ok(alteredCount > 0, 'Must alter pixels inside the bounding box');

  // Verify that inside the box, the pixels were altered
  const verification = verifyPlateAltered(original, target, width, height, boxX, boxY, boxW, boxH);
  assert.equal(verification.isAltered, true);
  assert.ok(verification.deltaSum > 1000, `Delta sum must be significant (got ${verification.deltaSum})`);

  // Verify that pixels OUTSIDE the box remain strictly untouched
  let outsideDelta = 0;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 20; x++) {
      const idx = (y * width + x) * 4;
      outsideDelta += Math.abs(original[idx] - target[idx]);
      outsideDelta += Math.abs(original[idx + 1] - target[idx + 1]);
      outsideDelta += Math.abs(original[idx + 2] - target[idx + 2]);
    }
  }
  assert.equal(outsideDelta, 0, 'Pixels outside the bounding box must remain identical');
});

test('2. Multiple passes of mosaic downsampling completely homogenize letter edges', () => {
  const width = 40;
  const height = 20;
  const buffer = new Uint8ClampedArray(width * height * 4);

  // Paint alternating black and white bars (simulating registration letters like 'W' or 'M')
  for (let i = 0; i < width * height; i++) {
    const val = (i % 2 === 0) ? 0 : 255;
    buffer[i * 4] = val;
    buffer[i * 4 + 1] = val;
    buffer[i * 4 + 2] = val;
    buffer[i * 4 + 3] = 255;
  }

  // Destroy pixels with 10px block size
  destroyPixelsInBuffer(buffer, width, height, 0, 0, width, height, 10);

  // Inside each 10x10 block, all pixels should now be identical
  const firstBlockColor = buffer[0];
  assert.ok(firstBlockColor > 100 && firstBlockColor < 150, 'Block average must be middle grey');

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const idx = (y * width + x) * 4;
      assert.equal(buffer[idx], firstBlockColor, 'All pixels in block must have identical homogenized value');
    }
  }
});
