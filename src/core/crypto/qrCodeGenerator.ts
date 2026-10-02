/**
 * DATUM Atelier — Cryptographic Offline QR Code Generator
 * 
 * Compliant ISO/IEC 18004 QR Code Matrix and SVG Vector Engine.
 * Generates self-contained, offline-scannable 2D QR codes for cross-border
 * customs manifests, carnet cryptographic hashes, and vehicle transit tokens.
 * Zero external dependencies.
 */

// Galois Field GF(256) exponential and logarithm lookup tables
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
let x = 1;
for (let i = 0; i < 255; i++) {
  EXP[i] = x;
  EXP[i + 255] = x;
  LOG[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11D : 0);
}

function gMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

// Generates Reed-Solomon generator polynomial for a given number of EC codewords
function getGeneratorPoly(numEc: number): number[] {
  let poly = [1];
  for (let i = 0; i < numEc; i++) {
    const factor = [1, EXP[i]];
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      for (let k = 0; k < factor.length; k++) {
        next[j + k] ^= gMul(poly[j], factor[k]);
      }
    }
    poly = next;
  }
  return poly;
}

// Computes Reed-Solomon error correction bytes
function computeReedSolomon(data: number[], numEc: number): number[] {
  const gen = getGeneratorPoly(numEc);
  const msg = [...data, ...new Array(numEc).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const lead = msg[i];
    if (lead !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gMul(lead, gen[j]);
      }
    }
  }
  return msg.slice(data.length);
}

// QR Version parameters for Level L (Low error correction ~7% recovery, optimal for screens)
interface VersionConfig {
  version: number;
  totalCodewords: number;
  dataCodewords: number;
  ecCodewords: number;
  alignmentPattern?: number; // single coordinate for center of alignment pattern
}

const VERSION_CONFIGS: VersionConfig[] = [
  { version: 1, totalCodewords: 26, dataCodewords: 19, ecCodewords: 7 },
  { version: 2, totalCodewords: 44, dataCodewords: 34, ecCodewords: 10, alignmentPattern: 18 },
  { version: 3, totalCodewords: 70, dataCodewords: 55, ecCodewords: 15, alignmentPattern: 22 },
  { version: 4, totalCodewords: 100, dataCodewords: 80, ecCodewords: 20, alignmentPattern: 26 },
  { version: 5, totalCodewords: 134, dataCodewords: 108, ecCodewords: 26, alignmentPattern: 30 },
  { version: 6, totalCodewords: 172, dataCodewords: 136, ecCodewords: 36, alignmentPattern: 34 },
];

/**
 * Encodes string to 8-bit Byte mode bitstream with length and terminator
 */
function encodeByteMode(text: string, dataCodewords: number): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 255) {
      // Encode UTF-8
      const enc = new TextEncoder().encode(text[i]);
      enc.forEach((b) => bytes.push(b));
    } else {
      bytes.push(code);
    }
  }

  // Bit buffer builder
  let bitBuffer = 0;
  let bitCount = 0;
  const result: number[] = [];

  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitBuffer = (bitBuffer << 1) | ((val >> i) & 1);
      bitCount++;
      if (bitCount === 8) {
        result.push(bitBuffer);
        bitBuffer = 0;
        bitCount = 0;
      }
    }
  }

  // 1. Mode indicator: 0100 for Byte mode (4 bits)
  pushBits(0b0100, 4);
  // 2. Character count indicator: 8 bits for versions 1-9 in Byte mode
  pushBits(bytes.length, 8);
  // 3. Character bytes
  for (const b of bytes) {
    pushBits(b, 8);
  }

  // 4. Terminator: up to 4 zeroes
  const remainingBits = dataCodewords * 8 - (result.length * 8 + bitCount);
  const termLen = Math.min(4, Math.max(0, remainingBits));
  pushBits(0, termLen);

  // 5. Pad to next byte boundary
  if (bitCount > 0) {
    pushBits(0, 8 - bitCount);
  }

  // 6. Pad with alternating 0xEC and 0x11
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (result.length < dataCodewords) {
    result.push(padBytes[padIdx % 2]);
    padIdx++;
  }

  return result.slice(0, dataCodewords);
}

/**
 * Calculates 15-bit format information for Level L and Mask 0
 * Level L indicator = 01 (binary)
 * Mask 0 = 000 (binary)
 * 5 bits: 01000
 */
