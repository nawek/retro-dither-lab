import { DitherAlgorithm } from '@/components/AlgorithmSelector';

export const DITHER_ALGORITHMS: DitherAlgorithm[] = [
  {
    id: 'floyd-steinberg',
    name: 'Floyd-Steinberg',
    description: 'Classic error diffusion for smooth gradients',
    category: 'Error Diffusion'
  },
  {
    id: 'atkinson',
    name: 'Atkinson',
    description: 'Apple MacPaint-style dithering',
    category: 'Error Diffusion'
  },
  {
    id: 'stucki',
    name: 'Stucki',
    description: 'High-quality error diffusion',
    category: 'Error Diffusion'
  },
  {
    id: 'bayer-2x2',
    name: 'Bayer 2×2',
    description: 'Simple ordered dithering pattern',
    category: 'Ordered Dithering'
  },
  {
    id: 'bayer-4x4',
    name: 'Bayer 4×4',
    description: 'Classic retro bitmap pattern',
    category: 'Ordered Dithering'
  },
  {
    id: 'bayer-8x8',
    name: 'Bayer 8×8',
    description: 'Fine-grained ordered pattern',
    category: 'Ordered Dithering'
  },
  {
    id: 'halftone-dots',
    name: 'Halftone Dots',
    description: 'Newspaper-style dot patterns',
    category: 'Halftone'
  },
  {
    id: 'random',
    name: 'Random Noise',
    description: 'Chaotic pixel-based dithering',
    category: 'Experimental'
  },
  {
    id: 'datamosh',
    name: 'Datamosh',
    description: 'Digital compression artifacts',
    category: 'Glitch'
  },
  {
    id: 'pixel-sort',
    name: 'Pixel Sort',
    description: 'Sorted pixel glitch effect',
    category: 'Glitch'
  },
  {
    id: 'scanline-displacement',
    name: 'Scanline Glitch',
    description: 'Horizontal line displacement',
    category: 'Glitch'
  },
  {
    id: 'rgb-shift',
    name: 'RGB Shift',
    description: 'Chromatic aberration effect',
    category: 'Glitch'
  },
  {
    id: 'bit-crush',
    name: 'Bit Crush',
    description: 'Reduce color bit depth',
    category: 'Glitch'
  }
];

// Bayer matrices for ordered dithering
const BAYER_2X2 = [
  [0, 2],
  [3, 1]
];

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

export function applyDither(
  imageData: ImageData,
  algorithm: string,
  brightness: number = 100,
  contrast: number = 100,
  threshold: number = 128,
  noiseLevel: number = 0,
  saturation: number = 100,
  posterize: number = 256,
  blur: number = 0
): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const { width, height } = imageData;
  
  // Apply blur effect first if needed
  if (blur > 0) {
    applyBlur(data, width, height, blur);
  }
  
  // Apply brightness, contrast, and saturation adjustments
  for (let i = 0; i < data.length; i += 4) {
    // Apply saturation
    if (saturation !== 100) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const satFactor = saturation / 100;
      
      for (let channel = 0; channel < 3; channel++) {
        data[i + channel] = Math.max(0, Math.min(255, 
          gray + (data[i + channel] - gray) * satFactor
        ));
      }
    }
    
    // Apply contrast (centered around 128)
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let channel = 0; channel < 3; channel++) {
      let value = contrastFactor * (data[i + channel] - 128) + 128;
      
      // Apply brightness
      value = value * (brightness / 100);
      
      // Clamp values
      data[i + channel] = Math.max(0, Math.min(255, value));
    }
    
    // Apply posterization
    if (posterize < 256) {
      for (let channel = 0; channel < 3; channel++) {
        const step = 255 / (posterize - 1);
        data[i + channel] = Math.round(data[i + channel] / step) * step;
      }
    }
  }

  // Add noise if specified
  if (noiseLevel > 0) {
    for (let i = 0; i < data.length; i += 4) {
      for (let channel = 0; channel < 3; channel++) {
        const noise = (Math.random() - 0.5) * noiseLevel * 2.55;
        data[i + channel] = Math.max(0, Math.min(255, data[i + channel] + noise));
      }
    }
  }

  // Apply dithering/glitch algorithm
  switch (algorithm) {
    case 'floyd-steinberg':
      return floydSteinbergDither(data, width, height, threshold);
    case 'atkinson':
      return atkinsonDither(data, width, height, threshold);
    case 'stucki':
      return stuckiDither(data, width, height, threshold);
    case 'bayer-2x2':
      return bayerDither(data, width, height, BAYER_2X2, threshold);
    case 'bayer-4x4':
      return bayerDither(data, width, height, BAYER_4X4, threshold);
    case 'bayer-8x8':
      return bayerDither(data, width, height, BAYER_8X8, threshold);
    case 'halftone-dots':
      return halftoneDither(data, width, height, threshold);
    case 'random':
      return randomDither(data, width, height, threshold);
    case 'datamosh':
      return datamoshEffect(data, width, height, noiseLevel);
    case 'pixel-sort':
      return pixelSortEffect(data, width, height, threshold);
    case 'scanline-displacement':
      return scanlineGlitch(data, width, height, noiseLevel);
    case 'rgb-shift':
      return rgbShiftEffect(data, width, height, noiseLevel);
    case 'bit-crush':
      return bitCrushEffect(data, width, height, posterize);
    default:
      return new ImageData(data, width, height);
  }
}

