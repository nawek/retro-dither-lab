
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Download, Shuffle, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  brightness: number;
  contrast: number;
  threshold: number;
  noiseLevel: number;
  saturation: number;
  posterize: number;
  blur: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onThresholdChange: (value: number) => void;
  onNoiseLevelChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
  onPosterizeChange: (value: number) => void;
  onBlurChange: (value: number) => void;
  onRandomize: () => void;
  onReset: () => void;
  onExport: () => void;
  canExport: boolean;
  isProcessing: boolean;
  availableControls: string[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  brightness,
  contrast,
  threshold,
  noiseLevel,
  saturation,
  posterize,
  blur,
  onBrightnessChange,
  onContrastChange,
  onThresholdChange,
  onNoiseLevelChange,
  onSaturationChange,
  onPosterizeChange,
  onBlurChange,
  onRandomize,
  onReset,
  onExport,
  canExport,
  isProcessing,
  availableControls,
}) => {
  const controlComponents = {
    brightness: (
      <div key="brightness">
        <label className="block text-sm font-semibold text-cyan-400 font-mono mb-3">
          BRIGHTNESS: {brightness}%
        </label>
        <Slider
          value={[brightness]}
          onValueChange={(value) => onBrightnessChange(value[0])}
          min={0}
          max={200}
          step={5}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    contrast: (
      <div key="contrast">
        <label className="block text-sm font-semibold text-cyan-400 font-mono mb-3">
          CONTRAST: {contrast}%
        </label>
        <Slider
          value={[contrast]}
          onValueChange={(value) => onContrastChange(value[0])}
          min={0}
          max={200}
          step={5}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    threshold: (
      <div key="threshold">
        <label className="block text-sm font-semibold text-cyan-400 font-mono mb-3">
          THRESHOLD: {threshold}
        </label>
        <Slider
          value={[threshold]}
          onValueChange={(value) => onThresholdChange(value[0])}
          min={0}
          max={255}
          step={1}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    noiseLevel: (
      <div key="noiseLevel">
        <label className="block text-sm font-semibold text-cyan-400 font-mono mb-3">
          NOISE LEVEL: {noiseLevel}%
        </label>
        <Slider
          value={[noiseLevel]}
          onValueChange={(value) => onNoiseLevelChange(value[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    saturation: (
      <div key="saturation">
        <label className="block text-sm font-semibold text-cyan-400 font-mono mb-3">
          SATURATION: {saturation}%
        </label>
        <Slider
          value={[saturation]}
          onValueChange={(value) => onSaturationChange(value[0])}
          min={0}
          max={200}
          step={5}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    posterize: (
      <div key="posterize">
        <label className="block text-sm font-semibold text-cyan-400 font-mono mb-3">
          POSTERIZE: {posterize} colors
        </label>
        <Slider
          value={[posterize]}
          onValueChange={(value) => onPosterizeChange(value[0])}
          min={2}
          max={32}
          step={1}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    ),
    blur: (
      <div key="blur">
        <label className="block text-sm font-semibold text-cyan-400 font-mono mb-3">
          BLUR: {blur.toFixed(1)}px
        </label>
        <Slider
          value={[blur]}
          onValueChange={(value) => onBlurChange(value[0])}
          min={0}
          max={5}
          step={0.1}
          className="w-full"
          disabled={isProcessing}
        />
      </div>
    )
  };

  return (
    <div className="space-y-6 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold text-white font-mono mb-4">
        EFFECT CONTROLS
      </h3>
      
      <div className="space-y-6">
        {availableControls.map(control => controlComponents[control] || null)}
      </div>
      
      <div className="space-y-3 pt-4 border-t border-gray-700">
        <Button
          onClick={onReset}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          RESET
        </Button>
        
        <Button
          onClick={onRandomize}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          RANDOMIZE
        </Button>
        
        <Button
          onClick={onExport}
          disabled={!canExport || isProcessing}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold"
        >
          <Download className="w-4 h-4 mr-2" />
          {isProcessing ? 'PROCESSING...' : 'EXPORT PNG'}
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