function getFormatInfoBits(): boolean[] {
  // 5 data bits: 01000 = 8
  const data = 0b01000;
  let bch = data << 10;
  const gen = 0x537;
  for (let i = 14; i >= 10; i--) {
    if ((bch >> i) & 1) {
      bch ^= gen << (i - 10);
    }
  }
  const formatWord = ((data << 10) | bch) ^ 0x5412; // XOR mask
  const bits: boolean[] = [];
  for (let i = 14; i >= 0; i--) {
    bits.push(((formatWord >> i) & 1) === 1);
  }
  return bits;
}

export interface QrMatrix {
  size: number;
  version: number;
  modules: boolean[][];
}

/**
 * Generates an ISO-compliant QR Code module matrix from text.
 */
export function generateQrMatrix(text: string): QrMatrix {
  // Determine smallest version that fits text length
  const byteCount = new TextEncoder().encode(text).length;
  // Overhead: 4 bits mode + 8 bits length = 1.5 bytes -> need dataCodewords >= byteCount + 2
  const config = VERSION_CONFIGS.find((c) => c.dataCodewords >= byteCount + 2);
  if (!config) {
    throw new Error(`Data too long for compact QR encoder (${byteCount} bytes). Maximum is 134 bytes.`);
  }

  const { version, dataCodewords, ecCodewords, alignmentPattern } = config;
  const size = version * 4 + 17;

  // Initialize matrix and reservation mask
  const modules: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));

  function setModule(r: number, c: number, val: boolean, markFunction = true) {
    modules[r][c] = val;
    if (markFunction) isFunction[r][c] = true;
  }

  // 1. Finder patterns (7x7) + Separators
  function addFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isBlack = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
            setModule(nr, nc, isBlack);
          } else {
            setModule(nr, nc, false); // Separator
          }
        }
      }
    }
  }

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // 2. Alignment pattern (5x5) if Version >= 2
  if (alignmentPattern !== undefined) {
    const ar = alignmentPattern;
    const ac = alignmentPattern;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const isBlack = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
        setModule(ar + r, ac + c, isBlack);
      }
    }
  }

  // 3. Timing patterns (Row 6 and Column 6)
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) setModule(6, i, i % 2 === 0);
    if (!isFunction[i][6]) setModule(i, 6, i % 2 === 0);
  }

  // 4. Dark module
  setModule(size - 8, 8, true);

  // 5. Reserve format info areas around finders
  const formatBits = getFormatInfoBits();

  // Top-left finder format
  const formatCoordsTL: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
    [8, 7], [8, 8], [7, 8],
    [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = formatCoordsTL[i];
    setModule(r, c, formatBits[i]);
  }

  // Split format around other finders
  for (let i = 0; i < 7; i++) {
    // Bottom-left
    setModule(size - 1 - i, 8, formatBits[i]);
  }
  for (let i = 7; i < 15; i++) {
    // Top-right
    setModule(8, size - 15 + i, formatBits[i]);
  }

  // 6. Encode Data + Error Correction
  const dataBytes = encodeByteMode(text, dataCodewords);
  const ecBytes = computeReedSolomon(dataBytes, ecCodewords);
  const fullCodewords = [...dataBytes, ...ecBytes];

  // Convert codewords to bit array
  const allBits: boolean[] = [];
  for (const byte of fullCodewords) {
    for (let i = 7; i >= 0; i--) {
      allBits.push(((byte >> i) & 1) === 1);
    }
  }

  // 7. Place data bits in 2-column zig-zag traversal from bottom-right
  let bitIdx = 0;
  let upwards = true;

  for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
    // Skip column 6 (vertical timing pattern)
    if (rightCol === 6) rightCol--;

    const colRange = [rightCol, rightCol - 1];
    const rowRange = upwards
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rowRange) {
      for (const c of colRange) {
        if (!isFunction[r][c]) {
          let bit = bitIdx < allBits.length ? allBits[bitIdx++] : false;
          // Apply Mask 0: (row + col) % 2 === 0
          if ((r + c) % 2 === 0) {
            bit = !bit;
          }
          setModule(r, c, bit, false);
        }
      }
    }
    upwards = !upwards;
  }

  return { size, version, modules };
}

/**
 * Renders the QR code matrix to an SVG markup string.
 */
export function generateQrSvg(
  text: string,
  options: {
    size?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
  } = {}
): string {
  const {
    size = 200,
    margin = 2,
    darkColor = '#000000',
    lightColor = '#FFFFFF',
  } = options;

  const matrix = generateQrMatrix(text);
  const matrixSize = matrix.size;
  const viewBoxSize = matrixSize + margin * 2;

  let pathD = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix.modules[r][c]) {
        pathD += `M${c + margin},${r + margin}h1v1h-1z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${size}" height="${size}" shape-rendering="crispEdges">
  <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="${lightColor}" />
  <path d="${pathD.trim()}" fill="${darkColor}" />
</svg>`;
}