function applyBlur(data: Uint8ClampedArray, width: number, height: number, radius: number) {
  if (radius <= 0) return;
  
  const tempData = new Uint8ClampedArray(data);
  const kernelSize = Math.ceil(radius * 2) + 1;
  const sigma = radius / 3;
  
  // Simple box blur approximation for performance
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let dy = -Math.floor(kernelSize/2); dy <= Math.floor(kernelSize/2); dy++) {
        for (let dx = -Math.floor(kernelSize/2); dx <= Math.floor(kernelSize/2); dx++) {
          const ny = y + dy;
          const nx = x + dx;
          
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const nIdx = (ny * width + nx) * 4;
            r += tempData[nIdx];
            g += tempData[nIdx + 1];
            b += tempData[nIdx + 2];
            count++;
          }
        }
      }
      
      if (count > 0) {
        data[idx] = r / count;
        data[idx + 1] = g / count;
        data[idx + 2] = b / count;
      }
    }
  }
}

function floydSteinbergDither(data: Uint8ClampedArray, width: number, height: number, threshold: number): ImageData {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Convert to grayscale
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const newGray = gray >= threshold ? 255 : 0;
      const error = gray - newGray;
      
      // Set pixel to black or white
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
      
      // Distribute error using Floyd-Steinberg matrix
      const positions = [
        { x: x + 1, y: y, factor: 7/16 },
        { x: x - 1, y: y + 1, factor: 3/16 },
        { x: x, y: y + 1, factor: 5/16 },
        { x: x + 1, y: y + 1, factor: 1/16 }
      ];
      
      positions.forEach(({ x: nx, y: ny, factor }) => {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = (ny * width + nx) * 4;
          const errorValue = error * factor;
          for (let c = 0; c < 3; c++) {
            data[nIdx + c] = Math.max(0, Math.min(255, data[nIdx + c] + errorValue));
          }
        }
      });
    }
  }
  
  return new ImageData(data, width, height);
}

function atkinsonDither(data: Uint8ClampedArray, width: number, height: number, threshold: number): ImageData {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const newGray = gray >= threshold ? 255 : 0;
      const error = gray - newGray;
      
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
      
      // Atkinson dithering pattern
      const errorFraction = error / 8;
      const positions = [
        { x: x + 1, y: y },
        { x: x + 2, y: y },
        { x: x - 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x + 1, y: y + 1 },
        { x: x, y: y + 2 }
      ];
      
      positions.forEach(({ x: nx, y: ny }) => {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = (ny * width + nx) * 4;
          for (let c = 0; c < 3; c++) {
            data[nIdx + c] = Math.max(0, Math.min(255, data[nIdx + c] + errorFraction));
          }
        }
      });
    }
  }
  
  return new ImageData(data, width, height);
}

