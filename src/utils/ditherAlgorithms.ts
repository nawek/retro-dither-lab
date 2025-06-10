
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
  contrast: number = 100
): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const { width, height } = imageData;
  
  // Apply brightness and contrast adjustments
  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast first
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
    
    // Apply brightness
    data[i] = Math.max(0, Math.min(255, data[i] * (brightness / 100)));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * (brightness / 100)));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * (brightness / 100)));
  }

  switch (algorithm) {
    case 'floyd-steinberg':
      return floydSteinbergDither(data, width, height);
    case 'atkinson':
      return atkinsonDither(data, width, height);
    case 'stucki':
      return stuckiDither(data, width, height);
    case 'bayer-2x2':
      return bayerDither(data, width, height, BAYER_2X2);
    case 'bayer-4x4':
      return bayerDither(data, width, height, BAYER_4X4);
    case 'bayer-8x8':
      return bayerDither(data, width, height, BAYER_8X8);
    case 'halftone-dots':
      return halftoneDither(data, width, height);
    case 'random':
      return randomDither(data, width, height);
    default:
      return new ImageData(data, width, height);
  }
}

function floydSteinbergDither(data: Uint8ClampedArray, width: number, height: number): ImageData {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Convert to grayscale
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const newGray = gray < 128 ? 0 : 255;
      const error = gray - newGray;
      
      // Set pixel to black or white
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
      
      // Distribute error
      if (x + 1 < width) {
        const rightIdx = (y * width + x + 1) * 4;
        data[rightIdx] = Math.max(0, Math.min(255, data[rightIdx] + error * 7/16));
        data[rightIdx + 1] = Math.max(0, Math.min(255, data[rightIdx + 1] + error * 7/16));
        data[rightIdx + 2] = Math.max(0, Math.min(255, data[rightIdx + 2] + error * 7/16));
      }
      
      if (y + 1 < height) {
        if (x - 1 >= 0) {
          const bottomLeftIdx = ((y + 1) * width + x - 1) * 4;
          data[bottomLeftIdx] = Math.max(0, Math.min(255, data[bottomLeftIdx] + error * 3/16));
          data[bottomLeftIdx + 1] = Math.max(0, Math.min(255, data[bottomLeftIdx + 1] + error * 3/16));
          data[bottomLeftIdx + 2] = Math.max(0, Math.min(255, data[bottomLeftIdx + 2] + error * 3/16));
        }
        
        const bottomIdx = ((y + 1) * width + x) * 4;
        data[bottomIdx] = Math.max(0, Math.min(255, data[bottomIdx] + error * 5/16));
        data[bottomIdx + 1] = Math.max(0, Math.min(255, data[bottomIdx + 1] + error * 5/16));
        data[bottomIdx + 2] = Math.max(0, Math.min(255, data[bottomIdx + 2] + error * 5/16));
        
        if (x + 1 < width) {
          const bottomRightIdx = ((y + 1) * width + x + 1) * 4;
          data[bottomRightIdx] = Math.max(0, Math.min(255, data[bottomRightIdx] + error * 1/16));
          data[bottomRightIdx + 1] = Math.max(0, Math.min(255, data[bottomRightIdx + 1] + error * 1/16));
          data[bottomRightIdx + 2] = Math.max(0, Math.min(255, data[bottomRightIdx + 2] + error * 1/16));
        }
      }
    }
  }
  
  return new ImageData(data, width, height);
}

