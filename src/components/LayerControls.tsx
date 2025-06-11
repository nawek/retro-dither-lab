
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { EffectLayer } from './LayerSystem';

interface LayerControlsProps {
  layer: EffectLayer | null;
  onLayerUpdate: (layerId: string, updates: Partial<EffectLayer>) => void;
  isProcessing: boolean;
  availableControls: string[];
}

const LayerControls: React.FC<LayerControlsProps> = ({
  layer,
  onLayerUpdate,
  isProcessing,
  availableControls,
}) => {
  if (!layer) {
    return (
      <div className="space-y-6 bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-bold text-white font-mono mb-4">
          LAYER CONTROLS
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-500 font-mono text-sm">No layer selected</div>
        </div>
      </div>
    );
  }

  const updateSetting = (key: string, value: number) => {
    onLayerUpdate(layer.id, {
      settings: {
        ...layer.settings,
        [key]: value,
      },
    });
  };

  const controlComponents = {
    brightness: (
      <div key="brightness">
        <label className="block text-sm font-semibold text-cyan-400 font-mono mb-3">
          BRIGHTNESS: {layer.settings.brightness}%
        </label>
        <Slider
          value={[layer.settings.brightness]}
          onValueChange={(value) => updateSetting('brightness', value[0])}
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
          CONTRAST: {layer.settings.contrast}%
        </label>
        <Slider
          value={[layer.settings.contrast]}
          onValueChange={(value) => updateSetting('contrast', value[0])}
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
          THRESHOLD: {layer.settings.threshold}
        </label>
        <Slider
          value={[layer.settings.threshold]}
          onValueChange={(value) => updateSetting('threshold', value[0])}
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
          NOISE LEVEL: {layer.settings.noiseLevel}%
        </label>
        <Slider
          value={[layer.settings.noiseLevel]}
          onValueChange={(value) => updateSetting('noiseLevel', value[0])}
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
          SATURATION: {layer.settings.saturation}%
        </label>
        <Slider
          value={[layer.settings.saturation]}
          onValueChange={(value) => updateSetting('saturation', value[0])}
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
          POSTERIZE: {layer.settings.posterize} colors
        </label>
        <Slider
          value={[layer.settings.posterize]}
          onValueChange={(value) => updateSetting('posterize', value[0])}
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
          BLUR: {layer.settings.blur.toFixed(1)}px
        </label>
        <Slider
          value={[layer.settings.blur]}
          onValueChange={(value) => updateSetting('blur', value[0])}
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
        LAYER CONTROLS
      </h3>
      
      <div className="text-xs font-semibold text-cyan-400 font-mono mb-4">
        EDITING: {layer.name}
      </div>
      
      <div className="space-y-6">
        {availableControls.map(control => controlComponents[control] || null)}
      </div>
    </div>
  );
};

export default LayerControls;