function stuckiDither(data: Uint8ClampedArray, width: number, height: number, threshold: number): ImageData {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const newGray = gray >= threshold ? 255 : 0;
      const error = gray - newGray;
      
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
      
      // Stucki error distribution
      const positions = [
        { x: x + 1, y: y, factor: 8/42 },
        { x: x + 2, y: y, factor: 4/42 },
        { x: x - 2, y: y + 1, factor: 2/42 },
        { x: x - 1, y: y + 1, factor: 4/42 },
        { x: x, y: y + 1, factor: 8/42 },
        { x: x + 1, y: y + 1, factor: 4/42 },
        { x: x + 2, y: y + 1, factor: 2/42 },
        { x: x - 1, y: y + 2, factor: 2/42 },
        { x: x, y: y + 2, factor: 4/42 },
        { x: x + 1, y: y + 2, factor: 2/42 }
      ];
      
      positions.forEach(({ x: nx, y: ny, factor }) => {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = (ny * width + nx) * 4;
          const errorValue = error * factor;
          for (let c = 0; c < 3; c++) {
            data[nIdx + c] = Math.max(0, Math.min(255, data[nIdx + c] + errorValue));
          }
        }
      });
    }
  }
  
  return new ImageData(data, width, height);
}

function bayerDither(data: Uint8ClampedArray, width: number, height: number, matrix: number[][], threshold: number): ImageData {
  const matrixSize = matrix.length;
  const maxValue = matrixSize * matrixSize - 1;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const bayerValue = (matrix[y % matrixSize][x % matrixSize] / maxValue) * 255;
      const adjustedThreshold = threshold + (bayerValue - 128);
      const newGray = gray >= adjustedThreshold ? 255 : 0;
      
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }
  
  return new ImageData(data, width, height);
}

function halftoneDither(data: Uint8ClampedArray, width: number, height: number, threshold: number): ImageData {
  const dotSize = 8;
  
  for (let y = 0; y < height; y += dotSize) {
    for (let x = 0; x < width; x += dotSize) {
      // Calculate average brightness in this block
      let totalBrightness = 0;
      let pixelCount = 0;
      
      for (let dy = 0; dy < dotSize && y + dy < height; dy++) {
        for (let dx = 0; dx < dotSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          totalBrightness += 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          pixelCount++;
        }
      }
      
      const avgBrightness = totalBrightness / pixelCount;
      const normalizedThreshold = threshold / 255;
      const dotRadius = Math.sqrt(((avgBrightness / 255) - normalizedThreshold + 1) * (dotSize * dotSize / 4) / Math.PI);
      const centerX = dotSize / 2;
      const centerY = dotSize / 2;
      
      // Draw the dot
      for (let dy = 0; dy < dotSize && y + dy < height; dy++) {
        for (let dx = 0; dx < dotSize && x + dx < width; dx++) {
          const distance = Math.sqrt((dx - centerX) ** 2 + (dy - centerY) ** 2);
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const value = distance <= Math.max(0, dotRadius) ? 0 : 255;
          
          data[idx] = data[idx + 1] = data[idx + 2] = value;
        }
      }
    }
  }
  
  return new ImageData(data, width, height);
}

function randomDither(data: Uint8ClampedArray, width: number, height: number, threshold: number): ImageData {
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const randomThreshold = threshold + (Math.random() - 0.5) * 100;
    const newGray = gray >= randomThreshold ? 255 : 0;
    
    data[i] = data[i + 1] = data[i + 2] = newGray;
  }
  
  return new ImageData(data, width, height);
}