function atkinsonDither(data: Uint8ClampedArray, width: number, height: number): ImageData {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const newGray = gray < 128 ? 0 : 255;
      const error = gray - newGray;
      
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
      
      // Atkinson dithering pattern
      const errorFraction = error / 8;
      
      if (x + 1 < width) {
        const rightIdx = (y * width + x + 1) * 4;
        data[rightIdx] = Math.max(0, Math.min(255, data[rightIdx] + errorFraction));
        data[rightIdx + 1] = Math.max(0, Math.min(255, data[rightIdx + 1] + errorFraction));
        data[rightIdx + 2] = Math.max(0, Math.min(255, data[rightIdx + 2] + errorFraction));
      }
      
      if (x + 2 < width) {
        const rightIdx2 = (y * width + x + 2) * 4;
        data[rightIdx2] = Math.max(0, Math.min(255, data[rightIdx2] + errorFraction));
        data[rightIdx2 + 1] = Math.max(0, Math.min(255, data[rightIdx2 + 1] + errorFraction));
        data[rightIdx2 + 2] = Math.max(0, Math.min(255, data[rightIdx2 + 2] + errorFraction));
      }
      
      if (y + 1 < height) {
        if (x - 1 >= 0) {
          const bottomLeftIdx = ((y + 1) * width + x - 1) * 4;
          data[bottomLeftIdx] = Math.max(0, Math.min(255, data[bottomLeftIdx] + errorFraction));
          data[bottomLeftIdx + 1] = Math.max(0, Math.min(255, data[bottomLeftIdx + 1] + errorFraction));
          data[bottomLeftIdx + 2] = Math.max(0, Math.min(255, data[bottomLeftIdx + 2] + errorFraction));
        }
        
        const bottomIdx = ((y + 1) * width + x) * 4;
        data[bottomIdx] = Math.max(0, Math.min(255, data[bottomIdx] + errorFraction));
        data[bottomIdx + 1] = Math.max(0, Math.min(255, data[bottomIdx + 1] + errorFraction));
        data[bottomIdx + 2] = Math.max(0, Math.min(255, data[bottomIdx + 2] + errorFraction));
        
        if (x + 1 < width) {
          const bottomRightIdx = ((y + 1) * width + x + 1) * 4;
          data[bottomRightIdx] = Math.max(0, Math.min(255, data[bottomRightIdx] + errorFraction));
          data[bottomRightIdx + 1] = Math.max(0, Math.min(255, data[bottomRightIdx + 1] + errorFraction));
          data[bottomRightIdx + 2] = Math.max(0, Math.min(255, data[bottomRightIdx + 2] + errorFraction));
        }
      }
      
      if (y + 2 < height) {
        const bottom2Idx = ((y + 2) * width + x) * 4;
        data[bottom2Idx] = Math.max(0, Math.min(255, data[bottom2Idx] + errorFraction));
        data[bottom2Idx + 1] = Math.max(0, Math.min(255, data[bottom2Idx + 1] + errorFraction));
        data[bottom2Idx + 2] = Math.max(0, Math.min(255, data[bottom2Idx + 2] + errorFraction));
      }
    }
  }
  
  return new ImageData(data, width, height);
}

