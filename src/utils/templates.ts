import { Template } from '@/components/TemplateSelector';

export const TEMPLATES: Template[] = [
  {
    id: 'classic-1bit',
    name: 'Classic 1-Bit',
    description: 'Pure black & white retro style',
    icon: 'Palette',
    defaultSettings: {
      algorithm: 'floyd-steinberg',
      brightness: 100,
      contrast: 120,
      threshold: 128,
      noiseLevel: 0,
      saturation: 0,
      posterize: 2
    },
    availableControls: ['brightness', 'contrast', 'threshold'],
    category: 'Retro'
  },
  {
    id: 'gameboy',
    name: 'Game Boy',
    description: 'Nintendo Game Boy green tint',
    icon: 'Gamepad2',
    defaultSettings: {
      algorithm: 'bayer-4x4',
      brightness: 110,
      contrast: 130,
      threshold: 140,
      noiseLevel: 5,
      saturation: 80,
      posterize: 4
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'noiseLevel', 'saturation', 'posterize'],
    category: 'Retro'
  },
  {
    id: 'crt-monitor',
    name: 'CRT Monitor',
    description: 'Old computer monitor effect',
    icon: 'Tv',
    defaultSettings: {
      algorithm: 'bayer-8x8',
      brightness: 95,
      contrast: 140,
      threshold: 120,
      noiseLevel: 15,
      saturation: 110,
      blur: 1
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'noiseLevel', 'saturation', 'blur'],
    category: 'Retro'
  },
  {
    id: 'newspaper',
    name: 'Newspaper',
    description: 'Classic halftone print style',
    icon: 'Camera',
    defaultSettings: {
      algorithm: 'halftone-dots',
      brightness: 105,
      contrast: 150,
      threshold: 128,
      noiseLevel: 0,
      saturation: 0,
      posterize: 2
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'posterize'],
    category: 'Print'
  },
  {
    id: 'crosshatch-art',
    name: 'Crosshatch',
    description: 'Hand-drawn crosshatch style',
    icon: 'Grid3X3',
    defaultSettings: {
      algorithm: 'crosshatch',
      brightness: 100,
      contrast: 140,
      threshold: 120,
      noiseLevel: 0,
      saturation: 0,
      posterize: 2
    },
    availableControls: ['brightness', 'contrast', 'threshold'],
    category: 'Artistic'
  },
  {
    id: 'stipple-dots',
    name: 'Stipple',
    description: 'Pointillism dot pattern',
    icon: 'Scan',
    defaultSettings: {
      algorithm: 'stipple',
      brightness: 105,
      contrast: 130,
      threshold: 140,
      noiseLevel: 0,
      saturation: 0,
      posterize: 2
    },
    availableControls: ['brightness', 'contrast', 'threshold'],
    category: 'Artistic'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic glitch aesthetic',
    icon: 'Zap',
    defaultSettings: {
      algorithm: 'random',
      brightness: 120,
      contrast: 160,
      threshold: 100,
      noiseLevel: 25,
      saturation: 140,
      posterize: 8
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'noiseLevel', 'saturation', 'posterize'],
    category: 'Modern'
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    description: 'Dreamy 80s aesthetic',
    icon: 'Sparkles',
    defaultSettings: {
      algorithm: 'atkinson',
      brightness: 115,
      contrast: 125,
      threshold: 110,
      noiseLevel: 10,
      saturation: 160,
      posterize: 16,
      blur: 0.5
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'noiseLevel', 'saturation', 'posterize', 'blur'],
    category: 'Modern'
  },
  {
    id: 'blue-noise',
    name: 'Blue Noise',
    description: 'High-quality noise distribution',
    icon: 'Move',
    defaultSettings: {
      algorithm: 'blue-noise',
      brightness: 100,
      contrast: 120,
      threshold: 128,
      noiseLevel: 0,
      saturation: 100,
      posterize: 256
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'saturation'],
    category: 'Modern'
  },
  {
    id: 'datamosh',
    name: 'Datamosh',
    description: 'Digital compression glitch',
    icon: 'Blocks',
    defaultSettings: {
      algorithm: 'datamosh',
      brightness: 100,
      contrast: 110,
      threshold: 128,
      noiseLevel: 50,
      saturation: 120,
      posterize: 16
    },
    availableControls: ['brightness', 'contrast', 'noiseLevel', 'saturation', 'posterize'],
    category: 'Glitch'
  },
  {
    id: 'pixel-storm',
    name: 'Pixel Storm',
    description: 'Chaotic pixel sorting effect',
    icon: 'Shuffle',
    defaultSettings: {
      algorithm: 'pixel-sort',
      brightness: 105,
      contrast: 130,
      threshold: 180,
      noiseLevel: 30,
      saturation: 140,
      posterize: 32
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'noiseLevel', 'saturation'],
    category: 'Glitch'
  },
  {
    id: 'scanline-chaos',
    name: 'Scanline Chaos',
    description: 'Horizontal displacement glitch',
    icon: 'Monitor',
    defaultSettings: {
      algorithm: 'scanline-displacement',
      brightness: 110,
      contrast: 120,
      threshold: 128,
      noiseLevel: 40,
      saturation: 110,
      posterize: 64
    },
    availableControls: ['brightness', 'contrast', 'noiseLevel', 'saturation', 'posterize'],
    category: 'Glitch'
  },
  {
    id: 'rgb-nightmare',
    name: 'RGB Nightmare',
    description: 'Chromatic aberration chaos',
    icon: 'Eye',
    defaultSettings: {
      algorithm: 'rgb-shift',
      brightness: 115,
      contrast: 140,
      threshold: 128,
      noiseLevel: 60,
      saturation: 160,
      posterize: 128
    },
    availableControls: ['brightness', 'contrast', 'noiseLevel', 'saturation', 'posterize'],
    category: 'Glitch'
  },
  {
    id: 'bit-destroyer',
    name: 'Bit Destroyer',
    description: 'Extreme bit crushing effect',
    icon: 'Cpu',
    defaultSettings: {
      algorithm: 'bit-crush',
      brightness: 100,
      contrast: 150,
      threshold: 128,
      noiseLevel: 20,
      saturation: 80,
      posterize: 4
    },
    availableControls: ['brightness', 'contrast', 'noiseLevel', 'saturation', 'posterize'],
    category: 'Glitch'
  },
  {
    id: 'wave-distort',
    name: 'Wave Distortion',
    description: 'Sinusoidal wave displacement',
    icon: 'Move',
    defaultSettings: {
      algorithm: 'wave-distortion',
      brightness: 100,
      contrast: 120,
      threshold: 128,
      noiseLevel: 30,
      saturation: 100,
      posterize: 256
    },
    availableControls: ['brightness', 'contrast', 'noiseLevel', 'saturation'],
    category: 'Glitch'
  },
  {
    id: 'block-chaos',
    name: 'Block Chaos',
    description: 'Random block displacement',
    icon: 'Blocks',
    defaultSettings: {
      algorithm: 'block-glitch',
      brightness: 105,
      contrast: 130,
      threshold: 128,
      noiseLevel: 45,
      saturation: 120,
      posterize: 64
    },
    availableControls: ['brightness', 'contrast', 'noiseLevel', 'saturation', 'posterize'],
    category: 'Glitch'
  }
];