// New glitch effects
function datamoshEffect(data: Uint8ClampedArray, width: number, height: number, intensity: number): ImageData {
  const blockSize = Math.max(2, Math.floor(intensity / 10) + 2);
  const compressionRate = intensity / 100;
  
  // Create compression artifacts by averaging blocks and adding displacement
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      // Calculate average color in block
      let avgR = 0, avgG = 0, avgB = 0, count = 0;
      
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          avgR += data[idx];
          avgG += data[idx + 1];
          avgB += data[idx + 2];
          count++;
        }
      }
      
      avgR /= count;
      avgG /= count;
      avgB /= count;
      
      // Apply compression effect with some random displacement
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          
          // Mix original with averaged color based on compression rate
          data[idx] = avgR * compressionRate + data[idx] * (1 - compressionRate);
          data[idx + 1] = avgG * compressionRate + data[idx + 1] * (1 - compressionRate);
          data[idx + 2] = avgB * compressionRate + data[idx + 2] * (1 - compressionRate);
          
          // Add some random artifacts
          if (Math.random() < compressionRate * 0.1) {
            data[idx] = Math.random() * 255;
            data[idx + 1] = Math.random() * 255;
            data[idx + 2] = Math.random() * 255;
          }
        }
      }
    }
  }
  
  return new ImageData(data, width, height);
}

function pixelSortEffect(data: Uint8ClampedArray, width: number, height: number, threshold: number): ImageData {
  const sortIntensity = threshold / 255;
  
  // Sort pixels horizontally based on brightness
  for (let y = 0; y < height; y++) {
    if (Math.random() < sortIntensity) {
      const row: Array<{r: number, g: number, b: number, brightness: number}> = [];
      
      // Extract row data
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const brightness = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        row.push({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
          brightness
        });
      }
      
      // Sort by brightness
      row.sort((a, b) => a.brightness - b.brightness);
      
      // Put sorted data back
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        data[idx] = row[x].r;
        data[idx + 1] = row[x].g;
        data[idx + 2] = row[x].b;
      }
    }
  }
  
  return new ImageData(data, width, height);
}

function scanlineGlitch(data: Uint8ClampedArray, width: number, height: number, intensity: number): ImageData {
  const displacement = Math.floor(intensity / 2);
  
  for (let y = 0; y < height; y++) {
    if (Math.random() < intensity / 100) {
      const shift = Math.floor((Math.random() - 0.5) * displacement * 2);
      const tempRow = new Uint8ClampedArray(width * 4);
      
      // Copy original row
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        tempRow[x * 4] = data[idx];
        tempRow[x * 4 + 1] = data[idx + 1];
        tempRow[x * 4 + 2] = data[idx + 2];
        tempRow[x * 4 + 3] = data[idx + 3];
      }
      
      // Apply shifted row
      for (let x = 0; x < width; x++) {
        const sourceX = Math.max(0, Math.min(width - 1, x - shift));
        const idx = (y * width + x) * 4;
        const sourceIdx = sourceX * 4;
        
        data[idx] = tempRow[sourceIdx];
        data[idx + 1] = tempRow[sourceIdx + 1];
        data[idx + 2] = tempRow[sourceIdx + 2];
      }
    }
  }
  
  return new ImageData(data, width, height);
}

function rgbShiftEffect(data: Uint8ClampedArray, width: number, height: number, intensity: number): ImageData {
  const shift = Math.floor(intensity / 5);
  const tempData = new Uint8ClampedArray(data);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Red channel shift
      const redX = Math.max(0, Math.min(width - 1, x + shift));
      const redIdx = (y * width + redX) * 4;
      data[idx] = tempData[redIdx];
      
      // Green channel (no shift)
      data[idx + 1] = tempData[idx + 1];
      
      // Blue channel shift opposite direction
      const blueX = Math.max(0, Math.min(width - 1, x - shift));
      const blueIdx = (y * width + blueX) * 4;
      data[idx + 2] = tempData[blueIdx + 2];
    }
  }
  
  return new ImageData(data, width, height);
}

function bitCrushEffect(data: Uint8ClampedArray, width: number, height: number, bitDepth: number): ImageData {
  const levels = Math.max(2, Math.min(256, bitDepth));
  const step = 255 / (levels - 1);
  
  for (let i = 0; i < data.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      data[i + channel] = Math.round(data[i + channel] / step) * step;
    }
  }
  
  return new ImageData(data, width, height);
}