function stuckiDither(data: Uint8ClampedArray, width: number, height: number): ImageData {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const newGray = gray < 128 ? 0 : 255;
      const error = gray - newGray;
      
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
      
      // Stucki error distribution
      if (x + 1 < width) {
        const rightIdx = (y * width + x + 1) * 4;
        data[rightIdx] = Math.max(0, Math.min(255, data[rightIdx] + error * 8/42));
        data[rightIdx + 1] = Math.max(0, Math.min(255, data[rightIdx + 1] + error * 8/42));
        data[rightIdx + 2] = Math.max(0, Math.min(255, data[rightIdx + 2] + error * 8/42));
      }
      
      if (x + 2 < width) {
        const right2Idx = (y * width + x + 2) * 4;
        data[right2Idx] = Math.max(0, Math.min(255, data[right2Idx] + error * 4/42));
        data[right2Idx + 1] = Math.max(0, Math.min(255, data[right2Idx + 1] + error * 4/42));
        data[right2Idx + 2] = Math.max(0, Math.min(255, data[right2Idx + 2] + error * 4/42));
      }
      
      if (y + 1 < height) {
        if (x - 2 >= 0) {
          const bottomLeft2Idx = ((y + 1) * width + x - 2) * 4;
          data[bottomLeft2Idx] = Math.max(0, Math.min(255, data[bottomLeft2Idx] + error * 2/42));
          data[bottomLeft2Idx + 1] = Math.max(0, Math.min(255, data[bottomLeft2Idx + 1] + error * 2/42));
          data[bottomLeft2Idx + 2] = Math.max(0, Math.min(255, data[bottomLeft2Idx + 2] + error * 2/42));
        }
        
        if (x - 1 >= 0) {
          const bottomLeftIdx = ((y + 1) * width + x - 1) * 4;
          data[bottomLeftIdx] = Math.max(0, Math.min(255, data[bottomLeftIdx] + error * 4/42));
          data[bottomLeftIdx + 1] = Math.max(0, Math.min(255, data[bottomLeftIdx + 1] + error * 4/42));
          data[bottomLeftIdx + 2] = Math.max(0, Math.min(255, data[bottomLeftIdx + 2] + error * 4/42));
        }
        
        const bottomIdx = ((y + 1) * width + x) * 4;
        data[bottomIdx] = Math.max(0, Math.min(255, data[bottomIdx] + error * 8/42));
        data[bottomIdx + 1] = Math.max(0, Math.min(255, data[bottomIdx + 1] + error * 8/42));
        data[bottomIdx + 2] = Math.max(0, Math.min(255, data[bottomIdx + 2] + error * 8/42));
        
        if (x + 1 < width) {
          const bottomRightIdx = ((y + 1) * width + x + 1) * 4;
          data[bottomRightIdx] = Math.max(0, Math.min(255, data[bottomRightIdx] + error * 4/42));
          data[bottomRightIdx + 1] = Math.max(0, Math.min(255, data[bottomRightIdx + 1] + error * 4/42));
          data[bottomRightIdx + 2] = Math.max(0, Math.min(255, data[bottomRightIdx + 2] + error * 4/42));
        }
        
        if (x + 2 < width) {
          const bottomRight2Idx = ((y + 1) * width + x + 2) * 4;
          data[bottomRight2Idx] = Math.max(0, Math.min(255, data[bottomRight2Idx] + error * 2/42));
          data[bottomRight2Idx + 1] = Math.max(0, Math.min(255, data[bottomRight2Idx + 1] + error * 2/42));
          data[bottomRight2Idx + 2] = Math.max(0, Math.min(255, data[bottomRight2Idx + 2] + error * 2/42));
        }
      }
      
      if (y + 2 < height) {
        if (x - 1 >= 0) {
          const bottom2LeftIdx = ((y + 2) * width + x - 1) * 4;
          data[bottom2LeftIdx] = Math.max(0, Math.min(255, data[bottom2LeftIdx] + error * 2/42));
          data[bottom2LeftIdx + 1] = Math.max(0, Math.min(255, data[bottom2LeftIdx + 1] + error * 2/42));
          data[bottom2LeftIdx + 2] = Math.max(0, Math.min(255, data[bottom2LeftIdx + 2] + error * 2/42));
        }
        
        const bottom2Idx = ((y + 2) * width + x) * 4;
        data[bottom2Idx] = Math.max(0, Math.min(255, data[bottom2Idx] + error * 4/42));
        data[bottom2Idx + 1] = Math.max(0, Math.min(255, data[bottom2Idx + 1] + error * 4/42));
        data[bottom2Idx + 2] = Math.max(0, Math.min(255, data[bottom2Idx + 2] + error * 4/42));
        
        if (x + 1 < width) {
          const bottom2RightIdx = ((y + 2) * width + x + 1) * 4;
          data[bottom2RightIdx] = Math.max(0, Math.min(255, data[bottom2RightIdx] + error * 2/42));
          data[bottom2RightIdx + 1] = Math.max(0, Math.min(255, data[bottom2RightIdx + 1] + error * 2/42));
          data[bottom2RightIdx + 2] = Math.max(0, Math.min(255, data[bottom2RightIdx + 2] + error * 2/42));
        }
      }
    }
  }
  
  return new ImageData(data, width, height);
}

function bayerDither(data: Uint8ClampedArray, width: number, height: number, matrix: number[][]): ImageData {
  const matrixSize = matrix.length;
  const maxValue = matrixSize * matrixSize - 1;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const threshold = (matrix[y % matrixSize][x % matrixSize] / maxValue) * 255;
      const newGray = gray > threshold ? 255 : 0;
      
      data[idx] = data[idx + 1] = data[idx + 2] = newGray;
    }
  }
  
  return new ImageData(data, width, height);
}

function halftoneDither(data: Uint8ClampedArray, width: number, height: number): ImageData {
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
      const dotRadius = Math.sqrt((avgBrightness / 255) * (dotSize * dotSize / 4) / Math.PI);
      const centerX = dotSize / 2;
      const centerY = dotSize / 2;
      
      // Draw the dot
      for (let dy = 0; dy < dotSize && y + dy < height; dy++) {
        for (let dx = 0; dx < dotSize && x + dx < width; dx++) {
          const distance = Math.sqrt((dx - centerX) ** 2 + (dy - centerY) ** 2);
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const value = distance <= dotRadius ? 0 : 255;
          
          data[idx] = data[idx + 1] = data[idx + 2] = value;
        }
      }
    }
  }
  
  return new ImageData(data, width, height);
}

function randomDither(data: Uint8ClampedArray, width: number, height: number): ImageData {
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const threshold = Math.random() * 255;
    const newGray = gray > threshold ? 255 : 0;
    
    data[i] = data[i + 1] = data[i + 2] = newGray;
  }
  
  return new ImageData(data, width, height);
}
