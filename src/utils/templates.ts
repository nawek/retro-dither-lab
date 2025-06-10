
import { Template } from '@/components/TemplateSelector';
import { Palette, Gamepad2, Tv, Camera, Zap, Sparkles } from 'lucide-react';

export const TEMPLATES: Template[] = [
  {
    id: 'classic-1bit',
    name: 'Classic 1-Bit',
    description: 'Pure black & white retro style',
    icon: <Palette className="w-4 h-4" />,
    defaultSettings: {
      algorithm: 'floyd-steinberg',
      brightness: 100,
      contrast: 120,
      threshold: 128,
      noiseLevel: 0,
      saturation: 0,
      posterize: 2
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'saturation'],
    category: 'Retro'
  },
  {
    id: 'gameboy',
    name: 'Game Boy',
    description: 'Nintendo Game Boy green tint',
    icon: <Gameboy2 className="w-4 h-4" />,
    defaultSettings: {
      algorithm: 'bayer-4x4',
      brightness: 110,
      contrast: 130,
      threshold: 140,
      noiseLevel: 5,
      saturation: 80,
      posterize: 4
    },
    availableControls: ['brightness', 'contrast', 'threshold', 'noiseLevel', 'saturation'],
    category: 'Retro'
  },
  {
    id: 'crt-monitor',
    name: 'CRT Monitor',
    description: 'Old computer monitor effect',
    icon: <Tv className="w-4 h-4" />,
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
    icon: <Camera className="w-4 h-4" />,
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
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic glitch aesthetic',
    icon: <Zap className="w-4 h-4" />,
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
    icon: <Sparkles className="w-4 h-4" />,
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
  }
];
